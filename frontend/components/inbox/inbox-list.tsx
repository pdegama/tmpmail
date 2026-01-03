"use client";

import { useState } from "react";
import { TempMailMessage } from "@/types/mail";
import InboxRow from "./inbox-row";
import InboxEmpty from "./inbox-empty";
import InboxDetailView from "./inbox-detail-view";
import InboxPagination from "./inbox-pagination";
import { Separator } from "@/components/ui/separator";
import { useDeleteMessage, useMarkAsRead } from "@/hooks/useMessageActions";

type Props = {
  messages: TempMailMessage[];
  isLoading?: boolean;
  mailboxEmail?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  totalEmails?: number;
};

export default function InboxList({
  messages,
  isLoading,
  mailboxEmail,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  totalEmails,
}: Props) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const deleteMessage = useDeleteMessage(mailboxEmail);
  const markAsRead = useMarkAsRead(mailboxEmail);

  const selectedMessage = selectedMessageId
    ? messages.find((msg) => (msg._id || msg.id) === selectedMessageId)
    : null;

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
    // Mark message as read when opened
    const message = messages.find(
      (msg) => (msg._id || msg.id) === messageId
    );
    if (message && !message.isRead) {
      markAsRead.mutate(messageId);
    }
  };

  const handleBack = () => {
    setSelectedMessageId(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage.mutate(messageId, {
      onSuccess: () => {
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null);
        }
      },
    });
  };

  if (isLoading) {
    return null; // Loading state handled by parent with skeleton
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <div className="flex flex-col rounded-lg border-2 border-border">
        {selectedMessage ? (
          <InboxDetailView
            message={selectedMessage}
            onBack={handleBack}
            onDelete={() => handleDeleteMessage(selectedMessage._id || selectedMessage.id)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[2fr_3fr_1fr] gap-3 border-b-1 border-border bg-muted px-4 py-4 text-base font-bold text-foreground sm:gap-4 sm:px-6 sm:py-5">
              <span>Sender</span>
              <span>Subject</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
              <InboxEmpty />
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={msg._id || msg.id}>
                    <InboxRow
                      message={msg}
                      mailboxEmail={mailboxEmail}
                      isSelected={selectedMessageId === (msg._id || msg.id)}
                      onClick={() => handleMessageSelect(msg._id || msg.id)}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(msg._id || msg.id);
                      }}
                    />
                    {index !== messages.length - 1 && <Separator />}
                  </div>
                ))}
              </>
            )}
            {/* Pagination */}
            {messages.length > 0 && fetchNextPage && (
              <InboxPagination
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                totalEmails={totalEmails}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
