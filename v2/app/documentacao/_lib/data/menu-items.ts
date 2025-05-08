import type { Category } from "./types";
import { Laptop, FileText, BarChart3 } from "lucide-react"

export const documentacaoData: Category[] = [
	{
		id: "doc-ti",
		title: "TI",
		icon: Laptop,
		subItem: [
			{
				id: "agendamento-reuniao",
				title: "Agendamento de Reunião",
				url: "/documentacao/ti/agendamentoreuniao",
			},
			{
				id: "central-anti-ameacas",
				title: "Central anti-ameaças",
				url: "/documentacao/ti/antiameacas",
			},
			{
				
				id: "assinatura-email",
				title: "Assinatura de e-mail",
				url: "/documentacao/ti/assinaturaemail",
			},
			{
				id: "email-automatico",
				title: "E-mail automático",
				url: "/documentacao/ti/emailautomatico",
			},
			{
				id: "emails-limitados",
				title: "E-mails limitados",
				url: "/documentacao/ti/emaillimitado",
			},
			{
				id: "gmail-dicas",
				title: "Gmail Dicas",
				url: "/documentacao/ti/gmaildicas",
			},
			{
				id: "gmail-no-celular",
				title: "Gmail no Celular",
				url: "/documentacao/ti/gmailcelular",
			},
			{
				id: "google-meet-videoconferencias",
				title: "Google Meet Videoconferências",
				url: "/documentacao/ti/googlemet",
			},
			{
				id: "power-bi",
				title: "Power BI",
				url: "/documentacao/ti/powerbi",
			},
			{
				id: "proxy",
				title: "Proxy",
				url: "/documentacao/ti/proxy",
			},
		]
	},
	{
		id: "doc-protheus",
		title: "Protheus",
		icon: FileText,
		subItem: [
			{
				id: "agrupar-ordens-servico-para-faturamento",
				title: "Agrupar Ordens de Serviço para Faturamento",
				url: "/documentacao/protheus/agruparos",
			},
			{
				id: "alterar-cliente-da-os",
				title: "Alterar Cliente da OS",
				url: "/documentacao/protheus/alterarcliente",
			},
			{
				id: "cadastrar-escala-de-produtivos",
				title: "Cadastrar Escala de Produtivos",
				url: "/documentacao/protheus/escalaprodutivos",
			},
			{
				id: "cadastro-de-kit-inconveniente",
				title: "Cadastro de KIT (Inconveniente)",
				url: "/documentacao/protheus/cadastrokit",
			},
			{
				id: "contabilidade",
				title: "Contabilidade",
				url: "/documentacao/protheus/contabilidade",
			},
			{
				id: "contabilizacao-de-os",
				title: "Contabilização de OS's",
				url: "/documentacao/protheus/contabilizacaodeos",
			},
			{
				id: "dicas-uteis",
				title: "Dicas Úteis",
				url: "/documentacao/protheus/dicasuteis",
			},
			{
				id: "erro-transmitir-notas-fiscais",
				title: "Erro ao Transmitir Notas Fiscais",
				url: "/documentacao/protheus/errotransmitirnotas",
			},
			{
				id: "exportar-xml",
				title: "Exportação de XML",
				url: "/documentacao/protheus/exportarxml",
			},
			{
				id: "gnre",
				title: "GNRE",
				url: "/documentacao/protheus/gnre",
			},
			{
				id: "kardex",
				title: "Kardex",
				url: "/documentacao/protheus/kardex",
			},
			{
				id: "ordens-de-servico",
				title: "Ordens de Serviço",
				url: "/documentacao/protheus/ordensdeservico",
			},
			{
				id: "rel-liberacao-pre-nota",
				title: "Rel. Liberação Pré Nota",
				url: "/documentacao/protheus/liberacaoprenota",
			},
			{
				id: "saldo-de-itens-e-movimentacao-entre-armazens",
				title: "Saldo de Itens e Movimentação Entre Armazéns",
				url: "/documentacao/protheus/saldoitens",
			},
			{
				id: "servico-valor-informado",
				title: "Serviço com Valor Informado (VI)",
				url: "/documentacao/protheus/valorinformado",
			},
			{
				id: "treinamento-dms",
				title: "Treinamento DMS",
				url: "/documentacao/protheus/treinamentodms",
			},
			{
				id: "venda-de-pecas",
				title: "Venda de Peças",
				url: "/documentacao/protheus/vendapecas",
			},
			{
				id: "video-aulas",
				title: "Video Aulas",
				url: "/documentacao/protheus/videoaulas",
			},
		]
	},
	{
		id: "doc-power-bi",
		title: "Power BI",
		icon: BarChart3,
		subItem: [
			{
				id: "acessando-navegador",
				title: "Acessar pelo navegador",
				url: "/documentacao/powerbi/acesso"
			},
			{
				id: "como-utilizar",
				title: "Como utilizar",
				url: "/documentacao/powerbi/utilizacao"
			},
			{
				id: "exportando-dados",
				title: "Exportação de dados",
				url: "/documentacao/powerbi/exportacao"
			},
			{
				id: "filtros",
				title: "Filtros",
				url: "/documentacao/powerbi/filtros"
			},
			{
				id: "relatorios",
				title: "Relatórios",
				url: "/documentacao/powerbi/relatorios"
			},
		]
	}
];