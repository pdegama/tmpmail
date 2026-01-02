import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
    MailboxResponse,
    MailboxChangeResponse,
    MailboxShuffleResponse,
} from "@/types/mail";

export const mailboxService = {
    getOrCreateMailbox: async (): Promise<MailboxResponse> => {
        const response = await api.get<MailboxResponse>(API_ENDPOINTS.MAILBOX);
        return response.data;
    },

    changeMailbox: async (mailbox: string): Promise<MailboxChangeResponse> => {
        const response = await api.patch<MailboxChangeResponse>(
            API_ENDPOINTS.MAILBOX_CHANGE,
            { mailbox }
        );
        return response.data;
    },

    shuffleMailbox: async (): Promise<MailboxShuffleResponse> => {
        const response = await api.patch<MailboxShuffleResponse>(
            API_ENDPOINTS.MAILBOX_SHUFFLE,
            {}
        );
        return response.data;
    },
};

