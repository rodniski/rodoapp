/* ───────────────────── delete-prenota.types.ts ─────────────────────────────
 * Tipos / contratos utilizados pelo hook  `useDeletePrenota`.
 * ---------------------------------------------------------------------------
 * Qualquer consumer (componente, service, teste) deve importar **somente**
 * daqui.  Isso evita dependências cruzadas com “models” ou “entidades” que
 * nada têm a ver com a operação de deletar pré-nota.
 * ------------------------------------------------------------------------- */

/* ╔════════════════════════════════════════════════════════════════════╗
   ║  OPTIONS aceitas por `useDeletePrenota` / `deletePrenota(mutate)`  ║
   ╚════════════════════════════════════════════════════════════════════╝ */

/**
 * Callbacks opcionais disparados após a tentativa de exclusão de uma
 * Pré-nota (SF1).  Use exatamente como no exemplo:
 *
 * ```ts
 * const { mutate: deletePrenota } = useDeletePrenota();
 *
 * deletePrenota(rec, {
 *   onSuccess: () => toast.success("Pré-nota excluída!"),
 *   onError:   (err) => toast.error(err.message),
 * });
 * ```
 */
export interface DeletePrenotaOptions {
  /** Executado quando a API confirma a remoção. */
  onSuccess?: () => void;

  /**
   * Executado sempre que a operação falhar
   * (erro de rede, 4xx/5xx ou regra de negócio).
   */
  onError?: (error: Error) => void;
}

export interface DeletePrenotaButtonProps {
  /** REC (SF1.R_E_C_N_O_) da Pré-nota que será excluída */
  rec: number;
  /** Callback disparado após sucesso lógico/200 OK da API  */
  onDeleted?: () => void;
}