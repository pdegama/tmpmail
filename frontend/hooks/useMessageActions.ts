import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_API_DELAY } from "@/lib/constants";
import { TempMailMessage } from "@/types/mail";

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      // Mock API call to delete message
      await new Promise((r) => setTimeout(r, MOCK_API_DELAY.FAST));
      return messageId;
    },
    onSuccess: (messageId) => {
      // Optimistically update the messages cache
      queryClient.setQueriesData<Array<{ id: string }>>(
        { queryKey: ["messages"] },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((msg) => msg.id !== messageId);
        }
      );

      // Also invalidate to refetch if needed
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      // Mock API call to mark message as read
      await new Promise((r) => setTimeout(r, MOCK_API_DELAY.FAST));
      return messageId;
    },
    onSuccess: (messageId) => {
      // Optimistically update the messages cache to mark as read
      queryClient.setQueriesData<TempMailMessage[]>(
        { queryKey: ["messages"] },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          );
        }
      );
    },
  });
}

