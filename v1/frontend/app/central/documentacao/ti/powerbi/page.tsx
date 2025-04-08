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
      { label: "Power BI" },
    ]);
  }, [setBreadcrumbs]);

  const powerBiContent: GenericDocumentationPageProps = {
    title: "Power BI",
    date: "11 de Fevereiro de 2024",
    description: "O BI pode ser acessado pelo seu navegador ou instalando o aplicativo em seu Android ou IOS. Para fazer login, utilize a conta disponibilizada pela TI. Favor não alterar a senha, pois a mesma é compartilhada com outros usuários!",
    headerButton: {
      text: "Acessar PowerBI",
      onClick: () => window.open("https://app.powerbi.com/Redirect?action=OpenApp&appId=963d57c6-1458-4ad7-a125-6611c2ade822&ctid=8adb210b-62a6-47ae-bcbd-3a4b30b3be6a", "_blank")
    },
    sections: [
      {
        id: "acesso",
        title: "Acesso Pelo Navegador",
        content: "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/powerbi/powerbi.mp4",
            props: { className: "w-[700px] h-auto" }
          }
        ]
      },
      {
        id: "utilizacao",
        title: "Utilização",
        content: "O Power BI é dividido em três principais componentes: Aplicativos, Relatórios e Páginas, que permitem localizar e acessar facilmente qualquer informação. No ambiente Rodoparaná, atualmente utilizamos um único aplicativo chamado Workspace. Você pode identificar o que está visualizando conforme demonstrado nos prints a seguir.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/powerbi/1.png",
            props: { alt: "Print sinalizando o aplicativo", width: 400, height: 300 }
          },
          {
            type: "image",
            content: "/documentacao/ti/powerbi/2.png",
            props: { alt: "Print sinalizando os relatórios", width: 400, height: 300 }
          },
          {
            type: "image",
            content: "/documentacao/ti/powerbi/3.png",
            props: { alt: "Print sinalizando as páginas", width: 400, height: 300 }
          }
        ]
      },
      {
        id: "filtros",
        title: "Filtros",
        content: "O Power BI trabalha com filtros, visuais e filtros de bandeja. Os filtros visuais, são os que geralmente ficam na parte superior da página, eles são os mais utilizados. Quando quiser filtrar algo em um filtro de visual, pode usar a barra de pesquisa, quando disponível, ou usar a rolagem para localizar. Para selecionar todas as opções novamente, pode-se clicar na borracha, localizada no canto superior direto do filtro, ou clica em 'Selecionar todos', quando disponivel. Em alguns casos, podemos usar o filtro de bandeja, que fica localizado a direita de todas as páginas. Para aparcer os filtros, precisamos clicar em um visual/tabela especifica que queremos filtrar e filtrar de acordo com a necessidade.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/powerbi/filtro1.png",
            props: { alt: "Print sinalizando o filtro", width: 400, height: 300 }
          },
          {
            type: "image",
            content: "/documentacao/ti/powerbi/filtro2.png",
            props: { alt: "Print sinalizando o filtro", width: 400, height: 300 }
          }
        ]
      },
      {
        id: "exportar-dados",
        title: "Exportação de Dados",
        content: "Para exportar os dados, clique no ícone de três pontos (...) no canto superior direito do visual, selecione Exportar dados, escolha Dados com layout atual e confirme clicando em Exportar.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/ti/powerbi/exportar.png",
            props: { alt: "Print sinalizando o filtro", width: 1100, height: 1000 }
          }
        ]
      },
      {
        id: "corrigindo-problemas",
        title: "Corrigindo Problemas",
        content: "O Power BI pode exibir dados inconsistentes ou erros visuais devido a atualizações ou cache acumulado no navegador. Para corrigir, pressione CTRL + F5 no teclado para recarregar a página e limpar o cache."
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
      <GenericDocumentationPage {...powerBiContent} />
    </div>
  );
};

export default Page;

