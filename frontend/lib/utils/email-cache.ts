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

/**
 * Check if email already exists in cache
 */
export function emailExistsInCache(
    queryClient: QueryClient,
    mailboxEmail: string,
    emailId: string
): boolean {
    const cachedData = queryClient.getQueryData<{
        pages: Array<{ emails: Array<{ _id: string }> }>;
    }>(["emails", mailboxEmail]);

    if (!cachedData?.pages) return false;

    return cachedData.pages.some((page) =>
        page.emails.some((e) => e._id === emailId)
    );
}

/**
 * Insert a new email at the top of the infinite query cache
 * Prevents duplicates by checking if email already exists
 */
export function insertEmailAtTop(
    queryClient: QueryClient,
    mailboxEmail: string,
    email: Email
) {
    // Check if email already exists to prevent duplicates
    if (emailExistsInCache(queryClient, mailboxEmail, email._id)) {
        return;
    }

    queryClient.setQueryData(
        ["emails", mailboxEmail],
        (oldData: any) => {
            if (!oldData?.pages || oldData.pages.length === 0) {
                // If no pages exist, create first page with the email
                return {
                    pages: [
                        {
                            emails: [email],
                            totalEmails: 1,
                            isLast: true,
                            afterId: email._id,
                        },
                    ],
                    pageParams: [undefined],
                };
            }

            // Insert at the beginning of the first page
            const firstPage = oldData.pages[0];
            const updatedFirstPage = {
                ...firstPage,
                emails: [email, ...firstPage.emails],
                totalEmails: (firstPage.totalEmails || 0) + 1,
            };

            return {
                ...oldData,
                pages: [updatedFirstPage, ...oldData.pages.slice(1)],
            };
        }
    );
}

