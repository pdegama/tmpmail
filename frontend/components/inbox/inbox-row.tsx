"use client";

import { TempMailMessage } from "@/types/mail";
import { Eye, Trash2, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEmailReadToggle } from "@/hooks/useEmailReadToggle";

type Props = {
  message: TempMailMessage;
  mailboxEmail?: string;
  isSelected?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
};

export default function InboxRow({
  message,
  mailboxEmail,
  isSelected = false,
  onClick,
  onDelete,
}: Props) {
  const attachmentCount = message.attachments?.length || 0;
  const { isRead, toggleReadState, isPending: isTogglePending } = useEmailReadToggle(
    message,
    mailboxEmail
  );

  const handleRowClick = () => {
    onClick();
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
  };

  const handleReadToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleReadState();
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[2fr_3fr_auto] items-center gap-3 px-4 py-3.5 transition-colors sm:gap-4 sm:px-6 sm:py-4",
        isSelected
          ? "bg-muted"
          : "hover:bg-muted/50 cursor-pointer",
        !isRead && "font-semibold"
      )}
      onClick={handleRowClick}
    >
      {/* Sender */}
      <div className="min-w-0 truncate">
        <div className="truncate text-xs font-medium sm:text-lg">
          {message.sender.name}
        </div>
        <div className="truncate text-xs font-light text-muted-foreground sm:text-sm">
          {message.sender.address}
        </div>
      </div>

      {/* Subject */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 truncate text-base sm:text-lg">
          {message.subject}
        </div>
        {attachmentCount > 0 && (
          <Badge
            variant="secondary"
            className="shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-0.5 text-xs font-medium"
          >
            {attachmentCount} {attachmentCount === 1 ? "attachment" : "attachments"}
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-0.5 sm:gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 cursor-pointer sm:h-9 sm:w-9"
                onClick={handleReadToggleClick}
                disabled={isTogglePending}
              >
                {isRead ? (
                  <MailOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRead ? "Mark as unread" : "Mark as read"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 cursor-pointer sm:h-9 sm:w-9"
                onClick={handleEyeClick}
              >
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View message</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive sm:h-9 sm:w-9"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}