/* ------------------------------------------------------------------------
 * Botão que valida e dispara o POST da Pré-Nota
 * --------------------------------------------------------------------- */
"use client";

import { Button } from "ui";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePreNotaStore } from "@inclusao/stores";
import { postPreNota } from "@inclusao/api";          // ▼ item 3
import { prenotaDraftSchema } from "@inclusao/validation/prenota.schema";

export function SavePreNotaButton({ disabled }: { disabled?: boolean }) {
  const draft = usePreNotaStore(s => s.draft);
  const reset = usePreNotaStore(s => s.reset);

  /* — mutation ------------------------------------------------------- */
  const mut = useMutation({
    mutationFn: postPreNota,
    onSuccess: (data) => {
      toast.success(`Pré-Nota ${data.numero} gravada com sucesso!`);
      reset();                    // limpa o formulário
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Falha ao gravar a Pré-Nota.");
    }
  });

  /* — handler -------------------------------------------------------- */
  const handleSave = () => {
    /* valida draft completo */
    const parsed = prenotaDraftSchema.safeParse(draft);
    if (!parsed.success) {
      toast.warning("Preencha todos os campos obrigatórios antes de salvar.");
      console.warn(parsed.error.flatten());            // log detalhado
      return;
    }
    mut.mutate(parsed.data);
  };

  return (
    <Button onClick={handleSave} disabled={disabled || mut.isLoading}>
      {mut.isLoading ? "Salvando…" : "Salvar Pré-Nota"}
    </Button>
  );
}
