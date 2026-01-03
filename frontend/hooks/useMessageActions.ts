import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailService } from "@/lib/services/email.service";

export function useDeleteMessage(mailboxEmail?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      await emailService.deleteEmail(emailId);
      return emailId;
    },
    onSuccess: (emailId) => {
      if (mailboxEmail) {
        // Remove email from infinite query cache
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

      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useMarkAsRead(mailboxEmail?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailId: string) => {
      await emailService.markAsRead(emailId);
      return emailId;
    },
    onSuccess: (emailId) => {
      if (mailboxEmail) {
        // Update email in infinite query cache
        queryClient.setQueryData(
          ["emails", mailboxEmail],
          (oldData: any) => {
            if (!oldData?.pages) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                emails: page.emails.map((e: any) =>
                  e._id === emailId ? { ...e, read: true } : e
                ),
              })),
            };
          }
        );
      }
    },
  });
}

