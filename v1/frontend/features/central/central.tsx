"use client";

import React from "react";
import { cn } from "lib";
import { BentoGrid, BentoGridItem } from "components/aceternity";
import { items } from "./components/constants";

function BentoInicial() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[15rem] fhd:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          href={item.href}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}




export default BentoInicial;
