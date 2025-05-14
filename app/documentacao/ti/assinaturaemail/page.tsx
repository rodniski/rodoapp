"use client";

import GenericDocumentationPage, { GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const assinaturaContent: GenericDocumentationPageProps = {
    title: "Assinatura de Email",
    group: "TI",
    date: "1 de Março de 2024",
    description: "Crie sua assinatura no botão abaixo e em seguida, copie-a para a área de transferência (CTRL + C) e siga as instruções para configurá-la no Outlook ou Gmail.",
    headerButton: {
      text: "Criar Assinatura",
      onClick: () => window.open("http://hesk.rodoparana.com.br/signaturegen/", "_blank")
    },
    sections: [
      {
        id: "configurando-assinatura-gmail",
        title: "Assinatura no Gmail",
        content: "Para configurar sua assinatura no webmail, acesse sua conta de e-mail, clique na engrenagem no canto superior direito e selecione 'Configurações'. Na seção 'Assinatura', clique em '+ Criar nova' e atribua um nome à sua assinatura. Em seguida, cole a assinatura copiada anteriormente na área indicada e habilite as opções para utilizá-la em novos e-mails e respostas/encaminhamentos. Note que as imagens podem não aparecer durante a configuração, mas finalize o processo e envie um e-mail de teste para verificar se estão sendo exibidas corretamente. Ou siga o vídeo abaixo para orientação passo a passo.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/assinatura/assinatura-gmail.mp4",
            props: { className: "w-full max-w-[700px] h-auto", muted: true, controls: true }
          }
        ]
      },
      {
        id: "configurando-assinatura-outlook",
        title: "Configurando a Assinatura no Outlook",
        content: "Abra o Outlook e clique em Novo E-mail para iniciar o processo de configuração da sua assinatura. em seguida, clique em Assinatura e selecione Assinaturas para acessar as configurações.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/assinatura/outlook1.png",
            props: { alt: "Configurando assinatura do outlook", width: 500, height: 300 }
          }
        ]
      },
      {
        id: "adicionando-assinatura-outlook",
        title: "Adicionando Assinatura no Outlook",
        content: "Clique em Novo e dê um nome à sua assinatura. Em seguida, cole a assinatura criada anteriormente (incluindo o logo) no campo Editar assinatura. Escolha-a nos campos de seleção ao lado.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/assinatura/outlook2.png",
            props: { alt: "Configurando assinatura do outlook", width: 500, height: 300 }
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
      <GenericDocumentationPage {...assinaturaContent} />
    </div>
  );
};

export default Page;

