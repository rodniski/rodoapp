"use client";

import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "doc/components/GenericDocumentationPage";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "Protheus", href: "/central/documentacao/protheus" },
      { label: "Video Aulas" },
    ]);
  }, [setBreadcrumbs]);

  const erroContent: GenericDocumentationPageProps = {
    title: "Video Aulas",
    date: "8 de fevereiro de 2024",
    description:
      "Nesta página, você aprenderá os principais processos do sistema Protheus, desde a abertura de pedidos de venda e inclusão de peças até a criação de filtros para facilitar a pesquisa por descrição ou código. Descubra como finalizar pedidos, gerar orçamentos, liberar margens, conferir itens e imprimir orçamentos. Também verá o fluxo completo da oficina, desde a abertura da Ordem de Serviço (OS), requisição de peças e serviços, até a finalização. Por fim, entenderá o processo de faturamento com a emissão de NFe e NFSe, com a ressalva de que uma nova rotina de faturamento está em desenvolvimento para otimizar esse processo.",
    sections: [
        {
          id: "introducao",
          title: "Introdução ao Protheus",
          content:
            "Nesta seção, você dará seus primeiros passos com o Protheus.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/Uzv3Ov5uFp4", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            },
          ],
        },
        {
          id: "abertura-de-pedido",
          title: "Abertura de Pedido de Venda e Inclusão de Peças",
          content:
            "Nesta seção, você aprenderá sobre a abertura de pedidos e inclusão de peças.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/UhvdGw5ZfuY", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "filtro-descrição-código",
          title: "Criar Filtro para Pesquisar Peças por Descrição/Código",
          content:
            "Nesta seção, você aprenderá sobre como criar filtro para pesquisar peças por descrição/código.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/HWzgmA2Z1D0", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "finalizar-pedido",
          title: "Finalizar Pedido e Iniciar Orçamento",
          content:
            "Nesta seção, você aprenderá sobre como finalizar pedido e iniciar um orçamento.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/Io8dQTgcJ2g", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "liberacao-de-margem",
          title: "Liberação de Margem e Conferência de Itens",
          content:
            "Nesta seção, você aprenderá sobre como fazer liberação de margem e conferência de itens.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/lSWomI6KnmI", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "imprimir-orcamento",
          title: "Imprimir Orçamento",
          content:
            "Nesta seção, você aprenderá como imprimir orçamento.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/bwi58MSqug0", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "abertura-os",
          title: "Abertura de OS",
          content:
            "Nesta seção, você aprenderá como fazer a abertura de uma OS.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/8Z_DvgD8WR8", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "requisitar-pecas-os",
          title: "Requisitar Peças na OS",
          content:
            "Nesta seção, você aprenderá como requisitar peças na OS.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/Hxl8NlHz5v8", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "requisitar-servicos-os",
          title: "Requisitar Serviços na OS",
          content:
            "Nesta seção, você aprenderá como requisitar serviços na OS.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/2FJY8eCmDSM", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "finalizar-os",
          title: "Finalizando a OS",
          content:
            "Nesta seção, você aprenderá como finalizar a OS.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/j2njw8oTBdE", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
        {
          id: "emissao-nfs",
          title: "Emissão de NFe e NFSe",
          content:
            "Nesta seção, você aprenderá como emitir uma NFe. Obs: Está em desenvolvimento uma nova rotina de faturamento que substituirá este processo, será liberada em breve para testes.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/Ww4WHHifUuo", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            }
          ],
        },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content:
          "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!",
      },
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () =>
        window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank"),
    },
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...erroContent} />
    </div>
  );
};

export default Page;
