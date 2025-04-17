"use client";
import { HubNotas } from "components/aceternity";
import { ShootingStars, StarsBackground } from "components/aceternity";
import {} from "components/aceternity";
import { useBreadcrumbs } from "lib";
import React, { useEffect } from "react";
const cardData = [
  {
    text: "Lançamento de Saídas",
    description: "Pneus em saída? Lance para a portaria os pneus enviados.",
    link: "/central/portaria/lancamento",
    colors: [
      [59, 130, 246],
      [139, 92, 246],
    ],
    containerClassName: "bg-black",
  },
  {
    text: "Conferência na Portaria",
    description:
      "Para o porteiro que está liberando saída de pneus, verifique os lançamentos.",
    link: "/central/portaria/conferencia",
    colors: [
      [236, 72, 153],
      [232, 121, 249],
    ],
    containerClassName: "bg-black",
  },
  {
    text: "Histórico de Saídas",
    description:
      "Precisando ver as movimentações de saída dos pneus? Verifique os dados necessários.",
    link: "/central/portaria/historico",
    colors: [
      [37, 99, 235],
      [20, 184, 166],
    ],
    containerClassName: "bg-black",
  },
];
const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/central" },
      { label: "Controle de Saída" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="dark h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-foreground text-6xl">
        Central de Controle de Saídas
      </h1>
      <div className="w-2/3 z-50">
        <HubNotas cards={cardData} />
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};

export default Page;
