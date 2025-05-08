"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const vendaDePecasContent: GenericDocumentationPageProps = {
    title: "Alterar cliente da OS",
    group: "Protheus",
    date: "17 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá como alterar o cliente de uma Ordem de Serviço.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para alterar, você pode utilizar a opção 'Alterar' disponível nas abas 'Req Peça' e 'Req Serviço'. Ao acessar a tela de alteração, selecione os tipos de tempo que deseja ajustar na parte inferior da tela. Em seguida, use os campos localizados na parte superior para efetuar as alterações necessárias no cadastro do cliente ou nos dados relacionados. Salve as mudanças para confirmar a atualização.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/alterar-cliente/1.png",
                props: { alt: "Print de tutorial", width: 250, height: 50 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/alterar-cliente/2.png",
                props: { alt: "Print de tutorial", width: 550, height: 350 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/alterar-cliente/3.png",
                props: { alt: "Print de tutorial", width: 900, height: 450 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/alterar-cliente/4.png",
                props: { alt: "Print de tutorial", width: 900, height: 450 }
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
