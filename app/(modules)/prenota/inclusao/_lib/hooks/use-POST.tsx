// src/hooks/usePostPreNota.ts
/**
 * @file Hook useMutation para o fluxo completo de criação de Pré-Nota e Upload de Anexos.
 * @description Este hook encapsula a lógica de validação (Zod), chamada à API principal (postPreNota),
 * upload de arquivos anexos (postAnexo) e tratamento de sucesso/erro, incluindo
 * limpeza de stores e invalidação de queries React Query.
 * @requires "use client" - Deve ser utilizado dentro de um Componente Cliente Next.js.
 * @date 2025-04-30 // Data da última modificação significativa
 */
// Lembre-se: Usar dentro de um Componente Cliente -> "use client";

// --------------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------------
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { prenotaDraftSchema } from "@inclusao/validation/prenota.schema"; // Schema Zod
import { usePreNotaStore, useFileUploadAuxStore } from "@inclusao/stores"; // Stores Zustand
import { postPreNota, postAnexo } from "@inclusao/api"; // Funções API
import type {
  PostPreNotaPayload,
  PostPreNotaResponse,
  PreNotaDraft,
  // Anexo // Descomente se usar o tipo Anexo explicitamente
} from "@inclusao/types"; // Tipagens

// --------------------------------------------------------------------------
// Constantes de Estilo para Logs (Exemplo)
// --------------------------------------------------------------------------
const LOG_STYLES = {
  hook: "color: #8A2BE2; font-weight: bold;", // Roxo para nome do hook
  stage: "color: #1E90FF; font-weight: bold;", // Azul para etapas
  success: "color: #228B22; font-weight: bold;", // Verde para sucesso
  error: "color: #DC143C; font-weight: bold;", // Vermelho para erro
  warn: "color: #FFA500; font-weight: bold;", // Laranja para aviso
  info: "color: #4682B4;", // Azul aço para info
  label: "font-weight: bold; color: #555;", // Cinza escuro para labels
  value: "font-weight: normal; color: #333;", // Cinza normal para valores
};

// --------------------------------------------------------------------------
// Tipagem de Erro Específica do Hook
// --------------------------------------------------------------------------
interface PostPreNotaHookError extends Error {
  /** Causa raiz do erro para tratamento diferenciado */
  cause?: "validation" | "network" | "api_logic" | "attachment" | "unknown";
}

// ==========================================================================
// Hook usePostPreNota
// ==========================================================================

/**
 * Hook otimizado para criar pré-nota e enviar anexos.
 * Combina validação, chamada à API principal, upload de anexos,
 * tratamento de erro detalhado e invalidação de query no sucesso.
 *
 * @returns {object} - Objeto de mutação do React Query (mutate, status, error, data, etc.)
 */
