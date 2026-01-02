"use client";

import { useState } from "react";
import { TempMailMessage } from "@/types/mail";
import InboxRow from "./inbox-row";
import InboxEmpty from "./inbox-empty";
import InboxDetailView from "./inbox-detail-view";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDeleteMessage, useMarkAsRead } from "@/hooks/useMessageActions";
import { MAX_INBOX_HEIGHT_MOBILE } from "@/lib/constants";

type Props = {
  messages: TempMailMessage[];
  isLoading?: boolean;
};

export default function InboxList({ messages, isLoading }: Props) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const deleteMessage = useDeleteMessage();
  const markAsRead = useMarkAsRead();

  const selectedMessage = selectedMessageId
    ? messages.find((msg) => msg.id === selectedMessageId)
    : null;

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessageId(messageId);
    // Mark message as read when opened
    const message = messages.find((msg) => msg.id === messageId);
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
      <div
        className="flex flex-col overflow-hidden rounded-lg border-2 border-border"
        style={{
          height: selectedMessage ? "600px" : "auto",
        }}
      >
        {selectedMessage ? (
          <InboxDetailView
            message={selectedMessage}
            onBack={handleBack}
            onDelete={() => handleDeleteMessage(selectedMessage.id)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[2fr_3fr_1fr] gap-3 border-b-1 border-border bg-muted px-4 py-4 text-base font-bold text-foreground sm:gap-4 sm:px-6 sm:py-5">
              <span>Sender</span>
              <span>Subject</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Messages List - Scrollable - Show ~6 emails */}
            <ScrollArea className="h-[384px] sm:h-[420px]" type="always">
              {messages.length === 0 ? (
                <InboxEmpty />
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div key={msg.id}>
                      <InboxRow
                        message={msg}
                        isSelected={selectedMessageId === msg.id}
                        onClick={() => handleMessageSelect(msg.id)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg.id);
                        }}
                      />
                      {index !== messages.length - 1 && <Separator />}
                    </div>
                  ))}
                </>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </section>
  );
}
