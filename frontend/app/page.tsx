"use client";

import TempAddressCard from "@/components/temp-address-card";
import InboxList from "@/components/inbox/inbox-list";
import InboxListSkeleton from "@/components/inbox/inbox-list-skeleton";
import { useTempAddress } from "@/hooks/useTempAddress";
import { useMessages } from "@/hooks/useMessages";

export default function Home() {
  const {
    email,
    availableDomains,
    isLoading: addressLoading,
  } = useTempAddress();

  const {
    messages = [],
    isLoading: messagesLoading,
    isRefetching: messagesRefetching,
    refetchMessages,
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
    data: queryData,
  } = useMessages(email);

  const totalEmails = queryData?.pages[0]?.totalEmails;

  if (addressLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-sm font-medium text-muted-foreground">
            Generating temporary email…
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-full flex-col py-4 sm:py-6">
      {email && (
        <TempAddressCard
          email={email}
          availableDomains={availableDomains}
          onRefresh={() => refetchMessages()}
          isRefreshing={messagesRefetching}
        />
      )}

      <div className="mt-8 sm:mt-12">
        {messagesLoading ? (
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <InboxListSkeleton />
          </div>
        ) : (
          <InboxList
            messages={messages}
            isLoading={messagesLoading}
            mailboxEmail={email}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            totalEmails={totalEmails}
          />
        )}
      </div>
    </main>
  );
}