export function usePostPreNota() {
  const queryClient = useQueryClient();
  const hookName = "usePostPreNota"; // Para usar nos logs

  // --- Acesso às Stores ---
  // Usando getState aqui conforme solicitado, captura o estado no momento da chamada da mutação.
  const draft = usePreNotaStore.getState().draft;
  const managedFilesMap = useFileUploadAuxStore.getState().managedFiles;
  const resetPreNota = usePreNotaStore.getState().reset;
  // User's code had clearAllManagedFiles, let's use that. Confirm in store definition.
  const clearManagedFiles =
    useFileUploadAuxStore.getState().clearAllManagedFiles;
  // --- Fim Stores ---

  // --- Configuração da Mutação ---
  console.log(
    `%c[${hookName}]%c Hook inicializado.`,
    LOG_STYLES.hook,
    LOG_STYLES.info
  );
  return useMutation<PostPreNotaResponse, PostPreNotaHookError, void>({
    /**
     * Função principal da mutação. Executa todo o fluxo de criação e upload.
     * @async
     * @function mutationFn
     * @returns {Promise<PostPreNotaResponse>} A resposta da API `postPreNota` em caso de sucesso completo.
     * @throws {PostPreNotaHookError} Em caso de falha em qualquer etapa.
     */
    mutationFn: async (): Promise<PostPreNotaResponse> => {
      console.groupCollapsed(
        `%c[${hookName}]%c Iniciando Mutação...`,
        LOG_STYLES.hook,
        LOG_STYLES.stage
      );

      // --- 1. Validação de Anexos ---
      console.log(
        `%c[${hookName}]%c Etapa 1: Validando Anexos...`,
        LOG_STYLES.hook,
        LOG_STYLES.info
      );
      const anexosParaUpload = Array.from(managedFilesMap.values());
      if (anexosParaUpload.length === 0) {
        const error = new Error(
          "Adicione pelo menos 1 anexo."
        ) as PostPreNotaHookError;
        error.cause = "validation";
        console.error(
          `%c[${hookName}]%c Erro Validação Anexo: %c${error.message}`,
          LOG_STYLES.hook,
          LOG_STYLES.error,
          LOG_STYLES.value
        );
        toast.error(error.message);
        console.groupEnd(); // Fecha o grupo principal em caso de erro
        throw error;
      }
      console.log(
        `%c[${hookName}]%c Anexos Validados: %c${anexosParaUpload.length} arquivo(s).`,
        LOG_STYLES.hook,
        LOG_STYLES.success,
        LOG_STYLES.value
      );

      // --- 2. Validação do Draft (Zod) ---
      console.log(
        `%c[${hookName}]%c Etapa 2: Validando Dados do Formulário (Zod)...`,
        LOG_STYLES.hook,
        LOG_STYLES.info
      );
      const validation = prenotaDraftSchema.safeParse(draft);
      if (!validation.success) {
        const error = new Error(
          "Erros de validação no formulário."
        ) as PostPreNotaHookError;
        error.cause = "validation";
        // Log detalhado do erro Zod
        console.groupCollapsed(
          `%c[${hookName}]%c Erro Validação Zod`,
          LOG_STYLES.hook,
          LOG_STYLES.error
        );
        console.warn(validation.error.flatten());
        console.groupEnd();
        // Toast com detalhes (como já estava)
        toast(
          <div>
            {/* Mensagem genérica do erro */}
            <p>{error.message}</p>
            {/* Lista detalhada dos erros de campo */}
            <ul className="list-disc ml-4 max-h-32 overflow-y-auto text-sm">
              {validation.error.errors.map((e, i) => (
                <li key={i}>
                  {/* Mostra o caminho do campo e a mensagem específica */}
                  <span className="font-semibold">
                    {e.path.join(".")}
                  </span>: {e.message}
                </li>
              ))}
            </ul>
          </div>,
          // Opções do toast (duração maior para ler os erros)
          { duration: 10000 } // Aumentei um pouco mais a duração
        );
        console.groupEnd(); // Fecha o grupo principal em caso de erro
        throw error;
      }
      console.log(
        `%c[${hookName}]%c Dados Validados com Sucesso (Zod).`,
        LOG_STYLES.hook,
        LOG_STYLES.success
      );
      const validatedData = validation.data as PreNotaDraft;

      // --- 3. Construção do Payload ---
      console.log(
        `%c[${hookName}]%c Etapa 3: Construindo Payload para API...`,
        LOG_STYLES.hook,
        LOG_STYLES.info
      );
      const payload: PostPreNotaPayload = {
        FILIAL: validatedData.header.FILIAL,
        OPCAO: validatedData.header.OPCAO,
        TIPO: validatedData.header.TIPO,
        FORNECEDOR: validatedData.header.FORNECEDOR,
        LOJA: validatedData.header.LOJA,
        DOC: validatedData.header.DOC,
        SERIE: validatedData.header.SERIE,
        OLDSERIE: validatedData.header.OLDSERIE || "",
        ESPECIE: validatedData.header.ESPECIE,
        CONDFIN: validatedData.header.CONDFIN,
        CHVNF: validatedData.header.CHVNF,
        USERAPP: validatedData.header.USERAPP,
        OBS: validatedData.header.OBS || "",
        prioridade: validatedData.header.prioridade || "",
        JUSTIFICATIVA: validatedData.header.JUSTIFICATIVA || "",
        tiporodo: validatedData.header.tiporodo,
        DTINC: validatedData.header.DTINC,
        CGCPIX: validatedData.header.CGCPIX || "",
        CHAVEPIX: validatedData.header.CHAVEPIX || "",
        ARQUIVOS: validatedData.ARQUIVOS.map((a) => ({ ...a })), // Metadados
        PAGAMENTOS: validatedData.PAGAMENTOS.map((p) => ({ ...p })),
        RATEIOS: validatedData.RATEIOS.map((r) => ({ ...r })),
        itens: validatedData.itens.map((i) => ({ ...i })),
      };
      // Log do payload dentro de um grupo para não poluir muito
      console.groupCollapsed(
        `%c[${hookName}]%c Payload Pronto`,
        LOG_STYLES.hook,
        LOG_STYLES.info
      );
      console.debug(payload);
      console.groupEnd();

      // --- 4. Chamada API postPreNota ---
      let resp: PostPreNotaResponse;
      try {
        console.log(
          `%c[${hookName}]%c Etapa 4: Chamando API postPreNota...`,
          LOG_STYLES.hook,
          LOG_STYLES.info
        );
        resp = await postPreNota(payload);
        console.log(
          `%c[${hookName}]%c Resposta API postPreNota Recebida.`,
          LOG_STYLES.hook,
          LOG_STYLES.success
        );
        console.debug("Dados Recebidos:", resp); // Log da resposta completa para debug
      } catch (networkError: any) {
        // Erro de rede ou falha na chamada fetch/axios dentro de postPreNota
        const error = new Error(
          `Erro de rede ao criar pré-nota: ${networkError.message}`
        ) as PostPreNotaHookError;
        error.cause = "network";
        console.error(
          `%c[${hookName}]%c Erro de Rede (postPreNota): %c${error.message}`,
          LOG_STYLES.hook,
          LOG_STYLES.error,
          LOG_STYLES.value
        );
        console.groupEnd(); // Fecha o grupo principal
        throw error;
      }

      // --- 5. Verificação Lógica da Resposta ---
      console.log(
        `%c[${hookName}]%c Etapa 5: Verificando Sucesso Lógico da API...`,
        LOG_STYLES.hook,
        LOG_STYLES.info
      );
      if (!resp.Sucesso) {
        const error = new Error(
          resp.Mensagem || "Falha na inclusão (sem mensagem)"
        ) as PostPreNotaHookError;
        error.cause = "api_logic";
        console.error(
          `%c[${hookName}]%c Erro Lógico API (postPreNota): %c${error.message}`,
          LOG_STYLES.hook,
          LOG_STYLES.error,
          LOG_STYLES.value
        );
        console.groupEnd(); // Fecha o grupo principal
        throw error;
      }

      // --- Sucesso Lógico da Pré-Nota ---
      const rec = String(resp.REC); // Confirmado que REC é string
      console.log(
        `%c[${hookName}]%c Pré-Nota Criada com Sucesso! %cREC: ${rec}`,
        LOG_STYLES.hook,
        LOG_STYLES.success,
        LOG_STYLES.value
      );
      toast.info(`Pré-nota criada (REC: ${rec}). Enviando anexos...`);

      // --- 6. Envio dos Anexos ---
      console.groupCollapsed(
        `%c[${hookName}]%c Etapa 6: Enviando Anexos (${anexosParaUpload.length})...`,
        LOG_STYLES.hook,
        LOG_STYLES.stage
      );
      try {
        await Promise.all(
          anexosParaUpload.map(async ({ seq, file }) => {
            // Tornar async para logar início/fim individual
            console.log(
              `%c[${hookName}]%c  -> Enviando anexo %c${seq}%c (%c${file.name}%c)...`,
              LOG_STYLES.hook,
              LOG_STYLES.info,
              LOG_STYLES.label,
              LOG_STYLES.info,
              LOG_STYLES.value,
              LOG_STYLES.info
            );
            await postAnexo(rec, seq, file); // postAnexo deve tratar seus erros internos
            console.log(
              `%c[${hookName}]%c  ✅ Anexo %c${seq}%c enviado.`,
              LOG_STYLES.hook,
              LOG_STYLES.success,
              LOG_STYLES.label,
              LOG_STYLES.success
            );
          })
        );
        console.log(
          `%c[${hookName}]%c ✅ Todos os anexos enviados com sucesso.`,
          LOG_STYLES.hook,
          LOG_STYLES.success
        );
      } catch (attachmentError: any) {
        const error = new Error(
          `Falha ao enviar anexo: ${attachmentError.message}`
        ) as PostPreNotaHookError;
        error.cause = "attachment";
        // O erro específico já deve ter sido logado dentro de postAnexo (idealmente)
        console.error(
          `%c[${hookName}]%c ❌ Erro durante o envio de anexos.`,
          LOG_STYLES.hook,
          LOG_STYLES.error
        );
        console.groupEnd(); // Fecha grupo de anexos
        console.groupEnd(); // Fecha grupo principal
        toast.error(error.message);
        throw error;
      }
      console.groupEnd(); // Fecha grupo de anexos

      // --- 7. Sucesso Total ---
      console.log(
        `%c[${hookName}]%c Etapa 7: Sucesso Total! Limpando stores...`,
        LOG_STYLES.hook,
        LOG_STYLES.stage
      );
      resetPreNota();
      // Usa a action do código do usuário - VERIFICAR SE É O NOME CORRETO NA STORE!
      clearManagedFiles();
      console.log(
        `%c[${hookName}]%c Stores Resetadas.`,
        LOG_STYLES.hook,
        LOG_STYLES.success
      );
      toast.success("Pré-nota e anexos salvos com sucesso!");

      console.groupEnd(); // Fecha o grupo principal da mutação com sucesso
      return resp; // Retorna a resposta original de postPreNota
    }, // Fim mutationFn

    // --- Tratador de Erros da Mutação ---
    /**
     * Callback executado quando a `mutationFn` lança um erro.
     * @param {PostPreNotaHookError} error - O erro capturado.
     */
    onError: (error: PostPreNotaHookError) => {
      // O log detalhado do erro já foi feito na etapa onde ele ocorreu.
      // Apenas logamos que a mutação falhou como um todo.
      console.error(
        `%c[${hookName}]%c ❌ Mutação Falhou! Causa: %c${
          error.cause || "unknown"
        }%c, Mensagem: %c${error.message}`,
        LOG_STYLES.hook,
        LOG_STYLES.error,
        LOG_STYLES.label,
        LOG_STYLES.error,
        LOG_STYLES.label,
        LOG_STYLES.value
      );

      // Mostra toast genérico apenas se não for erro de validação (que já teve toast específico)
      if (error.cause !== "validation") {
        toast.error(`Erro ao salvar: ${error.message || "Erro desconhecido"}`);
      }
      // Nota: Não fechamos console.groupEnd() aqui porque o erro pode ter ocorrido antes do grupo principal ser fechado.
    },

    // --- Callback de Sucesso da Mutação ---
    /**
     * Callback executado após o sucesso completo da `mutationFn`.
     * Ideal para efeitos colaterais como invalidação de cache.
     * @param {PostPreNotaResponse} data - O dado retornado pela `mutationFn` (neste caso, a resposta de sucesso de `postPreNota`).
     */
    onSuccess: (data: PostPreNotaResponse) => {
      // Confirma o sucesso lógico (embora já verificado na mutationFn, é uma boa prática)
      if (data.Sucesso === true) {
        console.log(
          `%c[${hookName}]%c Mutação Concluída com Sucesso. %cREC: ${data.REC}`,
          LOG_STYLES.hook,
          LOG_STYLES.success,
          LOG_STYLES.value
        );

        // Ação principal pós-sucesso: invalidar query para atualizar UI
        console.log(
          `%c[${hookName}]%c Invalidando query %c'prenotas-lista'%c...`,
          LOG_STYLES.hook,
          LOG_STYLES.info,
          LOG_STYLES.label,
          LOG_STYLES.info
        );
        queryClient.invalidateQueries({ queryKey: ["prenotas-lista"] });
      } else {
        console.warn(
          `%c[${hookName}]%c Callback onSuccess chamado, mas resposta não indica sucesso lógico.`,
          LOG_STYLES.hook,
          LOG_STYLES.warn
        );
      }
    },
  }); // Fim useMutation
} // Fim usePostPreNota
