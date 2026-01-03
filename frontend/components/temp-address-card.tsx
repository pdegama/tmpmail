"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCcw, Shuffle, Trash2, Loader2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [dialogOpen, setDialogOpen] = useState(false);
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

  // Update selectedDomain when availableDomains change
  useEffect(() => {
    if (availableDomains.length > 0 && !availableDomains.includes(selectedDomain)) {
      setSelectedDomain(availableDomains[0]);
    }
  }, [availableDomains, selectedDomain]);

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
      setDialogOpen(false);
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isChanging || isShuffling || isDeleting || isRefreshing || availableDomains.length === 0}
                    className="gap-2 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Customize Email</span>
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Change to custom email address</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Email Address</DialogTitle>
              <DialogDescription>
                Enter a custom email prefix and select a domain
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="email-prefix"
                  className="text-sm font-medium text-foreground"
                >
                  Email Prefix
                </label>
                <input
                  id="email-prefix"
                  type="text"
                  value={customEmailPrefix}
                  onChange={(e) => setCustomEmailPrefix(e.target.value)}
                  placeholder="Enter email prefix"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customEmailPrefix.trim() && selectedDomain) {
                      handleChange();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="domain-select"
                  className="text-sm font-medium text-foreground"
                >
                  Domain
                </label>
                <Select
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                >
                  <SelectTrigger id="domain-select">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        @{domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleChange}
                disabled={!customEmailPrefix.trim() || !selectedDomain || isChanging || isShuffling || isDeleting || isRefreshing}
                className="gap-2 cursor-pointer"
              >
                {isChanging ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : (
                  <span>Change</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

        {/* Delete button commented out for now */}
        {/* <TooltipProvider>
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
        </TooltipProvider> */}
      </div>
    </div>
  );
}