/**
 * Get WebSocket URL
 * For now, always use production URL since local WebSocket is not configured
 * Convert https:// to wss:// for WebSocket connection
 */
export function getWebSocketURL(): string {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL_PROD}/api/ws`;
    // Convert https:// to wss:// for WebSocket
    return baseUrl.replace(/^https:/, "wss:");
}

/**
 * WebSocket message types
 */
export interface WebSocketAuthMessage {
    event: "auth";
    token: string;
}

export interface WebSocketMailMessage {
    event: "mail";
    data: any; // Email object from API
}

/**
 * Create WebSocket connection and send auth message on open
 */
export function createWebSocketConnection(
    token: string,
    onMessage: (email: any) => void,
    onOpen?: () => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
): WebSocket {
    const wsUrl = getWebSocketURL();

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        // Send auth message immediately on connection open
        const authMessage: WebSocketAuthMessage = {
            event: "auth",
            token: token,
        };
        ws.send(JSON.stringify(authMessage));

        // Call additional onOpen handler if provided
        if (onOpen) {
            onOpen();
        }
    };

    ws.onmessage = (event) => {
        try {
            const message: WebSocketMailMessage = JSON.parse(event.data);

            // Only handle mail events
            if (message.event === "mail" && message.data) {
                onMessage(message.data);
            }
        } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
        }
    };

    if (onError) {
        ws.onerror = onError;
    }

    if (onClose) {
        ws.onclose = onClose;
    }

    return ws;
}

