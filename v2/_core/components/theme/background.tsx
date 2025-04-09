import React from "react";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div className="absolute -right-36 -top-36 h-[500px] w-[500px] dark:bg-emerald-500/20 bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-36 -left-36 h-[500px] w-[500px] dark:bg-lime-500/20 bg-lime-500/10 rounded-full blur-[100px]" />
    </div>
  );
}
