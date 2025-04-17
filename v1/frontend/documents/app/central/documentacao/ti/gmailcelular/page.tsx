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
      { label: "Gmail no Celular" },
    ]);
  }, [setBreadcrumbs]);

  const gmailCelularContent: GenericDocumentationPageProps = {
    title: "Gmail no Celular",
    date: "4 de Agosto de 2024",
    description: "Antes de começar, tenha seu endereço de e-mail e senha do Gmail em mãos. Certifique-se de estar conectado à internet para configurar e sincronizar sua conta.",
    sections: [
      {
        id: "iniciando-configuracao",
        title: "Iniciando a Configuração",
        content: "Ao abrir o Gmail, selecione a opção 'Adicionar um endereço de e-mail' para começar a configurar sua conta e selecione a opção Google para continuar com a configuração.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/gmail-celular/1.png",
            props: { alt: "Iniciando a configuração do gmail no celular", width: 250, height: 150 }
          }
        ]
      },
      {
        id: "inserindo-email",
        title: "Inserindo Email e Senha",
        content: "Digite o seu endereço de e-mail empresarial para prosseguir e em seguida digite a senha da sua conta de e-mail com atenção para garantir o acesso correto.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/gmail-celular/2.png",
            props: { alt: "Inserindo email e senha no gmail no celular", width: 250, height: 150 }
          }
        ]
      },
      {
        id: "conexao-concluida",
        title: "Conexão Concluída",
        content: "Pronto! Sua conta do Gmail está conectada ao seu dispositivo Android. Agora você pode acessar seus e-mails diretamente pelo aplicativo do Gmail.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/gmail-celular/3.png",
            props: { alt: "Conexão concluída do gmail no celular", width: 250, height: 150 }
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
      <GenericDocumentationPage {...gmailCelularContent} />
    </div>
  );
};

export default Page;

