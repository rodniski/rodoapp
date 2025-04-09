export * from "./types";
import type { Category } from ".";

export const dashboardData: Category[] = [
  {
    id: "aplicacoes",
    title: "Aplicações",
    cards: [
      {
        id: "pre-documento",
        title: "Pré Notas",
        description: "Gerenciamento de notas fiscais e documentos fiscais",
        icon: "Receipt",
        subLinks: [
          {
            id: "pre-doc-dashboard",
            title: "Tabela",
            url: "central/prenota",
            description:
              "Visualize e gerencie todas as notas fiscais do sistema.",
            icon: "Table",
          },
          {
            id: "pre-doc-xml",
            title: "Importar XML",
            url: "central/prenota/xml",
            description:
              "Importe notas fiscais automaticamente através de arquivos XML.",
            icon: "file-search",
          },
          {
            id: "pre-doc-manual",
            title: "Manual",
            url: "central/prenota/manual",
            description:
              "Cadastre novas notas fiscais de despesas manualmente.",
            icon: "notebook-pen",
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
            description:
              "Acesse o histórico completo de conferências realizadas.",
            icon: "file-clock",
          },
          {
            id: "pneus-borracharia",
            title: "Borracharia",
            url: "/portaria/lancamento",
            description:
              "Registre e acompanhe o controle de saída de itens da borracharia.",
            icon: "Warehouse",
            requiresGroup: ["000190"],
          },
          {
            id: "pneus-portaria",
            title: "Portaria",
            url: "/portaria/conferencia",
            description:
              "Compare a saída física com o sistema e identifique divergências.",
            icon: "file-check",
            requiresGroup: ["000191"],
          },
        ],
      },
    ],
  },
  {
    id: "ambiente-corporativo",
    title: "Ambiente Corporativo",
    cards: [
      {
        id: "documentacao",
        title: "Documentação de Processos",
        description:
          "Acesse a documentação completa dos processos corporativos.",
        icon: "book-open",
        url: "/central/documentacao",
      },
      {
        id: "intranet",
        title: "Intranet",
        description:
          "Portal interno com informações e recursos para colaboradores.",
        icon: "building",
        url: "http://intranet.rodoparana.com.br",
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
        description:
          "Sistema de abertura e acompanhamento de chamados técnicos.",
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
        description:
          "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
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
];
