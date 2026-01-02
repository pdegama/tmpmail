import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function InboxListSkeleton() {
  return (
    <div className="rounded-lg border">
      {/* Header */}
      <div className="grid grid-cols-[2fr_3fr_1fr] gap-4 border-b px-4 py-2 sm:px-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <div className="flex justify-end">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index}>
          <div className="grid grid-cols-[2fr_3fr_1fr] items-center gap-4 px-4 py-4 sm:px-6">
            {/* Sender */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>

            {/* Subject */}
            <Skeleton className="h-4 w-full" />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          {index < 4 && <Separator />}
        </div>
      ))}
    </div>
  );
}

