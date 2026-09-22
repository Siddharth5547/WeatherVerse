import React from "react";

export default function SkeletonLoader({ theme = "dark" }) {
  const isDark = theme === "dark";
  const shimmer = isDark ? "bg-white/10" : "bg-black/10";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-6 animate-pulse pt-2 pb-16">
      {/* Hero Skeleton */}
      <div className="apple-card p-10 h-72 flex flex-col justify-between items-center text-center">
        <div className={`h-24 w-24 rounded-full ${shimmer} mb-4`} />
        <div className={`h-8 w-48 rounded-full ${shimmer} mb-2`} />
        <div className={`h-20 w-40 rounded-2xl ${shimmer} mb-2`} />
        <div className={`h-5 w-32 rounded-full ${shimmer}`} />
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="apple-card p-6 h-44 flex flex-col justify-between"
          >
            <div className={`h-5 w-24 rounded-full ${shimmer}`} />
            <div className={`h-9 w-28 rounded-xl ${shimmer}`} />
            <div className={`h-4 w-36 rounded-full ${shimmer}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
