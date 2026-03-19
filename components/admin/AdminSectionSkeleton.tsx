"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type AdminSectionSkeletonProps = {
  fields?: number;
  cards?: number;
};

export function AdminSectionSkeleton({
  fields = 4,
  cards = 3,
}: AdminSectionSkeletonProps) {
  return (
    <SkeletonTheme
      baseColor="var(--admin-skeleton-base)"
      highlightColor="var(--admin-skeleton-highlight)"
      borderRadius={16}
    >
      <section className="admin-card p-6 md:p-7">
        <Skeleton width={110} height={12} />
        <div className="mt-4">
          <Skeleton width={220} height={28} />
        </div>
        <div className="mt-3">
          <Skeleton width="75%" height={18} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, index) => (
            <Skeleton key={index} height={52} />
          ))}
        </div>
        <div className="mt-6 flex gap-4">
          <Skeleton width={130} height={44} />
          <Skeleton width={110} height={44} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Array.from({ length: cards }).map((_, index) => (
            <Skeleton key={index} height={140} />
          ))}
        </div>
      </section>
    </SkeletonTheme>
  );
}
