import Logo from "@/public/logo/logo";
import React from "react";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div className="absolute -right-36 -top-36 size-[500px] qhd:-right-50 qhd:-top-50 qhd:size-[900px] dark:bg-emerald-400/20 bg-emerald-400/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-36 -left-36 size-[500px] qhd:-bottom-50 qhd:-left-50 qhd:size-[900px] dark:bg-lime-400/20 bg-lime-400/20 rounded-full blur-[100px]" />
    </div>
  );
}
