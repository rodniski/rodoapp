"use client"


import GenericDocumentationPage, { type GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";
import DataTableDocs from "../../_lib/components/data-table";

const Page = () => {
    const tableData = [
        {
            aplicativo: "Filiais",
            relatorio: "Faturamento",
            conteudo: "Vendas e serviços realizados externamente",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Mercado Sobre Chassi",
            conteudo: "Visão geral do mercado",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Ordens de Serviço",
            conteudo: "Ordens de serviço internas e externas",
        },
        {
            aplicativo: "Filiais",
            relatorio: "DRE Gerencial",
            conteudo: "Relação de contas, custos, despesas e rateios",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Financeiro",
            conteudo: "Contas a pagar, receber e cheque",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Consulta e estoque",
            conteudo: "Consulta de equipamentos",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Comissões",
            conteudo: "Desempenho das filiais, incluindo faturamento, metas de vendas e rentabilidade",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Clientes",
            conteudo: "Relação de quantidade e contato de clientes",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Transferências em Andamento",
            conteudo: "Controle de transferências entre filiais com dados de saída, entrada e valores movimentados",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Emplacamentos Random",
            conteudo: "Visão geral do mercado",
        },
        {
            aplicativo: "Filiais",
            relatorio: "ICMS ST - DIFAL",
            conteudo: "Análise do ICMS ST e DIFAL por filial, produto e vendedor",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Agrega/Desagrega",
            conteudo: "Movimentações de agregação e desagregação de itens por filial, produto e chassi",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Inadimplentes",
            conteudo: "Valor inadimplente e relação de devedores",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Vendas Perdidas",
            conteudo: "Relação de orçamentos bem e mal sucedidos e valor perdido",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Consulta Banco",
            conteudo: "Contas a pagar, receber, movimentação bancária, clientes, fornecedores e NFs de entrada e saída",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Roteiro de Teste",
            conteudo: "Relação de testes realizados e pendentes",
        },
        {
            aplicativo: "Filiais",
            relatorio: "Atualizações",
            conteudo: "Atualização manual dos relatórios",
        },
        {
            aplicativo: "Timber",
            relatorio: "Timber Vendas",
            conteudo: "Dados de faturamento e acompanhamento de metas de todos os setores",
        },
        {
            aplicativo: "Timber",
            relatorio: "Timber Estoque",
            conteudo: "Valor em estoque e quantidade de produtos",
        },
        {
            aplicativo: "Timber",
            relatorio: "Timber Construction",
            conteudo: "Dados de oportunidades de leads, mapa de calor de oportunidades e metas",
        },
        {
            aplicativo: "Timber",
            relatorio: "Timber Forest",
            conteudo: "Dados de faturamento",
        },
        {
            aplicativo: "Timber",
            relatorio: "DRE Gerencial Timber",
            conteudo: "Relação de contas, custos, despesas, rateios, variações mensais e NCG",
        },
        {
            aplicativo: "Recursos Humanos",
            relatorio: "Funcionários",
            conteudo: "Dashboard de gerenciamento de funcionários, aniversariantes e custo folha",
        },
        {
            aplicativo: "Recursos Humanos",
            relatorio: "Segurança do trabalho",
            conteudo: "Inspeções e acidentes",
        },
        {
            aplicativo: "Gestão",
            relatorio: "Visão Gerencial",
            conteudo: "Faturamento, rentabilidade, relação de Oss, Valores de entrada e saída Rodoparaná e Timber, Lucro Líquido e DRE",
        },
        {
            aplicativo: "Gestão",
            relatorio: "Desempenho da Rede",
            conteudo: "Relação de desempenho da Rodoparaná comparada a outras vertentes Randon",
        },
        {
            aplicativo: "Gestão",
            relatorio: "DRE Gerencial",
            conteudo: "Centro Custo, despesas, rateio e NCG",
        },
        {
            aplicativo: "Gestão",
            relatorio: "DRE Project",
            conteudo: "Detalhes do projeto, evolução e custo folha",
        },
        {
            aplicativo: "Gestão",
            relatorio: "Consulta Banco",
            conteudo: "Contas a pagar, receber, movimentação bancária, clientes, fornecedores e NFs de entrada e saída",
        },
        {
            aplicativo: "Gestão",
            relatorio: "Simulador de Orçamentos",
            conteudo: "Programa de simulação financeira",
        },
        {
            aplicativo: "Implementos",
            relatorio: "Implementos",
            conteudo: "Número de oportunidades por segmento e vendedor. Valor estimado proveniente das oportunidades",
        },
        {
            aplicativo: "Implementos",
            relatorio: "Emplacamentos Randon",
            conteudo: "Visão geral do mercado",
        },
        {
            aplicativo: "Implementos",
            relatorio: "Mercado de Sobre Chassi",
            conteudo: "Visão geral do mercado",
        },
        {
            aplicativo: "Estoque",
            relatorio: "Estoque (novo)",
            conteudo: "Tabela com custo de data de compras feitas pela Rodoparaná e Timber",
    },
        {
            aplicativo: "Estoque",
            relatorio: "Estoque",
            conteudo: "Tabela com custo de data de compras feitas pela Rodoparaná e Timber",
        },
        {
            aplicativo: "Estoque",
            relatorio: "Consulta Estoque",
            conteudo: "Lista de todos produtos em estoque",
        },
        {
            aplicativo: "Estoque",
            relatorio: "Transferência em andamento",
            conteudo: "Controle de transferências entre filiais com dados de saída, entrada e valores movimentados",
        },
        {
            aplicativo: "Estoque",
            relatorio: "Remessas",
            conteudo: "Dados cadastrais de remessa",
        },
        {
            aplicativo: "Estoque",
            relatorio: "Custo Médio",
            conteudo: "Custo Médio de produto da entrada ao último fechamento",
        },
        {
            aplicativo: "Financeiro/Contábil",
            relatorio: "DRE Gerencial",
            conteudo: "Centro Custo, despesas, rateio e NCG",
        },
        {
            aplicativo: "Financeiro/Contábil",
            relatorio: "DRE",
            conteudo: "Centro Custo, despesas, rateio e NCG",
        },
        {
            aplicativo: "Financeiro/Contábil",
            relatorio: "DRE Project",
            conteudo: "Detalhes do projeto, evolução e custo folha",
        },
        {
            aplicativo: "Financeiro/Contábil",
            relatorio: "Financeiro",
            conteudo: "Contas a pagar, receber e cheques",
        },
        {
            aplicativo: "Financeiro/Contábil",
            relatorio: "Inadimplentes",
            conteudo: "Valor inadimplentes e relação de devedores",
        },
    ]

    const powerBiContent: GenericDocumentationPageProps = {
        title: "Power BI",
        group: "PowerBI",
        date: "11 de Fevereiro de 2024",
        description:
            "O BI pode ser acessado pelo seu navegador ou instalando o aplicativo em seu Android ou IOS. Para fazer login, utilize a conta disponibilizada pela TI. Favor não alterar a senha, pois a mesma é compartilhada com outros usuários!",
        headerButton: {
            text: "Acessar PowerBI",
            onClick: () =>
                window.open(
                    "https://app.powerbi.com/Redirect?action=OpenApp&appId=963d57c6-1458-4ad7-a125-6611c2ade822&ctid=8adb210b-62a6-47ae-bcbd-3a4b30b3be6a",
                    "_blank",
                ),
        },
        sections: [
            {
                id: "relatorios",
                title: "Relatórios dispoíveis",
                content: "Lista atualizada sobre os relatórios disponíveis e seus conteudos.",
                additionalContent: [],
            },
        ],
    }

    return (
        <div className="h-full w-full pt-20 pl-20">
            <div className="flex flex-col">
                <GenericDocumentationPage {...powerBiContent} />

                {/* Adicionando a tabela com margem negativa para reduzir o espaçamento */}
                <div className="mb-5 max-w-4xl">
                    <DataTableDocs data={tableData} />
                </div>
            </div>
        </div>
    )
}

export default Page

