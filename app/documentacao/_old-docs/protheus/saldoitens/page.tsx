"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_internal/ui/GenericDocumentationPage";

const Page = () => {
  const kardexContent: GenericDocumentationPageProps = {
    title: "Saldo de Itens e Movimentação Entre Armazéns",
    group: "Protheus",
    date: "17 de outubro de 2024",
    description:
      "Nesta página, você aprenderá a utilizar a tela de filtros e pesquisa de itens no sistema, acessada pela tecla F3, para localizar produtos em diferentes armazéns ou filiais.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Ao pressionar F3 no campo de código do item, será exibida a tela de filtros e pesquisa, que pode listar itens de outros armazéns ou filiais, dependendo do filtro aplicado. Ao lançar uma peça, verifique atentamente esses campos, pois selecionar um armazém sem permissão de movimentação ou uma filial diferente pode fazer o item aparecer sem saldo. Para transferir itens entre armazéns, acesse Estoque/Custos > Atu > Mov > Internas > Transferência Múltiplas. Se ocorrer um erro ao movimentar um item, ajuste o saldo inicial no menu Estoque/Custos > Movimento > Saldos > Inicial, iniciando o produto com saldo e valor zerados no local de destino.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/saldo-itens/1.png",
                props: { alt: "Print Tutorial", width: 1000, height: 500 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/saldo-itens/2.png",
                props: { alt: "Print Tutorial", width: 1000, height: 500 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/saldo-itens/3.png",
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
      <GenericDocumentationPage {...kardexContent} />
    </div>
  );
};

export default Page;
