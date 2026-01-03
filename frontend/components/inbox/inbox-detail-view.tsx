"use client";

import { useState } from "react";
import { TempMailMessage } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Download } from "lucide-react";
import { formatDate, formatFileSize, sanitizeHtml } from "@/lib/utils";

type Props = {
  message: TempMailMessage;
  onBack: () => void;
  onDelete: () => void;
};

export default function InboxDetailView({ message, onBack, onDelete }: Props) {
  const [hoveredAttachment, setHoveredAttachment] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(url, "_blank");
    }
  };

  const isImage = (contentType: string) => {
    return contentType.startsWith("image/");
  };

  const getFileExtension = (contentType: string) => {
    const parts = contentType.split("/");
    if (parts.length > 1) {
      const ext = parts[1].split(".").pop() || parts[1];
      // Handle long content types like "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      if (ext.includes(".")) {
        return ext.split(".").pop()?.toUpperCase() || ext.toUpperCase();
      }
      return ext.toUpperCase();
    }
    return "FILE";
  };

  return (
    <div className="flex flex-col">
      {/* Header with Back and Delete buttons */}
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="gap-2 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      {/* Content area */}
      <div className="mx-0 sm:mx-8 max-w-5xl px-4 py-6 sm:px-6">
        {/* Sender Info */}
        <div className="mb-6">
          <div className="mb-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              {message.sender.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {message.sender.address}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(message.receivedAt)}
          </p>
        </div>

        {/* Subject */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-xl font-bold sm:text-2xl">{message.subject}</h1>
        </div>

        {/* Email Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.htmlContent ? (
            <div
              className="email-content"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(message.htmlContent),
              }}
              style={{
                fontFamily: "inherit",
                lineHeight: "1.6",
              }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.textContent || "No content available."}
            </div>
          )}
        </div>

        {/* Attachments - Horizontal row at the end */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-left text-sm font-semibold">
              Attachments ({message.attachments.length})
            </h3>

            {/* All attachments in a horizontal row */}
            <div className="flex flex-wrap gap-4">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredAttachment(attachment.id)}
                  onMouseLeave={() => setHoveredAttachment(null)}
                >
                  {isImage(attachment.contentType) ? (
                    // Image attachment with preview
                    <>
                      <div className="relative h-32 w-32 overflow-hidden rounded-lg border bg-muted">
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="h-full w-32 object-cover"
                        />
                        {hoveredAttachment === attachment.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-10 w-10 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(attachment.url, attachment.filename);
                              }}
                            >
                              <Download className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 w-32 truncate text-xs text-muted-foreground" title={attachment.filename}>
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </p>
                    </>
                  ) : (
                    // Document/file attachment with box
                    <>
                      <div className="relative flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-muted/50 p-3">
                        <div className="mb-2 text-center">
                          <Badge variant="secondary" className="text-[10px] font-semibold">
                            {getFileExtension(attachment.contentType)}
                          </Badge>
                        </div>
                        <p className="mb-auto line-clamp-2 max-w-full break-words text-center text-xs font-medium" title={attachment.filename}>
                          {attachment.filename}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {formatFileSize(attachment.size)}
                        </p>
                        {hoveredAttachment === attachment.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-10 w-10 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(attachment.url, attachment.filename);
                              }}
                            >
                              <Download className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
