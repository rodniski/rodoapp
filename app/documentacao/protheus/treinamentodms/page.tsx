"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const erroContent: GenericDocumentationPageProps = {
    title: "Treinamento DMS ",
    group: "Protheus",
    date: "12 de fevereiro de 2024",
    description:
      "Nesta página, você encontrará informações detalhadas sobre o treinamento DMS ministrado por Marco Fregolente, abordando todos os processos essenciais para a gestão de ordens de serviço, estoque e operações no sistema. Explore tópicos como cadastros de clientes, serviços e veículos, utilização de filtros, criação de kits e análise de itens. Também aprenderá sobre operações críticas, como transferências de peças, controle de margens de venda, remessas externas e fechamento de OSs. O conteúdo está organizado em partes para facilitar o aprendizado, cobrindo desde os cadastros iniciais até o processo de inventário, garantindo uma compreensão completa do sistema.",
    sections: [
        {
          id: "parte1",
          title: "Parte 1",
          content:
            "Nesta seção, você aprenderá a usar filtros, cadastrar clientes, organizar grupos de serviços, registrar novos serviços e configurar tipos de tempo para otimizar e estruturar as operações no sistema.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/cp0yahfvdHA", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            },
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/q6DYLEKZBBY", 
              props: {
                className: "w-[700px] h-[400px] my-3",
                allow:
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true,
              },
            },
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/xon2w5t9tAQ", 
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
          id: "parte2",
          title: "Parte 2",
          content:
            "Nesta seção, você aprenderá sobre a criação e utilização de kits (inconvenientes) no sistema, além de esclarecer dúvidas gerais relacionadas ao uso e funcionalidades do DMS.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/V-u9ZsB_3Bc", 
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
          id: "parte3",
          title: "Parte 3",
          content:
            "Nesta etapa, você verá como realizar a conferência de itens, incluindo entradas, transferências e pedidos de compra, além de analisar itens pelo relatório OFIOC520. Também aprenderá a gerenciar armazéns e processos de entrada de mercadorias no sistema.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/p9NC_ex_12E", 
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
          id: "parte4",
          title: "Parte 4",
          content:
            "Nesta seção, você verá como realizar transferências de peças, gerenciar vendas abaixo da margem com aprovação adequada e executar remessas e retornos para atendimentos externos de forma eficiente no sistema.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/997oEoKYnZ0", 
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
          id: "parte5",
          title: "Parte 5",
          content:
            "Nesta seção, você aprenderá a emitir notas de remessa para atendimento a campo, gerenciar OSs com pedidos de compra, transferências ou notas de terceiros pendentes, além de compreender os processos relacionados às compras no sistema.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/cH_VLzpttSM", 
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
          id: "parte6",
          title: "Parte 6",
          content:
            "Nesta seção, você aprenderá a realizar o inventário no sistema.",
          additionalContent: [
            {
              type: "iframe", 
              content: "https://www.youtube.com/embed/1nBV5Su3K18", 
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
