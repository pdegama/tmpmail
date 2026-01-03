import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailService } from "@/lib/services/email.service";
import type { TempMailMessage } from "@/types/mail";

const DEBOUNCE_DELAY_MS = 2500; // 2.5 seconds

export function useEmailReadToggle(email: TempMailMessage, mailboxEmail?: string) {
    const queryClient = useQueryClient();
    const [localReadState, setLocalReadState] = useState(email.isRead ?? false);
    const originalReadStateRef = useRef(email.isRead ?? false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const pendingMutationRef = useRef<{
        emailId: string;
        isRead: boolean;
        originalState: boolean; // Store original state at toggle time
    } | null>(null);

    // Update local state when email prop changes (but not if we have a pending mutation)
    useEffect(() => {
        // Don't sync if we have a pending mutation - we're in the middle of a toggle
        if (pendingMutationRef.current) {
            return;
        }

        const newReadState = email.isRead ?? false;
        // Only update if the state actually changed (prevents unnecessary updates)
        if (newReadState !== localReadState) {
            setLocalReadState(newReadState);
        }
        originalReadStateRef.current = newReadState;
    }, [email.isRead, email._id]); // Include _id to reset when email changes

    const markAsReadMutation = useMutation({
        mutationFn: (emailId: string) => emailService.markAsRead(emailId),
        onSuccess: () => {
            // Update cache after successful API call
            if (mailboxEmail) {
                updateEmailInCache(email._id, { isRead: true }, mailboxEmail);
            }
            originalReadStateRef.current = true;
            pendingMutationRef.current = null;
        },
        onError: () => {
            // Revert on error
            setLocalReadState(originalReadStateRef.current);
            if (mailboxEmail) {
                updateEmailInCache(email._id, { isRead: originalReadStateRef.current }, mailboxEmail);
            }
            pendingMutationRef.current = null;
        },
    });

    const markAsUnreadMutation = useMutation({
        mutationFn: (emailId: string) => emailService.markAsUnread(emailId),
        onSuccess: () => {
            // Update cache after successful API call
            if (mailboxEmail) {
                updateEmailInCache(email._id, { isRead: false }, mailboxEmail);
            }
            originalReadStateRef.current = false;
            pendingMutationRef.current = null;
        },
        onError: () => {
            // Revert on error
            setLocalReadState(originalReadStateRef.current);
            if (mailboxEmail) {
                updateEmailInCache(email._id, { isRead: originalReadStateRef.current }, mailboxEmail);
            }
            pendingMutationRef.current = null;
        },
    });

    const updateEmailInCache = (
        emailId: string,
        updates: { isRead: boolean },
        mailbox: string
    ) => {
        queryClient.setQueryData(
            ["emails", mailbox],
            (oldData: any) => {
                if (!oldData?.pages) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        emails: page.emails.map((e: any) =>
                            e._id === emailId ? { ...e, read: updates.isRead } : e
                        ),
                    })),
                };
            }
        );
    };

    const toggleReadState = () => {
        // Capture the current original state before toggling
        const currentOriginalState = originalReadStateRef.current;
        const newReadState = !localReadState;

        // Clear existing debounce timer first
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        // Set pending mutation BEFORE updating cache/state
        // This ensures useEffect sees it and doesn't interfere
        pendingMutationRef.current = {
            emailId: email._id,
            isRead: newReadState,
            originalState: currentOriginalState, // Store original state at toggle time
        };

        setLocalReadState(newReadState);

        // Optimistically update cache immediately
        if (mailboxEmail) {
            updateEmailInCache(email._id, { isRead: newReadState }, mailboxEmail);
        }

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            if (pendingMutationRef.current) {
                const { emailId, isRead, originalState } = pendingMutationRef.current;

                // Use the original state that was captured when toggle was initiated
                // This prevents the useEffect from interfering with our comparison

                // Only make API call if state actually changed from original
                if (isRead !== originalState) {
                    if (isRead) {
                        markAsReadMutation.mutate(emailId);
                    } else {
                        markAsUnreadMutation.mutate(emailId);
                    }
                } else {
                    // State reverted to original, no API call needed
                    setLocalReadState(originalState);
                    if (mailboxEmail) {
                        updateEmailInCache(emailId, { isRead: originalState }, mailboxEmail);
                    }
                    pendingMutationRef.current = null;
                    debounceTimerRef.current = null;
                }
            }
        }, DEBOUNCE_DELAY_MS);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return {
        isRead: localReadState,
        toggleReadState,
        isPending:
            markAsReadMutation.isPending || markAsUnreadMutation.isPending,
    };
}

