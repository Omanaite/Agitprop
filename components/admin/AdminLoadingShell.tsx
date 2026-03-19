"use client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type AdminLoadingShellProps = {
  mode?: "login" | "console";
};

export function AdminLoadingShell({
  mode = "console",
}: AdminLoadingShellProps) {
  return (
    <SkeletonTheme
      baseColor="var(--admin-skeleton-base)"
      highlightColor="var(--admin-skeleton-highlight)"
      borderRadius={16}
    >
      <div className="admin-shell p-6 md:p-10">
        {mode === "login" ? (
          <div className="mx-auto max-w-md space-y-6">
            <div className="flex justify-end">
              <Skeleton width={180} height={44} />
            </div>
            <div className="admin-card p-6 md:p-8">
              <Skeleton width={120} height={12} />
              <div className="mt-4">
                <Skeleton width="60%" height={34} />
              </div>
              <div className="mt-2">
                <Skeleton width="80%" height={18} />
              </div>
              <div className="mt-8 space-y-4">
                <Skeleton height={58} />
                <Skeleton height={58} />
                <Skeleton height={50} />
              </div>
              <div className="mt-6">
                <Skeleton width="45%" height={14} />
              </div>
              <div className="mt-3 flex gap-3">
                <Skeleton width={120} height={42} />
                <Skeleton width={120} height={42} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-3">
                <Skeleton width={120} height={12} />
                <Skeleton width={220} height={36} />
                <Skeleton width={300} height={18} />
              </div>
              <div className="flex gap-3">
                <Skeleton width={180} height={44} />
                <Skeleton width={110} height={44} />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="admin-card p-5 space-y-4">
                <Skeleton width={140} height={18} />
                <Skeleton count={5} height={52} />
              </div>
              <div className="admin-card p-6 space-y-5">
                <Skeleton width={180} height={18} />
                <Skeleton height={52} />
                <Skeleton height={52} />
                <Skeleton height={130} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton height={44} />
                  <Skeleton height={44} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}
