import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";
import axios from "axios";
import { preNotaSchema } from "#/incluir/hooks";
import { anexosAtom, formErrorsAtom, hubAtom, resetSignalAtom } from "../atoms";
import { config } from "config";
import { useState } from "react";
import { ProdutoPOST } from "../interfaces";

export const useSalvarPreNota = () => {
  const hubData = useAtomValue(hubAtom);
  const anexosCompleto = useAtomValue(anexosAtom);
  const setResetSignal = useSetAtom(resetSignalAtom);
  const setFormErrors = useSetAtom(formErrorsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const salvar = async (
    onSaveSuccess?: (rec: string) => void,
    handlers?: {
      openAnexo?: () => void;
      openRateio?: () => void;
    }
  ) => {
    // Validação prévia antes de salvar
    if (anexosCompleto.length === 0) {
      toast.error("Adicione ao menos um anexo.");
      handlers?.openAnexo?.();
      return;
    }

    const totalRateado =
      hubData.RATEIOS?.reduce((acc: number, r: any) => acc + r.valor, 0) || 0;
    const totalGeral = hubData.itens.reduce(
      (acc: number, item: ProdutoPOST) => acc + item.TOTAL,
      0
    );
    if (totalRateado < totalGeral) {
      toast.error("Distribua 100% do rateio antes de salvar.");
      handlers?.openRateio?.();
      return;
    }

    // Validação via zod
    setFormErrors({});
    const validationResult = preNotaSchema.safeParse(hubData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });

      setFormErrors(errors);
      toast.error(
        <div>
          <p>Erros de validação:</p>
          <ul className="list-disc ml-4">
            {validationResult.error.errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      return;
    }

    setIsLoading(true);

    try {
      const prenotaResponse = await axios.post(
        `${config.API_PRODUCTION_URL}prenota/InclusaoPreNota`,
        hubData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!prenotaResponse.data.Sucesso) {
        throw new Error(prenotaResponse.data.Mensagem || "Erro desconhecido");
      }

      const recValue = prenotaResponse.data.REC;

      // Upload dos anexos
      if (anexosCompleto.length > 0) {
        await Promise.all(
          anexosCompleto.map((anexo) => {
            const formData = new FormData();
            formData.append("file", anexo.file);
            formData.append("seq", anexo.seq);
            formData.append("doc", recValue);
            return axios.post(
              `${config.API_DEVELOPMENT_URL}prenota/SalvarAnexos`,
              formData
            );
          })
        );
      }

      setResetSignal((prev) => prev + 1);
      toast.success("Pré-nota e anexos salvos com sucesso!");
      onSaveSuccess?.(recValue);
    } catch (error) {
      let errorMessage = "Erro ao salvar pré-nota";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.Mensagem || errorMessage;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { salvar, isLoading };
};
