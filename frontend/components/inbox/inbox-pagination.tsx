"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    totalEmails?: number;
};

export default function InboxPagination({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    totalEmails,
}: Props) {
    if (!hasNextPage && !totalEmails) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-between gap-3 border-t px-4 py-4 sm:px-6">
            {totalEmails !== undefined && (
                <p className="text-sm text-muted-foreground">
                    {totalEmails} {totalEmails === 1 ? "email" : "emails"} total
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

