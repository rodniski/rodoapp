import React from "react";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div className="absolute -right-70 -top-70 size-[700px] qhd:-right-50 qhd:-top-50 qhd:size-[900px] dark:bg-blue-400/20 bg-blue-400/20 rounded-full blur-[500px] opacity-50" />
      <div className="absolute -bottom-70 -left-70 size-[700px] qhd:-bottom-50 qhd:-left-50 qhd:size-[900px] dark:bg-violet-400/20 bg-violet-400/20 rounded-full blur-[500px] opacity-50" />
    </div>
  );
}
