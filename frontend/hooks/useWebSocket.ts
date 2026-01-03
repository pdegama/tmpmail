import { useEffect, useRef, useState, useCallback } from "react";
import { createWebSocketConnection } from "@/lib/utils/websocket";
import type { Email } from "@/types/mail";

const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds

interface UseWebSocketOptions {
    mailboxEmail?: string;
    token: string | null;
    enabled?: boolean;
    onEmailReceived: (email: Email) => void;
}

export function useWebSocket({
    mailboxEmail,
    token,
    enabled = true,
    onEmailReceived,
}: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shouldConnectRef = useRef(false);
    const isConnectingRef = useRef(false);
    const onEmailReceivedRef = useRef(onEmailReceived);
    const connectionParamsRef = useRef<{
        enabled: boolean;
        mailboxEmail?: string;
        token: string | null;
    } | null>(null);

    // Keep onEmailReceived ref up to date without causing re-renders
    useEffect(() => {
        onEmailReceivedRef.current = onEmailReceived;
    }, [onEmailReceived]);

    const connect = useCallback(() => {
        // Don't connect if conditions aren't met
        if (!enabled || !mailboxEmail || !token) {
            return;
        }

        // Don't connect if already connected or connecting
        if (
            wsRef.current?.readyState === WebSocket.OPEN ||
            isConnectingRef.current
        ) {
            return;
        }

        // Close existing connection if any
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        isConnectingRef.current = true;
        setIsConnecting(true);
        setError(null);
        shouldConnectRef.current = true;

        try {
            const ws = createWebSocketConnection(
                token,
                (email: Email) => {
                    // Use ref to avoid dependency issues
                    onEmailReceivedRef.current(email);
                },
                () => {
                    // onOpen handler
                    isConnectingRef.current = false;
                    setIsConnected(true);
                    setIsConnecting(false);
                    setError(null);
                    retryCountRef.current = 0; // Reset retry count on successful connection
                },
                (errorEvent) => {
                    console.error("WebSocket error:", errorEvent);
                    isConnectingRef.current = false;
                    setError(new Error("WebSocket connection error"));
                    setIsConnected(false);
                    setIsConnecting(false);
                },
                (closeEvent) => {
                    isConnectingRef.current = false;
                    setIsConnected(false);
                    setIsConnecting(false);

                    // Only attempt reconnection if we should be connected
                    // and it wasn't a clean close (code 1000)
                    if (
                        shouldConnectRef.current &&
                        closeEvent.code !== 1000 &&
                        retryCountRef.current < MAX_RETRY_ATTEMPTS
                    ) {
                        const delay = Math.min(
                            INITIAL_RETRY_DELAY * Math.pow(2, retryCountRef.current),
                            MAX_RETRY_DELAY
                        );

                        retryTimeoutRef.current = setTimeout(() => {
                            retryCountRef.current++;
                            connect();
                        }, delay);
                    } else if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
                        setError(new Error("Max reconnection attempts reached"));
                    }
                }
            );

            wsRef.current = ws;
        } catch (err) {
            isConnectingRef.current = false;
            setIsConnecting(false);
            setError(err instanceof Error ? err : new Error("Failed to create WebSocket"));
        }
    }, [enabled, mailboxEmail, token]);

    const disconnect = useCallback(() => {
        shouldConnectRef.current = false;
        isConnectingRef.current = false;

        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close(1000); // Clean close
            wsRef.current = null;
        }

        setIsConnected(false);
        setIsConnecting(false);
        retryCountRef.current = 0;
    }, []);

    const reconnect = useCallback(() => {
        disconnect();
        retryCountRef.current = 0;
        connect();
    }, [disconnect, connect]);

    // Connect when enabled, mailboxEmail, and token are available
    useEffect(() => {
        const currentParams = {
            enabled,
            mailboxEmail,
            token,
        };

        // Check if connection parameters actually changed
        const paramsChanged =
            !connectionParamsRef.current ||
            connectionParamsRef.current.enabled !== enabled ||
            connectionParamsRef.current.mailboxEmail !== mailboxEmail ||
            connectionParamsRef.current.token !== token;

        if (!paramsChanged) {
            return; // No change, don't reconnect
        }

        // Disconnect existing connection if parameters changed
        if (connectionParamsRef.current && wsRef.current) {
            disconnect();
        }

        // Update connection parameters
        connectionParamsRef.current = currentParams;

        // Only connect if all conditions are met
        if (enabled && mailboxEmail && token) {
            // Use a ref to track if we should still connect after async operations
            let shouldStillConnect = true;

            // Small delay to ensure previous disconnect completes
            const timeoutId = setTimeout(() => {
                if (
                    shouldStillConnect &&
                    connectionParamsRef.current?.enabled === enabled &&
                    connectionParamsRef.current?.mailboxEmail === mailboxEmail &&
                    connectionParamsRef.current?.token === token
                ) {
                    // Check if we're already connected or connecting
                    const currentState = wsRef.current?.readyState;
                    if (
                        currentState !== WebSocket.OPEN &&
                        currentState !== WebSocket.CONNECTING &&
                        !isConnectingRef.current
                    ) {
                        connect();
                    }
                }
            }, 100);

            return () => {
                shouldStillConnect = false;
                clearTimeout(timeoutId);
            };
        }

        return () => {
            // Cleanup handled above
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, mailboxEmail, token]);

    return {
        isConnected,
        isConnecting,
        error,
        reconnect,
    };
}

