"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const vendaDePecasContent: GenericDocumentationPageProps = {
    title: "Contabilidade",
    group: "Protheus",
    date: "17 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá como realizar alterações nos centros de custo de notas fiscais que foram faturadas incorretamente. Para atender a essa necessidade, foi desenvolvida uma rotina que permite que o departamento de contabilidade faça essas alterações diretamente.",
    sections: [
      {
        id: "alterar-cc",
        title: "Alteração Centro de Custo das Notas Fiscais",
        content: "Essa funcionalidade está disponível exclusivamente no módulo de Contabilidade Gerencial, acessando: Miscelânea > Ajustes > Altera Centro de Custo.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/contabilidade.png",
                props: { alt: "Configurando assinatura do outlook", width: 250, height: 50 }
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
      <GenericDocumentationPage {...vendaDePecasContent} />
    </div>
  );
};

export default Page;
