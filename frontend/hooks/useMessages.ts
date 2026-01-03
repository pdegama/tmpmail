import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { TempMailMessage, mapEmailToTempMailMessage, type Email } from "@/types/mail";
import { emailService } from "@/lib/services/email.service";
import { useAuth } from "@/providers/auth-provider";
import { useWebSocket } from "./useWebSocket";
import { insertEmailAtTop } from "@/lib/utils/email-cache";

const DEFAULT_LIMIT = 10;

export function useMessages(email?: string) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

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
    // WebSocket integration handles real-time updates
  });

  // Handle WebSocket email updates
  const handleEmailReceived = useCallback(
    (newEmail: Email) => {
      if (newEmail && email) {
        insertEmailAtTop(queryClient, email, newEmail);
      }
    },
    [queryClient, email]
  );

  // WebSocket connection for real-time updates
  const { isConnected: isWebSocketConnected } = useWebSocket({
    mailboxEmail: email,
    token: token || null,
    enabled: !!email && !!token,
    onEmailReceived: handleEmailReceived,
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
    isWebSocketConnected,
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
