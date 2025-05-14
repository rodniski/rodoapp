// types/type.conferencia.ts
export interface ProdutoInfo {
    NFLabel: string;
    ProdutoDesc: string;
    QtdEntregue: number;
    Placa: string;
    Sequencia: string;
}

export interface ConferenceDialogProps {
    produto: ProdutoInfo;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    title: string;
    confirmText: string;
    variant?: "destructive" | "default";
}

export interface ConferenceActionsProps {
    produto: {
        NFLabel: string;
        ProdutoDesc: string;
        QtdEntregue: number;
        Placa: string;
        Sequencia: string;
    };
}