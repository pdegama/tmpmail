"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, RefreshCcw, Shuffle, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTempAddress } from "@/hooks/useTempAddress";

type Props = {
  email: string;
  availableDomains?: string[];
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export default function TempAddressCard({
  email,
  availableDomains = [],
  onRefresh,
  isRefreshing = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [customEmailPrefix, setCustomEmailPrefix] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(
    availableDomains[0] || ""
  );
  const {
    changeAddress,
    shuffleAddress,
    deleteAddress,
    isChanging,
    isShuffling,
    isDeleting,
  } = useTempAddress();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChange = () => {
    if (customEmailPrefix.trim() && selectedDomain) {
      const fullEmail = `${customEmailPrefix.trim()}@${selectedDomain}`;
      changeAddress(fullEmail);
      setCustomEmailPrefix("");
    }
  };

  const handleShuffle = () => {
    shuffleAddress();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this temporary email address?")) {
      deleteAddress();
    }
  };

  const updateSelectedDomain = (domain: string) => {
    setSelectedDomain(domain);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-2 text-center sm:px-6">
      <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
        Your Temporary Email Address
      </h1>

      {/* Email box */}
      <div className="flex items-center justify-between rounded-lg border-2 border-border bg-muted/50 px-4 py-4 shadow-sm sm:px-6">
        <span className="truncate text-base font-medium sm:text-lg">
          {email}
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className="shrink-0 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {copied ? "Copied!" : "Copy email"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Domain Selection and Custom Email Input */}
      {availableDomains.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
            <div className="flex-1">
              <label
                htmlFor="email-prefix"
                className="mb-1 block text-sm font-medium text-muted-foreground"
              >
                Custom Email Prefix
              </label>
              <div className="flex gap-2">
                <input
                  id="email-prefix"
                  type="text"
                  value={customEmailPrefix}
                  onChange={(e) => setCustomEmailPrefix(e.target.value)}
                  placeholder="Enter email prefix"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customEmailPrefix.trim()) {
                      handleChange();
                    }
                  }}
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  @
                </span>
                <select
                  value={selectedDomain}
                  onChange={(e) => updateSelectedDomain(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {availableDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing || isChanging || isShuffling || isDeleting}
                className="gap-2 cursor-pointer"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                <span>Refresh</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh Message List</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {customEmailPrefix.trim() && selectedDomain && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChange}
                  disabled={isChanging || isShuffling || isDeleting || isRefreshing}
                  className="gap-2 cursor-pointer"
                >
                  {isChanging ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shuffle className="h-4 w-4" />
                  )}
                  <span>Change</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change to custom email</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
                disabled={isShuffling || isChanging || isDeleting || isRefreshing}
                className="gap-2 cursor-pointer"
              >
                {isShuffling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}
                <span>Shuffle</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate random email address</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || isChanging || isShuffling || isRefreshing}
                className="gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete this address</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}