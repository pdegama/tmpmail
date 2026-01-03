import { QueryClient } from "@tanstack/react-query";
import type { Email } from "@/types/mail";

/**
 * Update an email in the infinite query cache
 */
export function updateEmailInCache(
    queryClient: QueryClient,
    mailboxEmail: string,
    emailId: string,
    updates: Partial<Email>
) {
    queryClient.setQueryData(
        ["emails", mailboxEmail],
        (oldData: any) => {
            if (!oldData?.pages) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    emails: page.emails.map((e: any) =>
                        e._id === emailId ? { ...e, ...updates } : e
                    ),
                })),
            };
        }
    );
}

/**
 * Remove an email from the infinite query cache
 */
export function removeEmailFromCache(
    queryClient: QueryClient,
    mailboxEmail: string,
    emailId: string
) {
    queryClient.setQueryData(
        ["emails", mailboxEmail],
        (oldData: any) => {
            if (!oldData?.pages) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    emails: page.emails.filter((e: any) => e._id !== emailId),
                    totalEmails: Math.max(0, (page.totalEmails || 0) - 1),
                })),
            };
        }
    );
}

