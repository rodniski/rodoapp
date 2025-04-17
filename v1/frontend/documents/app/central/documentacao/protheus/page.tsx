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
      { label: "Protheus" },
    ]);
  }, [setBreadcrumbs]);

  const cardData = [
    {
      imageSrc: "/documentacao/protheus/backgrounds/agrupar.jpg",
      title: "Agrupar Ordens de Serviço para Faturamento",
      description: "Tutorial sobre como agrupar ordens de serviço para faturamento no sistema Protheus.",
      link: "/central/documentacao/protheus/agruparos" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/alterar-cliente.jpg",
      title: "Alterar Cliente da OS",
      description: "Tutorial sobre como alterar o cliente de uma Ordem de Serviço.",
      link: "/central/documentacao/protheus/alterarcliente" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/escala-produtivos.jpg",
      title: "Cadastrar Escala de Produtivos",
      description: "Tutorial sobre como cadastrar escalas de produtivos no módulo de Oficina, essencial para execução de serviços.",
      link: "/central/documentacao/protheus/escalaprodutivos" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/kit.jpg",
      title: "Cadastro de KIT",
      description: "Tutorial sobre como cadastrar grupos de inconvenientes no módulo de Oficina, associando serviços e peças.",
      link: "/central/documentacao/protheus/cadastrokit" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/contabilidade.jpg",
      title: "Contabilidade",
      description: "Tutorial sobre como corrigir centros de custo de notas fiscais no módulo de Contabilidade Gerencial.",
      link: "/central/documentacao/protheus/contabilidade" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/contabilizacao-os.jpg",
      title: "Contabilização de OS's",
      description: "Tutorial sobre a correta contabilização de OS's no Protheus, detalhando como preencher filial, centro de custo e mais.",
      link: "/central/documentacao/protheus/contabilizacaodeos" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/dicas-uteis.jpg",
      title: "Dicas Úteis",
      description: "Dicas úteis sobre o uso do Protheus, incluindo como aplicar filtros simples e avançados, alterar posições de colunas e mais.",
      link: "/central/documentacao/protheus/dicasuteis" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/erro.jpeg",
      title: "Erro ao Transmitir Notas Fiscais",
      description: "Tutorial sobre como identificar e corrigir o erro 029 - Falha no schema do XML ao transmitir notas fiscais para a SEFAZ.",
      link: "/central/documentacao/protheus/errotransmitirnotas" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/xml.jpg",
      title: "Exportação XML",
      description: "Tutorial sobre a exportação de arquivos XML no Protheus, utilizando a rotina SPEDNFE.",
      link: "/central/documentacao/protheus/exportarxml" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/gnre.jpg",
      title: "GNRE",
      description: "Tutorial sobre a GNRE, um documento essencial para o recolhimento de tributos estaduais em operações interestaduais.",
      link: "/central/documentacao/protheus/gnre" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/kardex.jpg",
      title: "Kardex",
      description: "Tutorial sobre como gerar relatórios do Kardex no módulo Estoque/Custos, acessando menus e mais.",
      link: "/central/documentacao/protheus/kardex" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/ordens-servico.jpg",
      title: "Ordens de Serviço",
      description: "Tutorial sobre Ordens de Serviço no sistema Protheus, explicando sua importância para organizar e controlar tarefas e mais.",
      link: "/central/documentacao/protheus/ordensdeservico" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/liberacao-nota.jpg",
      title: "Rel. Liberação Pré Nota",
      description: "Tutorial sobre a liberação de pré-nota no sistema Protheus",
      link: "/central/documentacao/protheus/liberacaoprenota" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/saldo-de-itens.jpg",
      title: "Saldo de Itens / Movimentação Entre Armazéns",
      description: "Tutorial sobre como utilizar a tela de filtros e pesquisa de itens (F3) para localizar produtos em armazéns e filiais e verificar saldos",
      link: "/central/documentacao/protheus/saldoitens" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/valor-informado.jpg",
      title: "Serviço com Valor Informado",
      description: "Tutorial sobre o serviço 'VI' para ajustar valores personalizados em Ordens de Serviço",
      link: "/central/documentacao/protheus/valorinformado" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/treinamento.jpg",
      title: "Treinamento DMS",
      description: "Tutorial completo sobre o treinamento DMS, abrangendo gestão de ordens de serviço, estoque e operações no sistema.",
      link: "/central/documentacao/protheus/treinamentodms" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/venda-pecas.jpg",
      title: "Venda de Peças",
      description: "Tutorial detalhado sobre como realizar vendas de peças no sistema TOTVS Oficina",
      link: "/central/documentacao/protheus/vendapecas" 
    },
    {
      imageSrc: "/documentacao/protheus/backgrounds/videoaulas.jpg",
      title: "Video Aulas",
      description: "Página com videoaulas sobre os principais processos do sistema Protheus, como abertura de pedidos, criação de filtros e mais.",
      link: "/central/documentacao/protheus/videoaulas" 
    }
  ];

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center gap-4">
      {cardData.map((card, index) => (
        <Link href={card.link} key={index}>
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
