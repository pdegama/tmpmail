import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
    EmailListResponse,
} from "@/types/mail";

export const emailService = {
    getEmailList: async (
        limit?: number,
        after?: string
    ): Promise<EmailListResponse> => {
        const params = new URLSearchParams();
        if (limit !== undefined) {
            params.append("limit", limit.toString());
        }
        if (after) {
            params.append("after", after);
        }

        const queryString = params.toString();
        const url = queryString
            ? `${API_ENDPOINTS.EMAIL_LIST}?${queryString}`
            : API_ENDPOINTS.EMAIL_LIST;

        const response = await api.get<EmailListResponse>(url);
        return response.data;
    },

    markAsRead: async (emailId: string): Promise<{ message: string }> => {
        const response = await api.patch<{ message: string }>(
            API_ENDPOINTS.EMAIL_READ(emailId)
        );
        return response.data;
    },

    markAsUnread: async (emailId: string): Promise<{ message: string }> => {
        const response = await api.patch<{ message: string }>(
            API_ENDPOINTS.EMAIL_UNREAD(emailId)
        );
        return response.data;
    },

    deleteEmail: async (emailId: string): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(
            API_ENDPOINTS.EMAIL_DELETE(emailId)
        );
        return response.data;
    },
};

