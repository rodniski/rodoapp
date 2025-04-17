"use client";

import { ShootingStars, StarsBackground } from "$/components/aceternity";
import { ThreeDCard } from "$/components/aceternity/card-3d-dinamico";
import { Button } from "$/components/ui";
import { useBreadcrumbs } from "lib";
import React, { useEffect } from "react";
import Link from "next/link";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/central" },
      { label: "Documentação" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center -ml-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Seja bem vindo à central de documentos <br /> Rodoparaná & Timber
        </h2>
        <h3 className="text-lg md:text-xl font-medium">
          Aqui você vai encontrar documentações sobre processos, dicas, tutoriais e muito mais.
        </h3>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/central/documentacao/ti">
          <Button variant="secondary">TI</Button>
        </Link>
        <Link href="/central/documentacao/protheus">
          <Button variant="secondary">Protheus</Button>
        </Link>
        <Link href="/central/documentacao/powerbi">
          <Button variant="secondary">Power BI</Button>
        </Link>
      </div>
    </main>
  );
};

export default Page;
