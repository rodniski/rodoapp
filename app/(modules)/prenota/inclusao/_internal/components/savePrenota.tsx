"use client";

import { Button } from "ui";
import { parseProtheusError } from "utils";
import { toast } from "sonner";
import { usePreNotaStore } from "@inclusao/stores";
import { prenotaDraftSchema } from "@inclusao/validation/prenota.schema";
import { usePostPreNota } from "@inclusao/hooks";

export function SavePreNotaButton({ disabled }: { disabled?: boolean }) {
  const draft = usePreNotaStore((s) => s.draft);
  const reset = usePreNotaStore((s) => s.reset);

  const mut = usePostPreNota();

  const handleSave = () => {
    const result = prenotaDraftSchema.safeParse(draft);
    if (!result.success) {
      toast.warning("Preencha todos os campos obrigatórios antes de salvar.");
      console.group("⚠️ [SavePreNota] Erros de validação do draft");
      console.log(result.error.flatten());
      console.groupEnd();
      return;
    }
    mut.mutate();
  };

  return (
    <Button onClick={handleSave} disabled={disabled || mut.isPending}>
      {mut.isPending ? "Salvando…" : "Salvar Pré-Nota"}
    </Button>
  );
}
