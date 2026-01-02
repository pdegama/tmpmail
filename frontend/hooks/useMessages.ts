import { useQuery } from "@tanstack/react-query";
import { TempMailMessage } from "@/types/mail";
import { generateDemoMessages } from "@/lib/demo-data";
import { MOCK_API_DELAY } from "@/lib/constants";

export function useMessages(email?: string) {
  const query = useQuery({
    queryKey: ["messages", email],
    enabled: !!email, // only fetch after email exists
    queryFn: async (): Promise<TempMailMessage[]> => {
      // Mock API delay
      await new Promise((r) => setTimeout(r, MOCK_API_DELAY.NORMAL));

      // Return demo messages
      return generateDemoMessages();
    },
    // WebSocket integration will handle real-time updates later
    // refetchInterval: 10_000,
  });

  return {
    ...query,
    // Expose refetch for manual refresh
    refetchMessages: query.refetch,
  };
}

export function useMessageDetail(messageId: string, email?: string) {
  return useQuery({
    queryKey: ["message-detail", messageId, email],
    enabled: !!email && !!messageId,
    queryFn: async (): Promise<TempMailMessage | null> => {
      // Mock API delay
      await new Promise((r) => setTimeout(r, MOCK_API_DELAY.FAST));

      // Find message in demo data
      const messages = generateDemoMessages();
      return messages.find((msg) => msg.id === messageId) || null;
    },
  });
}
