import {
  Receipt,
  GraduationCap,
  MailCheck,
  LifeBuoy,
  Usb,
  Truck,
  TreePine,
  SquareArrowOutUpRight,
  FileCheck,
  Warehouse,
  FileClock,
  Table,
  NotebookPen,
  FileSearch,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: any;
  description?: string;
  requiresGroup?: string[];
  className?: string;
}

export interface ProjectItem extends NavItem {
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  icon?: any;
  description: string;
  items: NavItem[];
}

export const prenotaItems: NavGroup = {
  label: "Pre Notas",
  href: "/central/prenota",
  icon: Receipt,
  description: "Gerenciamento de notas fiscais e documentos fiscais",
  items: [
    {
      label: "Lista de Pre Notas",
      href: "/central/prenota",
      icon: Table,
      description:
        "Visualize e gerencie todas as notas fiscais do sistema. Acompanhe o status, valores e documentos relacionados a cada nota.",
    },
    {
      label: "Incluir Manualmente",
      href: "/central/prenota/manual",
      icon: NotebookPen,
      description:
        "Cadastre novas notas fiscais manualmente. Insira dados como número, valor, fornecedor e outros detalhes importantes.",
    },
    {
      label: "Incluir XML",
      href: "/central/prenota/xml",
      icon: FileSearch,
      description:
        "Importe notas fiscais automaticamente através de arquivos XML. Processe múltiplos documentos de uma vez.",
    },
  ],
};

export const controleItensItems: NavGroup = {
  label: "Controle de Itens",
  href: "/central/portaria",
  icon: Truck,
  description: "Controle de entrada e saída de itens do estoque",
  items: [
    {
      label: "Borracharia",
      href: "/central/portaria/lancamento",
      icon: Warehouse,
      description:
        "Registre e acompanhe o controle de saída de itens da borracharia. Mantenha um histórico detalhado das movimentações.",
      requiresGroup: ["000190"], // Requer grupo 000190 - borracharia
    },
    {
      label: "Conferência",
      href: "/central/portaria/conferencia",
      icon: FileCheck,
      description:
        "Realize a conferência de itens. Compare o estoque físico com o sistema e identifique divergências.",
      requiresGroup: ["000191"], // Requer grupo 000191 - portaria
    },
    {
      label: "Histórico de Conferência",
      href: "/central/portaria/historico",
      icon: FileClock,
      description:
        "Acesse o histórico completo de conferências realizadas. Visualize relatórios e análises de movimentação.",
      // Sem requisito de grupo, acessível para todos
    },
  ],
};

export const outrosItems: NavGroup = {
  label: "Links externos",
  href: "/central/links",
  icon: SquareArrowOutUpRight,
  description: "Links úteis e ferramentas externas",
  items: [
    {
      label: "Documentação",
      href: "/central/documentacao",
      icon: GraduationCap,
      description:
        "Acesse a documentação completa do sistema. Encontre guias, tutoriais e informações técnicas.",
    },
    {
      label: "Assinatura de Email",
      href: "http://hesk.rodoparana.com.br/signaturegen",
      icon: MailCheck,
      description:
        "Gere assinaturas de email personalizadas. Mantenha uma identidade visual consistente nas comunicações.",
    },
    {
      label: "Suporte",
      href: "http://hesk.rodoparana.com.br",
      icon: LifeBuoy,
      description:
        "Entre em contato com nossa equipe de suporte. Abra chamados e receba assistência técnica.",
    },
    {
      label: "Intranet",
      href: "https://intranet.rodoparana.com.br/",
      icon: Usb,
      description:
        "Acesse a intranet da empresa. Encontre informações internas e ferramentas corporativas.",
    },
    {
      label: "Rodoparaná",
      href: "https://rodoparana.com.br",
      icon: Truck,
      description:
        "Visite o site oficial da Rodoparaná. Conheça mais sobre a empresa e seus serviços.",
    },
    {
      label: "Timber",
      href: "https://grupotimber.com.br",
      icon: TreePine,
      description:
        "Acesse o site do Grupo Timber. Explore informações sobre a empresa e suas operações.",
    },
  ],
};
