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
      { label: "Exportação de XML" },
    ]);
  }, [setBreadcrumbs]);

  const escalaProdutivosContent: GenericDocumentationPageProps = {
    title: "Exportação de XML",
    date: "1 de fevereiro de 2024",
    description:
      "",
    sections: [
      {
        id: "ambiente",
        title: "Ambiente",
        content: "Cross Segmentos - Backoffice Protheus - Doc. Eletrônicos - NFe - a partir da versão 12.1.25Cross Segmentos - TSS - a partir da versão 12",
        additionalContent: [
        ],
      },
      {
        id: "solucao",
        title: "Solução",
        content: "Para exportar arquivos na rotina SPEDNFE, acesse o módulo Faturamento e vá até NFESEFAZ (SPEDNFE). Em seguida, clique em 'Outras Ações' e selecione 'Exportar'. Na tela de parâmetros, preencha as informações necessárias, como número, série, intervalo, data e outros filtros para refinar a busca. Após configurar os parâmetros, conclua o processo e consulte o diretório especificado para verificar os arquivos gerados.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/exportar-xml/1.webp",
                props: { alt: "Print Tutorial", width: 800, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/exportar-xml/2.webp",
                props: { alt: "Print Tutorial", width: 800, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/exportar-xml/3.gif", 
                props: { 
                  alt: "Tutorial em GIF", width: 800, height: 300 
                }
              }
              
        ],
      },
      {
        id: "saiba-mais",
        title: "Saiba Mais",
        content:
          "Para que o processo seja concluído com sucesso, é fundamental acessar no Protheus a mesma filial que realizou a transmissão da nota. Existe um vínculo entre a filial e a entidade correspondente no TSS. Por exemplo, se a nota foi transmitida pela filial 01, vinculada à entidade 000001 no TSS, somente ao acessar o sistema pela filial 01 será possível exportar ou imprimir o documento corretamente.",
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
      <GenericDocumentationPage {...escalaProdutivosContent} />
    </div>
  );
};

export default Page;
