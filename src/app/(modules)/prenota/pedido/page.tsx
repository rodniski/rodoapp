import { Background } from "ui/theme/background";
import React from "react";
import { IncludePedidoCard } from "./_internal/components/form";

export default function Page() {
  return (
    <div>
      <Background />
      <div className="flex flex-col h-[calc(100vh-60px)] w-full justify-center items-center overflow-hidden">
        <IncludePedidoCard />
      </div>
    </div>
  );
}
