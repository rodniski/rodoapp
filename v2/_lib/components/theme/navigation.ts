import { Home, Users, Settings, FileText, Github, Globe, Menu, Receipt, RefreshCcw, GraduationCap, MailCheck, LifeBuoy, Usb, Truck, TreePine } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: any;
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
  label: "Lançamento de Notas",
  href: "/central/prenota",
  icon: Receipt,
  description: "Gerenciamento de notas fiscais e documentos fiscais",
  items: [
    {
      label: "Lista de Pre Notas",
      href: "/central/prenota",
    },
    {
      label: "Incluir Manualmente",
      href: "/central/prenota/manual",
    },
    {
      label: "Incluir XML",
      href: "/central/prenota/xml",
    },
  ],
};

export const controleSaidaItems: NavGroup = {
  label: "Controle de Itens",
  href: "/central/portaria",
  icon: RefreshCcw,
  description: "Controle de entrada e saída de itens do estoque",
  items: [
    {
      label: "Borracharia",
      href: "/central/portaria/lancamento",
    },
    {
      label: "Conferência",
      href: "/central/portaria/conferencia",
    },
    {
      label: "Histórico de Conferência",
      href: "/central/portaria/historico",
    },
  ],
};

export const outrosItems: NavGroup = {
  label: "Links externos",
  href: "/central/links",
  icon: Menu,
  description: "Links úteis e ferramentas externas",
  items: [
    {
      label: "Documentação",
      href: "/central/documentacao",
      icon: GraduationCap,
    },
    {
      label: "Assinatura de Email",
      href: "http://hesk.rodoparana.com.br/signaturegen",
      icon: MailCheck,
    },
    {
      label: "Suporte",
      href: "http://hesk.rodoparana.com.br",
      icon: LifeBuoy,
    },
    {
      label: "Intranet",
      href: "https://intranet.rodoparana.com.br/",
      icon: Usb,
    },
    {
      label: "Rodoparaná",
      href: "https://rodoparana.com.br",
      icon: Truck,
    },
    {
      label: "Timber",
      href: "https://grupotimber.com.br",
      icon: TreePine,
    },
  ],
}; 