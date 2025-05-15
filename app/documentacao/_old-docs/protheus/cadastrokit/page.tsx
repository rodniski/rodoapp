"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_internal/ui/GenericDocumentationPage";

const Page = () => {
  const cadastroKitContent: GenericDocumentationPageProps = {
    title: "Cadastro de KIT (Incoveniente)",
    group: "Protheus",
    date: "17 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá como cadastrar grupos de inconvenientes e associar serviços e peças a esses grupos para utilização na oficina.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Os kits para utilização na oficina, conhecidos como inconvenientes, podem incluir serviços e peças. Para cadastrar um novo inconveniente, é necessário primeiro criar um grupo. No módulo de Oficina, acesse o menu Atualizações > Cad Oficina > Inconveniente. Informe um código para o grupo no campo 'Cod Grupo' e uma descrição. O campo 'Marca' é opcional, mas, se preenchido, limita o uso dos inconvenientes desse grupo à marca especificada. Após cadastrar o grupo, acesse o menu Atualizações > Cad Oficina > Srv/Pcs P/Inconv. Selecione o grupo criado anteriormente no campo 'Grupo Incon', informe um código no campo 'Cod Incon' e uma descrição. Escolha os tipos de tempo para peças e serviços nos campos 'TPTempo Peca' e 'TPTempo Serv'. Preencha os campos adicionais, liste os serviços na seção correspondente e, em seguida, inclua as peças desejadas na aba ao lado.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/cadastro-kit/1.png",
                props: { alt: "Print Tutorial", width: 700, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/cadastro-kit/2.png",
                props: { alt: "Print Tutorial", width: 1000, height: 800 }
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
      <GenericDocumentationPage {...cadastroKitContent} />
    </div>
  );
};

export default Page;
