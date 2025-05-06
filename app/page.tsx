"use client";
import { ScrollArea } from "ui";
import { Hero } from "./_lp"; // Hero carrega normalmente
import dynamic from "next/dynamic"; // Importa a função dynamic
import { Background } from "comp";

// Carrega os outros componentes dinamicamente
// O 'ssr: false' é opcional, mas comum para componentes abaixo da dobra
// que podem ter interatividade apenas no cliente. Se precisar de SSR, remova-o.
const Features = dynamic(() => import("./_lp").then((mod) => mod.Features), {
  ssr: false,
});
const CTA = dynamic(() => import("./_lp").then((mod) => mod.CTA), {
  ssr: false,
});
const Footer = dynamic(() => import("./_lp").then((mod) => mod.Footer), {
  ssr: false,
});

export default function Home() {
  return (
    <ScrollArea className="relative min-h-screen">
      <Background />

      <div className="relative z-10 flex flex-col items-center justify-center w-screen">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </ScrollArea>
  );
}
