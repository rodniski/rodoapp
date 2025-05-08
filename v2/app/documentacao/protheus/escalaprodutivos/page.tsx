"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const escalaProdutivosContent: GenericDocumentationPageProps = {
    title: "Cadastrar Escala de Produtivos",
    group: "Protheus",
    date: "17 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá como cadastrar uma escala de produtivos",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para incluir um produtivo para executar um serviço na oficina, é essencial que sua escala de trabalho esteja cadastrada. Caso contrário, será exibida a mensagem 'Produtivo sem escala de trabalho'. Para cadastrar a escala, acesse o módulo de Oficina, vá ao menu Atualizações > Mov Produtivos > Escala Automática. Informe o produtivo, filial, período e as escalas, incluindo finais de semana e feriados, e clique no botão 'Escalar'. Observe que o período deve começar no dia seguinte, pois o sistema não permite cadastrar a escala na data atual. Se necessário, você pode retroagir a data do sistema para ontem ou uma data anterior, desde que tenha a permissão necessária.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/escala-produtivos/1.png",
                props: { alt: "Print Tutorial", width: 500, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/escala-produtivos/2.png",
                props: { alt: "Print Tutorial", width: 500, height: 300 }
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
      <GenericDocumentationPage {...escalaProdutivosContent} />
    </div>
  );
};

export default Page;
