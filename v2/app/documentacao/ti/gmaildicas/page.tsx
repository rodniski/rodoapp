"use client";

import GenericDocumentationPage, { GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const gmailDicasContent: GenericDocumentationPageProps = {
    title: "Gmail Dicas",
    group: "TI",
    date: "18 de Outubro de 2024",
    description: "Dicas práticas para resolver problemas no Outlook e acabar com dores de cabeça desnecessárias.",
    sections: [
      {
        id: "layout",
        title: "Layout",
        content: "Se o layout do Gmail está te confundindo, desative o agrupamento de mensagens. Clique na engrenagem no canto superior direito, vá em 'Visualização de conversas' e desative a opção.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/layout-conversa-gmail.mp4",
            props: { className: "w-full max-w-[700px] h-auto", loop: true, autoPlay: true, muted: true }
          }
        ]
      },
      {
        id: "organizacao",
        title: "Organização",
        content: "Quer criar regras para que determinados e-mails sejam direcionados automaticamente para pastas específicas (marcadores)? Confira o vídeo abaixo para o passo a passo!",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/marcadores.mp4",
            props: { className: "w-[700px] h-auto", controls: true, muted: true }
          }
        ]
      },
      {
        id: "atalhos",
        title: "Atalhos de Teclado",
        content: "Os atalhos de teclado são uma excelente ferramenta para tornar o uso do seu e-mail mais rápido e eficiente. Para ativá-los, siga os passos abaixo:",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/atalhos-teclado.mp4",
            props: { className: "w-full max-w-[700px] h-auto", muted: true, controls: true }
          }
        ]
      },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content: "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
      }
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () => window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank")
    }
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...gmailDicasContent} />
    </div>
  );
};

export default Page;

