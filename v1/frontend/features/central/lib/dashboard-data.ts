import type {Category} from "./types"

export const dashboardData: Category[] = [
    {
        id: "ambiente-corporativo",
        title: "Ambiente Corporativo",
        cards: [
            {
                id: "documentacao",
                title: "Documentação de Processos",
                description: "Acesse a documentação completa dos processos corporativos.",
                icon: "book-open",
                url: "/central/documentacao",
            },
            {
                id: "intranet",
                title: "Intranet",
                description: "Portal interno com informações e recursos para colaboradores.",
                icon: "building",
                url: "http://intranet.rodoparana.com.br",
            },
        ],
    },
    {
        id: "aplicacoes",
        title: "Aplicações",
        cards: [
            {
                id: "pre-documento",
                title: "Pré Notas",
                description: "Sistema para gerenciamento de documentos de entrada.",
                icon: "file-input",
                subLinks: [
                    {
                        id: "pre-doc-dashboard",
                        title: "Dashboard",
                        url: "central/prenota",
                        description: "Visualize os últimos lançamentos dos documentos de entrada.",
                    },
                    {
                        id: "pre-doc-xml",
                        title: "XML",
                        url: "central/prenota/xml",
                        description: "Cadastre a sua pré nota através da chave de XML.",
                    },
                    {
                        id: "pre-doc-manual",
                        title: "Manual",
                        url: "central/prenota/manual",
                        description: "Cadastre a pré nota que não contenha chave de XML.",
                    },
                ],
            },
            {
                id: "saida-pneus",
                title: "Saída de Pneus",
                description: "Controle e gestão de saída de pneus.",
                icon: "truck",
                subLinks: [
                    {
                        id: "pneus-historico",
                        title: "Histórico",
                        url: "/portaria/historico",
                        description: "Consulte o histórico completo de saídas de pneus.",
                    },
                    {
                        id: "pneus-borracharia",
                        title: "Borracharia",
                        url: "/portaria/lancamento",
                        description: "Gerencie as operações relacionadas à borracharia.",
                    },
                    {
                        id: "pneus-portaria",
                        title: "Portaria",
                        url: "/portaria/conferencia",
                        description: "Controle de entrada e saída pela portaria.",
                    },
                ],
            },
        ],
    },
    {
        id: "links-externos",
        title: "Links Externos",
        cards: [
            {
                id: "chamados",
                title: "Central de Chamados",
                description: "Sistema de abertura e acompanhamento de chamados técnicos.",
                icon: "headphones",
                url: "https://hesk.rodoparana.com.br",
                external: true,
            },
            {
                id: "central-denuncias",
                title: "Central de Denúncias",
                description: "Canal para reportar irregularidades ou problemas.",
                icon: "life-buoy",
                url: "https://docs.google.com/forms/d/e/1FAIpQLSdQg_J6w3Qr6uJffypFuZmPxDJO-5efwPz-l_avQpvLutnZnw/viewform",
                external: true,
            },
            {
                id: "meu-rh",
                title: "Meu RH",
                description: "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
                icon: "user",
                url: "https://meurh.foxconn.com.br/web/app/RH/PortalMeuRH/#/login",
                external: true,
            },
            {
                id: "rodoparana",
                title: "Rodoparaná",
                description: "Site oficial da Rodoparaná.",
                icon: "globe",
                url: "https://rodoparana.com.br",
                external: true,
            },
            {
                id: "grupotimber",
                title: "Grupo Timber",
                description: "Site oficial do Grupo Timber.",
                icon: "globe",
                url: "https://grupotimber.com.br",
                external: true,
            },
        ],
    },
]

