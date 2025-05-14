"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const kardexContent: GenericDocumentationPageProps = {
    title: "Dicas Úteis",
    group: "Protheus",
    date: "16 de outubro de 2024",
    description:
      "Nesta página, você aprenderá dicas úteis em relação ao Protheus.",
    sections: [
        {
            id: "filtros-simples",
            title: "Filtros Simples",
            content: "Como utilizar filtros simples",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/filtros-simples.png",
                    props: { alt: "Print Tutorial", width: 1000, height: 8000 }
                },
            ],
        },
        {
            id: "filtros-avancados",
            title: "Filtros Avançados",
            content: "Dê um nome ao filtro, escolha o campo, e selecione o operador relacional, como 'igual a' ou 'contém a expressão'. Marque 'informar dados do filtro durante a execução' e desmarque 'Dif maiúsculas/minúsculas'. Clique em 'Adicionar'. Para combinar filtros, utilize as operações E/OU e repita o processo para adicionar outros critérios, como nome do cliente ou código. Após finalizar, clique em 'Salvar'. Na tela seguinte, selecione o filtro criado, vá em 'Outras Ações', clique em 'Salvar' e, por fim, em 'Aplicar filtros selecionados'.",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/filtros-avancados/1.png",
                    props: { alt: "Print Tutorial", width: 1000, height: 300 }
                },
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/filtros-avancados/2.png",
                    props: { alt: "Print Tutorial", width: 600, height: 100 }
                },
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/filtros-avancados/3.png",
                    props: { alt: "Print Tutorial", width: 600, height: 100 }
                },
            ],
        },
        {
            id: "posicoes-colunas",
            title: "Alterar a Posição das Colunas em um Browser",
            content: "Como alterar a posição das colunas em um Browser",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/posicoes-colunas/1.png",
                    props: { alt: "Print Tutorial", width: 600, height: 300 }
                },
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/posicoes-colunas/2.png",
                    props: { alt: "Print Tutorial", width: 600, height: 300 }
                },
            ],
        },
        {
            id: "exportar-excel",
            title: "Exportar para Excel",
            content: "Se a mensagem de erro for exibida ao abrir a planilha, ajuste os parâmetros conforme indicado na imagem abaixo. Observação: Nem todas as exportações são compatíveis. Caso o erro persista, significa que o relatório não possui suporte para exportação em Excel.",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/exportar-excel/1.png",
                    props: { alt: "Print Tutorial", width: 600, height: 300 }
                },
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/exportar-excel/2.png",
                    props: { alt: "Print Tutorial", width: 600, height: 300 }
                },
            ],
        },
        {
            id: "favoritos",
            title: "Adicionar Rotina ao Menu Favoritos",
            content: "Para adicionar uma rotina ao menu 'Favoritos', primeiro acesse a rotina desejada para que ela apareça na aba 'Recentes'. Depois, clique na opção 'Adicionar aos Favoritos'. Escolha os menus que deseja incluir nos favoritos e confirme a ação.",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/favoritos/1.png",
                    props: { alt: "Print Tutorial", width: 350, height: 100 }
                },
                {
                    type: "image",
                    content: "/documentacao/protheus/dicas-uteis/favoritos/2.png",
                    props: { alt: "Print Tutorial", width: 350, height: 100 }
                },
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
      <GenericDocumentationPage {...kardexContent} />
    </div>
  );
};

export default Page;
