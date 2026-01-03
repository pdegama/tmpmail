import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { TempMailMessage, mapEmailToTempMailMessage } from "@/types/mail";
import { emailService } from "@/lib/services/email.service";

const DEFAULT_LIMIT = 10;

export function useMessages(email?: string) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["emails", email],
    enabled: !!email, // only fetch after email exists
    queryFn: async ({ pageParam }) => {
      const response = await emailService.getEmailList(
        DEFAULT_LIMIT,
        pageParam as string | undefined
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      // Return afterId if there are more pages, undefined otherwise
      return lastPage.isLast ? undefined : lastPage.afterId;
    },
    initialPageParam: undefined as string | undefined,
    // WebSocket integration will handle real-time updates later
    // refetchInterval: 10_000,
  });

  // Flatten pages and map to TempMailMessage format
  const messages: TempMailMessage[] =
    query.data?.pages.flatMap((page) =>
      page.emails.map(mapEmailToTempMailMessage)
    ) || [];

  return {
    ...query,
    messages,
    // Expose refetch for manual refresh
    refetchMessages: query.refetch,
  };
}

export function useMessageDetail(messageId: string, mailboxEmail?: string) {
  const queryClient = useQueryClient();

  // Find message from cached infinite query data
  const cachedData = queryClient.getQueryData<{
    pages: Array<{ emails: Array<any> }>;
  }>(["emails", mailboxEmail]);

  if (cachedData) {
    // Find the full email data from the pages
    for (const page of cachedData.pages) {
      const found = page.emails.find((e: any) => e._id === messageId);
      if (found) {
        return {
          data: mapEmailToTempMailMessage(found),
          isLoading: false,
          isError: false,
          error: null,
        };
      }
    }
  }

  return {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  };
}
