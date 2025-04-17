"use client";

import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import GenericDocumentationPage, { GenericDocumentationPageProps } from "doc/components/GenericDocumentationPage";


const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "TI", href: "/central/documentacao/ti" },
      { label: "Emails Limitados" },
    ]);
  }, [setBreadcrumbs]);

  const gmailCelularContent: GenericDocumentationPageProps = {
    title: "E-mails Limitados",
    date: "22 de janeiro de 2023",
    description: "Antes de começar, tenha seu endereço de e-mail e senha do Gmail em mãos. Certifique-se de estar conectado à internet para configurar e sincronizar sua conta.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Se o Outlook não estiver sincronizando todos os e-mails, ajuste o tamanho da caixa de correio. Clique na setinha próxima ao relógio, acesse o ícone do G-Suite, selecione   Definir limite de tamanho da caixa de correio  e escolha   Ilimitado .",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/emails-ilimitados/1.png",
            props: { alt: "Iniciando a configuração do gmail no celular", width: 350, height: 150 }
          },
          {
            type: "image",
            content: "/documentacao/ti/emails-ilimitados/2.png",
            props: { alt: "Iniciando a configuração do gmail no celular", width: 350, height: 150 }
          },
          {
            type: "image",
            content: "/documentacao/ti/emails-ilimitados/3.png",
            props: { alt: "Iniciando a configuração do gmail no celular", width: 350, height: 150 }
          },
          {
            type: "image",
            content: "/documentacao/ti/emails-ilimitados/4.png",
            props: { alt: "Iniciando a configuração do gmail no celular", width: 350, height: 150 }
          },
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
      <GenericDocumentationPage {...gmailCelularContent} />
    </div>
  );
};

export default Page;

