"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    totalEmails?: number;
    currentCount?: number; // Number of emails currently displayed
};

export default function InboxPagination({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    totalEmails,
    currentCount = 0,
}: Props) {
    if (!hasNextPage && !totalEmails) {
        return null;
    }

    const formatRange = () => {
        if (totalEmails === undefined) {
            return null;
        }

        if (currentCount === 0 && totalEmails === 0) {
            return null;
        }

        const start = 1;
        const end = currentCount > 0 ? currentCount : totalEmails;
        const total = totalEmails;

        if (end >= total) {
            return `Showing ${start}-${total} of ${total} ${total === 1 ? "email" : "emails"}`;
        }

        return `Showing ${start}-${end} of ${total} ${total === 1 ? "email" : "emails"}`;
    };

    return (
        <div className="flex flex-row items-center justify-between gap-3 border-t px-4 py-4 sm:px-6">
            {formatRange() && (
                <p className="text-sm text-muted-foreground">
                    {formatRange()}
                </p>
            )}
            {hasNextPage && (
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="gap-2 cursor-pointer"
                >
                    {isFetchingNextPage ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <span>Load More</span>
                    )}
                </Button>
            )}
            {!hasNextPage && totalEmails !== undefined && totalEmails > 0 && (
                <p className="text-sm text-muted-foreground">All emails loaded</p>
            )}
        </div>
    );
}

