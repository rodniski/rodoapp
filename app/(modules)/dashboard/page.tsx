"use client";

import React from "react";
import { dashboardData } from "./_internal/data/menu-items";
import dynamic from "next/dynamic";
import { Background } from "comp";
import { formatUsername, getCurrentUsername } from "utils";
const Carousel = dynamic(
  () => import("./_internal/components").then((mod) => mod.Carousel),
  {
    loading: () => (
      <div className="h-48 flex items-center justify-center rounded-lg bg-muted/50">
        {" "}
        <p className="text-muted-foreground">Carregando conteúdo...</p>
      </div>
    ),
    ssr: false,
  }
);

export default function DashboardPage() {
  return (
    <main className="w-full h-[calc(100vh-65px)] flex flex-col justify-center overflow-y-auto lg:px-5 fhd:px-20">
      <Background />
      <span className="absolute top-20 z-10 text-end text-2xl font-bold">
        Bem vindo,{" "}
        <span className="text-primary">
          {formatUsername(getCurrentUsername())}!
        </span>
      </span>
      <div className="z-10 space-y-8">
        {dashboardData.map((category) => (
          <section
            key={category.id}
            aria-labelledby={`category-title-${category.id}`}
          >
            <Carousel cards={category.cards} category={category.title} />
          </section>
        ))}
      </div>
    </main>
  );
}
