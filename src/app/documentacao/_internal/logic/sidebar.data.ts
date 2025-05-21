// app/documentacao/_internal/data/sidebar.data.ts

import type { DocumentationCategoryConfig } from "./sidebar.types"; // Ajuste o caminho
import { Laptop, FileText, BarChart3 } from "lucide-react";

/**
 * @const sidebarData
 * @description Estrutura de dados para a sidebar da documentação.
 * Os IDs dos subitens são os slugs usados nas URLs e nomes de arquivos.
 * As URLs serão geradas dinamicamente no componente da sidebar.
 */
export const sidebarData: DocumentationCategoryConfig[] = [
  {
    id: "doc-ti", // O slug da categoria será derivado para "ti"
    title: "TI",
    icon: Laptop,
    subItems: [
      { id: "agendamentoreuniao", title: "Agendamento de Reunião" },
      { id: "antiameacas", title: "Central anti-ameaças" },
      { id: "assinaturaemail", title: "Assinatura de e-mail" },
      { id: "emailautomatico", title: "E-mail automático" },
      { id: "emaillimitado", title: "E-mails limitados" },
      { id: "gmaildicas", title: "Gmail Dicas" },
      { id: "gmailcelular", title: "Gmail no Celular" },
      { id: "googlemeet", title: "Google Meet Videoconferências" },
      { id: "proxy", title: "Proxy" },
    ],
  },
  {
    id: "doc-protheus",
    title: "Protheus",
    icon: FileText,
    subItems: [
      { id: "agrupados", title: "Agrupados" },
      { id: "alterarcliente", title: "Alterar Cliente" },
      { id: "cadastrokit", title: "Cadastro de KIT" },
      { id: "contabilidade", title: "Contabilidade" },
      { id: "contabilizacao", title: "Contabilização" },
      { id: "dicasuteis", title: "Dicas Úteis" },
      { id: "errotransmitirnota", title: "Erro ao Transmitir Nota" },
      { id: "escalaprodutivo", title: "Escala Produtivo" },
      { id: "exportarxml", title: "Exportar XML" },
      { id: "gnre", title: "GNRE" },
      { id: "kardex", title: "Kardex" },
      { id: "liberacaoprenota", title: "Liberação de Pré-Nota" },
      { id: "os", title: "Ordem de Serviço" },
      { id: "saldoitens", title: "Saldo de Itens" },
      { id: "treinamentodms", title: "Treinamento DMS" },
      { id: "valorinformado", title: "Valor Informado" },
      { id: "vendapecas", title: "Venda de Peças" },
    ],
  },
  {
    id: "doc-powerbi", // Slug "powerbi" (note que é diferente de ti/powerbi)
    title: "Power BI", // Este é o módulo principal Power BI
    icon: BarChart3,
    subItems: [
      { id: "acesso", title: "Acessar pelo navegador" },
      { id: "utilizacao", title: "Como utilizar" },
      { id: "exportacao", title: "Exportação de dados" },
      { id: "filtros", title: "Filtros" },
      { id: "relatorios", title: "Relatórios" },
    ],
  },
];

/**
 * @function getCategorySlug
 * @description Deriva o slug da categoria a partir do ID da categoria.
 * Ex: "doc-ti" -> "ti"
 * @param categoryId O ID da categoria (ex: "doc-ti").
 * @returns O slug da categoria em letras minúsculas.
 */
export const getCategorySlug = (categoryId: string): string => {
  return categoryId.replace(/^doc-/, "").toLowerCase();
};
