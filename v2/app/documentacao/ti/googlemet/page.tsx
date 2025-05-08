"use client";

import GenericDocumentationPage, { GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const googleMeetContent: GenericDocumentationPageProps = {
    title: "Google Meet - Videoconferências",
    group: "TI",
    date: "15 de Agosto de 2024",
    description: "O Google Meet é uma das melhores plataformas para videoconferências, conhecida por sua estabilidade e simplicidade. Diferente de outras ferramentas, não requer a instalação de complementos; basta fazer login com uma conta Google, seja corporativa ou pessoal. Para criar uma sala de reunião, acesse o link pelo botão abaixo e clique em 'Iniciar uma nova reunião' ou use o acesso rápido pelo Gmail, nos ícones no canto inferior esquerdo da tela.",
    headerButton: {
      text: "Criar Reunião",
      onClick: () => window.open("https://meet.google.com/", "_blank")
    },
    sections: [
      {
        id: "reuniao-gmail",
        title: "Criar Reunião Pelo Gmail",
        content: "Para iniciar ou ingressar em uma reunião pelo Gmail, clique nos ícones no canto esquerdo da tela (Caso não esteja aparecendo, siga o tutorial do vídeo abaixo). Conceda permissões para acessar a webcam e o microfone e clique em Iniciar reunião. Em seguida, compartilhe o link ou convide participantes por e-mail, incluindo contatos externos. A ferramenta também permite compartilhar a tela clicando em Apresentar agora no canto inferior direito. Para desativar o microfone ou a câmera, use os ícones no menu inferior. É simples e prático para gerenciar suas reuniões!",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/reuniao/googlemeet.mp4",
            props: { className: "w-[700px] h-auto", controls: true, muted: true }
          }
        ]
      },
      {
        id: "gravar-reuniao",
        title: "Gravar Uma Reunião",
        content: "Para gravar uma reunião, acesse o menu de opções e inicie a gravação. Os participantes serão notificados sobre a gravação. Após o término, o arquivo será disponibilizado no seu Google Drive e você receberá um e-mail com o link para download. Lembre-se de que apenas reuniões criadas por você ou outros funcionários da Rodoparaná podem ser gravadas.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/reuniao/gravar.mp4",
            props: { className: "w-[700px] h-auto", controls: true, muted: true }
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
      <GenericDocumentationPage {...googleMeetContent} />
    </div>
  );
};

export default Page;

