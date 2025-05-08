"use client";

import GenericDocumentationPage, { GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const proxyContent: GenericDocumentationPageProps = {
    title:"Proxy",
    group:"TI",
    date:"5 de Julho de 2024",
    description:"As redes internas da empresa requerem a configuração de proxy para liberar o acesso à internet. Geralmente, essa configuração é feita automaticamente, mas, em caso de dificuldades na navegação, é importante validar as informações conforme as orientações fornecidas.",
    sections: [
      {
        id:"configurando",
        title:"Configurando o Proxy",
        content:"As redes internas da empresa exigem a configuração de proxy para liberar o acesso à internet. Normalmente, essa configuração é feita automaticamente, mas, em caso de dificuldades, é importante verificar as definições. No menu iniciar, digite 'proxy' e acesse 'Alterar configurações de proxy'. Certifique-se de que a opção 'Detectar configurações automaticamente' esteja desativada e que a opção 'Usar script de instalação' esteja ativada. No campo de endereço do script, insira: http://wpad.rodoparana.local/wpad.dat. Após salvar as alterações, reinicie o computador para aplicar as configurações.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/proxy/1.png",
            props: { alt: "Print sinalizando como configurar o proxy", width: 600, height: 500 }
          },
          {
            type: "image",
            content: "/documentacao/ti/proxy/2.png",
            props: { alt: "Print sinalizando como configurar o proxy", width: 600, height: 500 }
          }
        ]
      },
      {
        id:"outros-problemas",
        title:"Outros Problemas",
        content:"Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
      },
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () => window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank")
    }
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...proxyContent} />
    </div>
  );
};

export default Page;
