"use client";
import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import { Card } from "$/components/aceternity/card";
import React from "react";
import Link from "next/link";


const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "PowerBi" },
    ]);
  }, [setBreadcrumbs]);

  const cardData = [
    {
      imageSrc: "/documentacao/powerbi/acesso.png",
      title: "Acesso",
      description: "Tutorial de como acessar o Power Bi.",
      link: "/central/documentacao/powerbi/acesso" 
    },
    {
      imageSrc: "/documentacao/powerbi/utilizacao.jpg",
      title: "Como utilizar",
      description: "Tutorial sobre como utilizar o PowerBi",
      link: "/central/documentacao/powerbi/utilizacao" 
    },
    {
      imageSrc: "/documentacao/powerbi/exportacao.jpg",
      title: "Exportação de dados",
      description: "Tutorial sobre como exportar dados.",
      link: "/central/documentacao/powerbi/exportacao" 
    },
    {
      imageSrc: "/documentacao/powerbi/filtros.jpg",
      title: "Filtros",
      description: "Tutorial sobre como usar os filtros.",
      link: "/central/documentacao/powerbi/filtros" 
    },
    {
      imageSrc: "/documentacao/powerbi/relatorio.jpg",
      title: "Relatórios",
      description: "Lista de todos os relatórios disponíveis e onde encontra-los.",
      link: "/central/documentacao/powerbi/relatorios" 
    }
  ];

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center gap-4 mt-5">
      {cardData.map((card, index) => (
        <Link
        href={card.link}
        key={index}
        className="w-[300px] h-[400px] block"
      >
        <Card
          imageSrc={card.imageSrc}
          title={card.title}
          description={card.description}
        />
      </Link>
      
      ))}
    </div>
  );
};

export default Page;
