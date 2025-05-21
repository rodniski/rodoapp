import { gruposNomes } from "utils";
import {
  AccessibilityIcon,
  ArchiveIcon,
  ChatBubbleIcon,
  ClipboardIcon,
  DashboardIcon,
  DesktopIcon,
  GlobeIcon,
  Pencil2Icon,
  PlusIcon,
  QuestionMarkCircledIcon,
  TableIcon,
  TransformIcon,
  ZoomInIcon,
} from "@radix-ui/react-icons";
import { TreePine, Truck } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: any;
  description?: string;
  requiresGroup?: string[];
  className?: string;
}

export interface NavSubGroup {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: any;
  description: string;
  subGroups: NavSubGroup[];
}

// Cria o subgrupo para Pré Notas
export const prenotaSubGroup: NavSubGroup = {
  id: "prenota",
  title: "Pré Notas",
  items: [
    {
      id: "prenota",
      label: "Lista de Pré Notas",
      href: "/prenota",
      icon: TableIcon,
      description:
        "Visualize e gerencie todas as notas fiscais do sistema. Acompanhe o status, valores e documentos relacionados a cada nota.",
    },
    {
      id: "prenota-inclusao",
      label: "Incluir Nota",
      href: "/prenota/inclusao",
      icon: Pencil2Icon,
      description:
        "Cadastre novas notas fiscais manualmente. Insira dados como número, valor, fornecedor e outros detalhes importantes.",
    },
    {
      id: "pedido-inclusao",
      label: "Incluir Pedido de Compra",
      href: "/prenota/pedido",
      icon: PlusIcon,
      description:
        "Cadastre novos pedidos de compra. Para aceleração do cadastro de Pré Documentos de Entrada",
      requiresGroup: [
        gruposNomes.comprasRodoparana,
        gruposNomes.comprasTimber,
        gruposNomes.admin,
      ],
    },
  ],
};
// Cria o subgrupo para Controle de Itens
export const controleSubGroup: NavSubGroup = {
  id: "controle",
  title: "Controle de Itens",
  items: [
    {
      id: "controle-borracharia",
      label: "Borracharia",
      href: "/controle/borracharia",
      icon: ClipboardIcon,
      description:
        "Registre e acompanhe o controle de saída de itens da borracharia. Mantenha um histórico detalhado das movimentações.",
      requiresGroup: [gruposNomes.borracharia, gruposNomes.admin],
    },
    {
      id: "controle-conferencia",
      label: "Conferência",
      href: "/controle/portaria",
      icon: ZoomInIcon,
      description:
        "Realize a conferência de itens. Compare o estoque físico com o sistema e identifique divergências.",
      requiresGroup: [gruposNomes.portaria, gruposNomes.admin],
    },
    {
      id: "controle-historico",
      label: "Histórico de Conferência",
      href: "/controle",
      icon: ArchiveIcon,
      description:
        "Acesse o histórico completo de conferências realizadas. Visualize relatórios e análises de movimentação.",
    },
  ],
};

// Outros grupos do sistema
export const ambienteItems: NavSubGroup = {
  id: "ambiente",
  title: "Central da TI",
  items: [
    {
      id: "ambiente-intranet",
      label: "Intranet",
      href: "https://intranet.rodoparana.com.br/",
      icon: DesktopIcon,
      description:
        "Acesse a intranet da empresa. Encontre informações internas e ferramentas corporativas.",
    },
    {
      id: "ambiente-suporte",
      label: "Suporte",
      href: "http://hesk.rodoparana.com.br",
      icon: QuestionMarkCircledIcon,
      description:
        "Entre em contato com nossa equipe de suporte. Abra chamados e receba assistência técnica.",
    },
    {
      id: "assinatura",
      label: "Assinatura de Email",
      href: "http://hesk.rodoparana.com.br/signaturegen",
      icon: TransformIcon,
      description:
        "Gere assinaturas de email personalizadas. Mantenha uma identidade visual consistente nas comunicações.",
    },
  ],
};

export const outrosItems: NavSubGroup = {
  id: "outros",
  title: "Links Externos",
  items: [
    {
      id: "outros-central-denuncias",
      label: "Central de Denúncias",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdQg_J6w3Qr6uJffypFuZmPxDJO-5efwPz-l_avQpvLutnZnw/viewform",
      icon: ChatBubbleIcon,
      description: "Canal para reportar irregularidades ou problemas.",
    },
    {
      id: "outros-meu-rh",
      label: "Meu RH",
      href: "https://datasul.rodoparana.com.br/totvs-login/loginForm",
      icon: AccessibilityIcon,
      description:
        "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
    },
    {
      id: "outros-rodoparaná",
      label: "Rodoparaná",
      href: "https://www.rodoparana.com.br",
      icon: Truck,
      description: "Canal para reportar irregularidades ou problemas.",
    },
    {
      id: "outros-timber",
      label: "Timber",
      href: "https://www.grupotimber.com.br",
      icon: TreePine,
      description:
        "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
    },
  ],
};

export const aplicacoesGroup: NavGroup = {
  id: "aplicacoes",
  label: "Aplicações",
  icon: DashboardIcon,
  description: "Integração de controle de itens e pré notas",
  subGroups: [prenotaSubGroup, controleSubGroup],
};

export const corporativoGroup: NavGroup = {
  id: "corporativo",
  label: "Ambiente Corporativo",
  icon: GlobeIcon,
  description: "Links importantes do nosso ambiente.",
  subGroups: [ambienteItems, outrosItems],
};
