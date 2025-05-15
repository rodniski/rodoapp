import {
  TreePine,
  Truck,
  Globe,
  Users,
  Computer,
  PlusIcon,
  BookOpen,
} from "lucide-react";

import type { Category } from ".";

import {
  AccessibilityIcon,
  ArchiveIcon,
  ChatBubbleIcon,
  ClipboardIcon,
  DesktopIcon,
  IdCardIcon,
  Pencil2Icon,
  QuestionMarkCircledIcon,
  TableIcon,
  TransformIcon,
  ZoomInIcon,
} from "@radix-ui/react-icons";

export const dashboardData: Category[] = [
  {
    id: "aplicacoes",
    title: "Aplicações",
    cards: [
      {
        id: "pre-documento",
        title: "Pré Notas",
        description: "Gerenciamento de notas fiscais e documentos fiscais",
        icon: IdCardIcon,
        subLinks: [
          {
            id: "pre-doc-dashboard",
            title: "Tabela",
            url: "/prenota",
            description:
              "Visualize e gerencie todas as notas fiscais do sistema.",
            icon: TableIcon,
          },
          {
            id: "pre-doc-xml",
            title: "Incluir Nota",
            url: "/prenota/inclusao",
            description:
              "Importe notas fiscais automaticamente através de arquivos XML.",
            icon: Pencil2Icon,
          },
          {
            id: "pedido-inclusao",
            title: "Incluir Pedido de Compra",
            url: "/prenota/pedido",
            description:
              "Cadastre novos pedidos de compra. Para aceleração do cadastro de Pré Documentos de Entrada",
            icon: PlusIcon,
            requiresGroup: ["000013", "000014"],
          },
        ],
      },
      {
        id: "saida-pneus",
        title: "Saída de Pneus",
        description: "Controle e gestão de saída de pneus.",
        icon: Truck,
        subLinks: [
          {
            id: "pneus-historico",
            title: "Histórico",
            url: "/controle",
            description:
              "Acesse o histórico completo de conferências realizadas.",
            icon: ArchiveIcon,
          },
          {
            id: "pneus-borracharia",
            title: "Borracharia",
            url: "/controle/borracharia",
            description:
              "Registre e acompanhe o controle de saída de itens da borracharia.",
            icon: ClipboardIcon,
            requiresGroup: ["000190"],
          },
          {
            id: "pneus-portaria",
            title: "Portaria",
            url: "/controle/portaria",
            description:
              "Compare a saída física com o sistema e identifique divergências.",
            icon: ZoomInIcon,
            requiresGroup: ["000191"],
          },
        ],
      },
      {
        id: "documentacao",
        title: "Documentação",
        description: "Documentação sobre TI, Protheus e Power BI.",
        icon: BookOpen,
        subLinks: [
          {
            id: "documentacao-introducao",
            title: "Introdução",
            url: "/documentacao",
            description:
              "Página introdutória de documentação para TI, Protheus e Power BI.",
            icon: TableIcon,
          },
          {
            id: "documentacao-ti",
            title: "TI",
            url: "/documentacao/ti/antiameacas",
            description: "Documentação sobre processos de TI.",
            icon: DesktopIcon,
          },
          {
            id: "documentacao-protheus",
            title: "Protheus",
            url: "/documentacao/protheus/videoaulas",
            description: "Documentação sobre como usar Protheus.",
            icon: DesktopIcon,
          },
          {
            id: "documentacao-powerbi",
            title: "Power BI",
            url: "/documentacao/powerbi/acesso",
            description: "Documentação sobre como usar Power BI.",
            icon: DesktopIcon,
          },
        ]
      },
    ],
  },
  {
    id: "ambiente-corporativo",
    title: "Ambiente Corporativo",
    cards: [
      {
        id: "central-ti",
        title: "Central da TI",
        description: "Acesso a chamados, intranet e documentação.",
        icon: Computer,
        subLinks: [
          {
            id: "chamados",
            title: "Help Desk",
            url: "https://hesk.rodoparana.com.br",
            description:
              "Sistema de abertura e acompanhamento de chamados técnicos.",
            icon: QuestionMarkCircledIcon,
          },
          {
            id: "assinatura-email",
            title: "Assinatura de Email",
            url: "http://hesk.rodoparana.com.br/signaturegen",
            icon: TransformIcon,
            description: "Gere a sua assinatura de email corporativa.",
          },
          {
            id: "intranet",
            title: "Intranet",
            url: "http://intranet.rodoparana.com.br",
            description:
              "Portal interno com informações e recursos para colaboradores.",
            icon: DesktopIcon,
          },
        ],
      },

      {
        id: "recursos-humanos",
        title: "Recursos Humanos",
        description: "Acesso a Meu RH e Central de Denúncias.",
        icon: Users,
        subLinks: [
          {
            id: "meu-rh",
            title: "Meu RH",
            url: "https://datasul.rodoparana.com.br/totvs-login/loginForm",
            description:
              "Portal RH: holerites, histórico de ponto, férias e mais.",
            icon: AccessibilityIcon,
          },
          {
            id: "central-denuncias",
            title: "Central de Denúncias",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSdQg_J6w3Qr6uJffypFuZmPxDJO-5efwPz-l_avQpvLutnZnw/viewform",
            description: "Canal para reportar irregularidades ou problemas.",
            icon: ChatBubbleIcon,
          },
        ],
      },

      {
        id: "sites-empresa",
        title: "Sites Institucionais",
        description: "Acesso aos sites institucionais do grupo.",
        icon: Globe,
        subLinks: [
          {
            id: "rodoparana",
            title: "Rodoparaná",
            url: "https://rodoparana.com.br",
            description: "Site oficial da Rodoparaná.",
            icon: Truck,
          },
          {
            id: "grupotimber",
            title: "Grupo Timber",
            url: "https://grupotimber.com.br",
            description: "Site oficial do Grupo Timber.",
            icon: TreePine,
          },
        ],
      },
    ],
  },
];
