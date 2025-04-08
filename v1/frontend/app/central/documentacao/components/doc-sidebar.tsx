"use client"

import * as React from "react"
import { ChevronDown, Laptop, FileText, BarChart3 } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "ui"

const docStructure = [
  {
    title: "TI",
    icon: Laptop,
    featured: true,
    items: [
      { title: "Agendamento de Reunião", href: "/central/documentacao/ti/agendamentoreuniao" },
      { title: "Assinatura de E-mail", href: "/central/documentacao/ti/assinaturaemail" },
      { title: "Central anti-ameaças", href: "/central/documentacao/ti/antiameacas" },
      { title: "E-mail automático", href: "/central/documentacao/ti/emailautomatico" },
      { title: "E-mails limitados", href: "/central/documentacao/ti/emaillimitado" },
      { title: "Gmail Dicas", href: "/central/documentacao/ti/gmaildicas" },
      { title: "Gmail no Celular", href: "/central/documentacao/ti/gmailcelular" },
      { title: "Google Meet Videoconferências", href: "/central/documentacao/ti/googlemet" },
      { title: "Power BI", href: "/central/documentacao/ti/powerbi" },
      { title: "Proxy", href: "/central/documentacao/ti/proxy" },
    ],
  },
  {
    title: "Protheus",
    icon: FileText,
    items: [
      { title: "Agrupar Ordens de Serviço para Faturamento", href: "/central/documentacao/protheus/agruparos" },
      { title: "Alterar Cliente da OS", href: "/central/documentacao/protheus/alterarcliente" },
      { title: "Cadastrar Escala de Produtivos", href: "/central/documentacao/protheus/escalaprodutivos" },
      { title: "Cadastro de KIT (Inconveniente)", href: "/central/documentacao/protheus/cadastrokit" },
      { title: "Contabilidade", href: "/central/documentacao/protheus/contabilidade" },
      { title: "Contabilização de OS's", href: "/central/documentacao/protheus/contabilizacaodeos" },
      { title: "Dicas Úteis", href: "/central/documentacao/protheus/dicasuteis" },
      { title: "Erro ao Transmitir Notas Fiscais", href: "/central/documentacao/protheus/errotransmitirnotas" },
      { title: "Exportação de XML", href: "/central/documentacao/protheus/exportarxml" },
      { title: "GNRE", href: "/central/documentacao/protheus/gnre" },
      { title: "Kardex", href: "/central/documentacao/protheus/kardex" },
      { title: "Ordens de Serviço", href: "/central/documentacao/protheus/ordensdeservico" },
      { title: "Rel. Liberação Pré Nota", href: "/central/documentacao/protheus/liberacaoprenota" },
      { title: "Saldo de Itens e Movimentação Entre Armazéns", href: "/central/documentacao/protheus/saldoitens" },
      { title: "Serviço com Valor Informado (VI)", href: "/central/documentacao/protheus/valorinformado" },
      { title: "Treinamento DMS", href: "/central/documentacao/protheus/treinamentodms" },
      { title: "Venda de Peças", href: "/central/documentacao/protheus/vendapecas" },
      { title: "Video Aulas", href: "/central/documentacao/protheus/videoaulas" },
    ],
  },
  {
    title: "PowerBi",
    icon: BarChart3,
    items: [
      { title: "Acessar pelo navegador", href: "/central/documentacao/powerbi/acesso" },
      { title: "Como utilizar", href: "/central/documentacao/powerbi/utilizacao" },
      { title: "Exportação de dados", href: "/central/documentacao/powerbi/exportacao" },
      { title: "Filtros", href: "/central/documentacao/powerbi/filtros" },
      { title: "Relatórios", href: "/central/documentacao/powerbi/relatorios" },
    ],
  },
]

export function DocSidebar() {
  const { open } = useSidebar()
  const [expandedSections, setExpandedSections] = React.useState<string[]>(["TI"])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <Sidebar
      collapsible="icon"
      className={`absolute top-12 left-12 h-full w-64 border-r transition-all duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <SidebarHeader className="border-b p-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold w-fit ${open ? "translate-x-0" : "-translate-x-full"}`}>
            Documentação
          </h3>
          <SidebarTrigger className={`p-5 border rounded-lg bg-muted ${open ? "translate-x-0" : "-translate-x-16"}`} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {docStructure.map((section, index) => (
          <SidebarGroup key={index}>
            <Collapsible
              open={expandedSections.includes(section.title)}
              onOpenChange={() => toggleSection(section.title)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel
                  className={`flex items-center justify-between py-2 ${
                    section.featured ? "bg-muted/70" : "hover:bg-accent hover:text-accent-foreground"
                  } rounded-md px-2 my-1 transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    {section.icon && <section.icon className="h-5 w-5" />}
                    <span>{section.title}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedSections.includes(section.title) ? "rotate-180" : ""
                    }`}
                  />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2 mt-2 ml-3">
                    {section.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={itemIndex}>
                        <SidebarMenuButton asChild>
                          <a href={item.href} className="block px-2 py-1 rounded hover:bg-accent">
                            {item.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

