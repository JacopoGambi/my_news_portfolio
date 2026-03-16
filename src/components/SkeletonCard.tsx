'use client';

export function SkeletonMarketCard() {
  return (
    <div className="bg-card-bg rounded-xl border border-border-color p-4 animate-pulse">
      <div className="h-3 w-16 bg-skeleton rounded mb-3" />
      <div className="h-6 w-24 bg-skeleton rounded mb-2" />
      <div className="h-3 w-20 bg-skeleton rounded" />
    </div>
  );
}

export function SkeletonNewsCard() {
  return (
    <div className="flex gap-5 py-5 animate-pulse">
      <div className="flex-1">
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-20 bg-skeleton rounded-full" />
          <div className="h-4 w-16 bg-skeleton rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-skeleton rounded mb-3" />
        <div className="h-4 w-full bg-skeleton rounded mb-2" />
        <div className="h-4 w-full bg-skeleton rounded mb-2" />
        <div className="h-4 w-2/3 bg-skeleton rounded mb-4" />
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-skeleton rounded" />
          <div className="h-3 w-16 bg-skeleton rounded" />
        </div>
      </div>
      <div className="hidden md:block w-52 h-32 bg-skeleton rounded-lg flex-shrink-0" />
    </div>
  );
}

export function SkeletonCalendarRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="h-10 w-16 bg-skeleton rounded" />
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-skeleton rounded mb-1" />
        <div className="h-3 w-1/3 bg-skeleton rounded" />
      </div>
      <div className="h-5 w-12 bg-skeleton rounded-full" />
    </div>
  );
}
