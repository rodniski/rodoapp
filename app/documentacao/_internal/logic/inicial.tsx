import { BarChart3, FileText, Laptop } from "lucide-react";
import React from "react";

export interface inicialCards {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export const inicialCards =[
    {
        title: "Documentação TI",
        description: "Reúne instruções sobre reuniões, proteção contra ameaças, assinaturas de e-mail, Gmail, Google Meet e outros.",
        icon: <Laptop />,
    },
    {
        title: "Documentação Protheus",
        description: "Contém informações sobre cadastros, contabilidade, ordens de serviço, notas fiscais, dicas, vídeo aulas e outros.",
        icon: <FileText />,
    },
    {
        title: "Documentação Power BI",
        description: "Explica como acessar e usar o Power BI, exportar dados, aplicar filtros e interpretar relatórios.",
        icon: <BarChart3 />,
    }
]