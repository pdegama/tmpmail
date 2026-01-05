import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { mailboxService } from "@/lib/services/mailbox.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useTempAddress() {
  const queryClient = useQueryClient();
  const { token, setToken } = useAuth();

  const query = useQuery({
    queryKey: ["temp-address", token],
    queryFn: async () => {
      const response = await mailboxService.getOrCreateMailbox();
      const newToken = response.user.token;
      if (newToken) {
        setToken(newToken);
      }
      return {
        email: response.user.mailBox,
        expiredOn: response.user.expiredOn,
        availableDomains: response.availableDomain,
        token: newToken,
      };
    },
  });

  const changeAddressMutation = useMutation({
    mutationFn: async (mailbox: string) => {
      const response = await mailboxService.changeMailbox(mailbox);
      const newToken = response.token;
      if (newToken) {
        setToken(newToken);
      }
      return {
        email: response.mailbox,
        token: newToken,
      };
    },
    onSuccess: (data) => {
      // Preserve availableDomains from existing cache
      const existingData = queryClient.getQueryData<{
        email: string;
        expiredOn?: string;
        availableDomains: string[];
        token: string;
      }>(["temp-address", token]);

      queryClient.setQueryData(["temp-address", data.token], {
        email: data.email,
        token: data.token,
        availableDomains: existingData?.availableDomains || [],
        expiredOn: existingData?.expiredOn,
      });
      queryClient.removeQueries({ queryKey: ["messages"] });
      toast.success("Email address changed successfully");
    },
    onError: (error: AxiosError) => {
      let errorMessage = "Failed to change email address. Please try again.";

      if (error.response?.status === 400) {
        // Extract error message from backend response
        const responseData = error.response.data as { message?: string; error?: string };
        errorMessage = responseData?.message || responseData?.error || "This email address is already taken. Please choose a different one.";
      } else if (error.response?.status) {
        errorMessage = `Error: ${error.response.status}. Please try again.`;
      }

      toast.error(errorMessage, { position: 'top-center' });
    },
  });

  const shuffleAddressMutation = useMutation({
    mutationFn: async () => {
      const response = await mailboxService.shuffleMailbox();
      const newToken = response.token;
      if (newToken) {
        setToken(newToken);
      }
      return {
        email: response.mailbox,
        token: newToken,
      };
    },
    onSuccess: (data) => {
      // Preserve availableDomains from existing cache
      const existingData = queryClient.getQueryData<{
        email: string;
        expiredOn?: string;
        availableDomains: string[];
        token: string;
      }>(["temp-address", token]);

      queryClient.setQueryData(["temp-address", data.token], {
        email: data.email,
        token: data.token,
        availableDomains: existingData?.availableDomains || [],
        expiredOn: existingData?.expiredOn,
      });
      queryClient.removeQueries({ queryKey: ["messages"] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async () => {
      return null;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["temp-address"] });
      queryClient.removeQueries({ queryKey: ["messages"] });
    },
  });

  return {
    ...query,
    email: query.data?.email,
    availableDomains: query.data?.availableDomains || [],
    changeAddress: (mailbox: string) => changeAddressMutation.mutate(mailbox),
    shuffleAddress: () => shuffleAddressMutation.mutate(),
    deleteAddress: deleteAddressMutation.mutate,
    isChanging: changeAddressMutation.isPending,
    isShuffling: shuffleAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
}