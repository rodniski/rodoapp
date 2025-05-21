// @inclusao/stores/file-upload-aux-store.ts (Refatorado)
import { create } from "zustand";
// Não importa mais usePreNotaStore aqui

/** Representa um arquivo gerenciado por este store, incluindo o objeto File */
export interface ManagedFile {
  /** Sequencial único (para linkar com PreNotaStore e progresso) */
  seq: string;
  /** O objeto File original */
  file: File;
  /** Nome original do arquivo (redundante com file.name mas conveniente) */
  fileName: string;
  /** Descrição associada */
  description: string;
}

/** Representa um item na fila de upload com seu progresso */
export interface UploadProgressItem {
    seq: string;
    fileName: string;
    progress: number; // 0-100
}

// --- Interface do Estado e Ações ---
export interface FileUploadAuxState {
  /** Mapa de arquivos gerenciados, chaveados por SEQ */
  managedFiles: Map<string, ManagedFile>;
  /** Mapa de progresso de upload, chaveados por SEQ */
  uploadProgress: Map<string, UploadProgressItem>;

  // --- Ações (NÃO sincronizam mais com usePreNotaStore) ---

  /** Adiciona um arquivo a este store e retorna o SEQ gerado */
  addManagedFile: (file: File, initialDescription?: string) => string;
  /** Remove um arquivo deste store (pelo SEQ) */
  removeManagedFile: (seq: string) => void;
  /** Atualiza a descrição de um arquivo neste store */
  updateManagedFileDescription: (seq: string, description: string) => void;
  /** Limpa todos os arquivos gerenciados e o progresso */
  clearAllManagedFiles: () => void;

  /** Adiciona/atualiza um item na fila/mapa de progresso */
  setUploadProgress: (seq: string, fileName: string, progress: number) => void;
  /** Remove um item da fila/mapa de progresso */
  removeUploadProgress: (seq: string) => void;

  // --- Getters/Seletores ---
  /** Obtém os dados de um arquivo gerenciado (incluindo o File) */
  getManagedFileData: (seq: string) => ManagedFile | undefined;
  /** Obtém apenas o objeto File */
  getFileBySeq: (seq: string) => File | undefined;
}

/**
 * Hook Zustand Auxiliar DESACOPLADO para gerenciar:
 * 1. Os objetos File reais dos anexos e suas descrições (`managedFiles`).
 * 2. O progresso dos uploads em andamento (`uploadProgress`).
 *
 * IMPORTANTE: As ações deste store NÃO sincronizam mais o usePreNotaStore.
 * O componente que usar estas ações é RESPONSÁVEL por chamar as ações
 * correspondentes no usePreNotaStore (addAnexo, removeAnexo, etc.) para
 * manter os metadados sincronizados.
 */
export const useFileUploadAuxStore = create<FileUploadAuxState>((set, get) => ({
  // --- Estado Inicial ---
  managedFiles: new Map(),
  uploadProgress: new Map(),

  // --- Ações (Agora independentes) ---

  addManagedFile: (file, initialDescription = "") => {
    const seq = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const newManagedFile: ManagedFile = {
      seq,
      file,
      fileName: file.name,
      description: initialDescription,
    };

    set((state) => ({
        managedFiles: new Map(state.managedFiles).set(seq, newManagedFile)
    }));

    console.log("AuxStore: Arquivo gerenciado adicionado:", seq, file.name);
    // RESPONSABILIDADE DO COMPONENTE: Chamar usePreNotaStore.getState().addAnexo({ seq, arq: file.name, desc: initialDescription });
    return seq; // Retorna o SEQ para o componente poder sincronizar
  },

  removeManagedFile: (seq) => {
    set((state) => {
      const newManagedFiles = new Map(state.managedFiles);
      const fileRemoved = newManagedFiles.delete(seq); // delete retorna true se removeu

      const newUploadProgress = new Map(state.uploadProgress);
      newUploadProgress.delete(seq); // Remove do progresso também

      if(fileRemoved) console.log("AuxStore: Arquivo gerenciado removido:", seq);
      // RESPONSABILIDADE DO COMPONENTE: Chamar usePreNotaStore.getState().removeAnexo(seq);
      return { managedFiles: newManagedFiles, uploadProgress: newUploadProgress };
    });
  },

  updateManagedFileDescription: (seq, description) => {
    set((state) => {
      const currentFile = state.managedFiles.get(seq);
      if (currentFile) {
        const updatedFile = { ...currentFile, description: description };
        const newManagedFiles = new Map(state.managedFiles).set(seq, updatedFile);
         console.log("AuxStore: Descrição atualizada:", seq);
         // RESPONSABILIDADE DO COMPONENTE: Chamar usePreNotaStore.getState().updateAnexoDesc(seq, description);
        return { managedFiles: newManagedFiles };
      }
      return state; // Não altera se não encontrar
    });
  },

  clearAllManagedFiles: () => {
    set({ managedFiles: new Map(), uploadProgress: new Map() });
    console.log("AuxStore: Todos os arquivos gerenciados e progresso limpos.");
     // RESPONSABILIDADE DO COMPONENTE: Chamar usePreNotaStore.getState().clearAnexos();
  },

  setUploadProgress: (seq, fileName, progress) => {
     const newItem: UploadProgressItem = {
         seq,
         fileName, // Incluímos o nome aqui para conveniência, embora não esteja estritamente no UploadItem original do seu tipo
         progress: Math.max(0, Math.min(100, Math.round(progress))) // Garante 0-100
     };
     set((state) => ({
         uploadProgress: new Map(state.uploadProgress).set(seq, newItem)
     }));
     // Log pode ser adicionado aqui se necessário
  },

  removeUploadProgress: (seq) => {
     set((state) => {
        const newUploadProgress = new Map(state.uploadProgress);
        const progressRemoved = newUploadProgress.delete(seq);
        if(progressRemoved) console.log("AuxStore: Progresso de upload removido:", seq);
        return { uploadProgress: newUploadProgress };
     });
  },


  // --- Getters ---
  getManagedFileData: (seq) => {
      return get().managedFiles.get(seq);
  },
  getFileBySeq: (seq) => {
      return get().managedFiles.get(seq)?.file;
  }

}));

// --- Seletores para conveniência ---
/** Hook para acessar o Mapa de arquivos gerenciados (SEQ -> ManagedFile) */
export const useManagedFiles = () => useFileUploadAuxStore((state) => state.managedFiles);
/** Hook para acessar o Mapa de progresso de uploads (SEQ -> UploadProgressItem) */
export const useUploadProgressMap = () => useFileUploadAuxStore((state) => state.uploadProgress);