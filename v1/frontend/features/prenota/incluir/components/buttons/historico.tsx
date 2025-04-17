"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger, Timeline } from "ui";
import { History } from "lucide-react";

export default function Historico() {
  return (
    <Sheet>
      {/* Parando a propagação do evento no trigger */}
      <SheetTrigger className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <History />
        <span>Histórico</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full">
        <h2 className="w-full text-center mb-10">Histórico</h2>
        <Timeline />
      </SheetContent>
    </Sheet>
  );
}
