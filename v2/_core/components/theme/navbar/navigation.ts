import {
  AccessibilityIcon,
  ArchiveIcon,
  ChatBubbleIcon,
  ClipboardIcon,
  DashboardIcon,
  DesktopIcon,
  FileTextIcon,
  GlobeIcon,
  Pencil2Icon,
  QuestionMarkCircledIcon,
  TableIcon,
  TransformIcon,
  ZoomInIcon,
} from "@radix-ui/react-icons";
import { TreePine, TreePineIcon, Truck } from "lucide-react";

// Interfaces para itens e grupos hierárquicos

export interface NavItem {
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
      label: "Lista de Pré Notas",
      href: "/prenota",
      icon: TableIcon,
      description:
        "Visualize e gerencie todas as notas fiscais do sistema. Acompanhe o status, valores e documentos relacionados a cada nota.",
    },
    {
      label: "Incluir Nota",
      href: "/prenota/inclusao",
      icon: Pencil2Icon,
      description:
        "Cadastre novas notas fiscais manualmente. Insira dados como número, valor, fornecedor e outros detalhes importantes.",
    },
  ],
};
export const assinaturaSubGroup: NavSubGroup = {
  id: "assinatura",
  items: [
    {
      label: "Assinatura de Email",
      href: "http://hesk.rodoparana.com.br/signaturegen",
      icon: TransformIcon,
      description:
        "Gere assinaturas de email personalizadas. Mantenha uma identidade visual consistente nas comunicações.",
    },
  ],
};

// Cria o subgrupo para Controle de Itens
export const controleSubGroup: NavSubGroup = {
  id: "controle",
  title: "Controle de Itens",
  items: [
    {
      label: "Borracharia",
      href: "/controle/borracharia",
      icon: ClipboardIcon,
      description:
        "Registre e acompanhe o controle de saída de itens da borracharia. Mantenha um histórico detalhado das movimentações.",
      requiresGroup: ["000190"],
    },
    {
      label: "Conferência",
      href: "/controle/portaria",
      icon: ZoomInIcon,
      description:
        "Realize a conferência de itens. Compare o estoque físico com o sistema e identifique divergências.",
      requiresGroup: ["000191"],
    },
    {
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
      label: "Intranet",
      href: "https://intranet.rodoparana.com.br/",
      icon: DesktopIcon,
      description:
        "Acesse a intranet da empresa. Encontre informações internas e ferramentas corporativas.",
    },
    {
      label: "Suporte",
      href: "http://hesk.rodoparana.com.br",
      icon: QuestionMarkCircledIcon,
      description:
        "Entre em contato com nossa equipe de suporte. Abra chamados e receba assistência técnica.",
    },
  ],
};

export const outrosItems: NavSubGroup = {
  id: "outros",
  title: "Links Externos",
  items: [
    {
      label: "Central de Denúncias",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdQg_J6w3Qr6uJffypFuZmPxDJO-5efwPz-l_avQpvLutnZnw/viewform",
      icon: ChatBubbleIcon,
      description: "Canal para reportar irregularidades ou problemas.",
    },
    {
      label: "Meu RH",
      href: "https://meurh.foxconn.com.br/web/app/RH/PortalMeuRH/#/login",
      icon: AccessibilityIcon,
      description:
        "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
    },
    {
      label: "Rodoparaná",
      href: "https://www.rodoparana.com.br",
      icon: Truck,
      description: "Canal para reportar irregularidades ou problemas.",
    },
    {
      label: "Timber",
      href: "https://www.grupotimber.com.br",
      icon: TreePine,
      description:
        "Portal de Recursos Humanos: acesse e visualize holerites, histórico de ponto, férias e outros dados.",
    },
  ],
};

export const aplicacoesGroup: NavGroup = {
  label: "Aplicações",
  icon: DashboardIcon,
  description: "Integração de controle de itens e pré notas",
  subGroups: [prenotaSubGroup, controleSubGroup, assinaturaSubGroup],
};

export const corporativoGroup: NavGroup = {
  label: "Ambiente Corporativo",
  icon: GlobeIcon,
  description: "Links importantes do nosso ambiente.",
  subGroups: [ambienteItems, outrosItems],
};
