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
      { label: "E-mail Automático" },
    ]);
  }, [setBreadcrumbs]);

  const emailAutomaticoContent: GenericDocumentationPageProps = {
    title: "E-mail Automático",
    date: "25 de Fevereiro de 2024",
    description: "Essa página explica como configurar a resposta automática no Gmail, te orientando a ativar a funcionalidade, definir o período de ausência, personalizar a mensagem e ajustar as configurações para notificar corretamente os remetentes.",
    sections: [
      {
        id: "configurando",
        title: "Configurando a Resposta Automática",
        content: "Para configurar o envio de resposta automática às mensagens recebidas, acesse seu e-mail pelo Gmail. No canto superior direito da tela, clique na engrenagem e selecione a opção 'Ver todas as configura��ões'. Em seguida, encontre a sessão 'Resposta automática de férias', preencha as informações necessárias e clique em 'Salvar alterações' para aplicar a configuração. Ou siga o vídeo abaixo!",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/ferias.mp4",
            props: { className: "w-[700px] h-auto", controls: true, muted: true }
          }
        ]
      },
      {
        id: "dicas",
        title: "Dicas Gerais",
        content: "Se a opção 'último dia' for marcada, a resposta automática será desativada automaticamente na data especificada. Recomenda-se desmarcar as opções de envio apenas para contatos ou exclusivamente para pessoas da Rodoparaná, garantindo que a mensagem alcance todos os remetentes. No campo de assunto, informe de forma resumida o período e o motivo da sua ausência. No corpo da mensagem, inclua uma descrição clara e objetiva, indicando o responsável pela continuidade de suas atividades durante esse período."
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
      <GenericDocumentationPage {...emailAutomaticoContent} />
    </div>
  );
};

export default Page;

