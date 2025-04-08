// useSalvarPreNota.ts
import {useAtomValue, useSetAtom} from "jotai";
import {toast} from "sonner";
import axios from "axios";
import {preNotaSchema} from "#/incluir/hooks";
import {anexosAtom, formErrorsAtom, hubAtom, resetSignalAtom} from "../atoms";
import {config} from "config";
import {useState} from "react";

export const useSalvarPreNota = () => {
    const hubData = useAtomValue(hubAtom);
    const anexosCompleto = useAtomValue(anexosAtom);
    const setResetSignal = useSetAtom(resetSignalAtom);
    const setFormErrors = useSetAtom(formErrorsAtom); // Para atualizar os erros
    const [isLoading, setIsLoading] = useState(false);

    const salvar = async (onSaveSuccess?: (rec: string) => void) => {
        // Limpa os erros antes de validar novamente
        setFormErrors({});

        const validationResult = preNotaSchema.safeParse(hubData);

        if (!validationResult.success) {
            // Mapeia os erros para o formErrorsAtom
            const errors: Record<string, string> = {};
            validationResult.error.errors.forEach((err) => {
                const field = err.path[0] as string; // Ex: "TIPO"
                errors[field] = err.message;
            });

            // Atualiza o átomo de erros
            setFormErrors(errors);

            // Exibe os erros no toast
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
            // Envia a pré-nota
            const prenotaResponse = await axios.post(
                `${config.API_PRODUCTION_URL}prenota/InclusaoPreNota`,
                hubData,
                {headers: {"Content-Type": "application/json"}}
            );

            if (!prenotaResponse.data.Sucesso) {
                throw new Error(prenotaResponse.data.Mensagem || "Erro desconhecido");
            }

            const recValue = prenotaResponse.data.REC;

            // Envia anexos (se houver)
            if (anexosCompleto.length > 0) {
                await Promise.all(
                    anexosCompleto.map((anexo) => {
                        const formData = new FormData();
                        formData.append("file", anexo.file);
                        formData.append("seq", anexo.seq);
                        formData.append("doc", recValue);
                        return axios.post(`${config.API_DEVELOPMENT_URL}prenota/SalvarAnexos`, formData);
                    })
                );
            }

            // Feedback e reset
            toast.success("Pré-nota e anexos salvos com sucesso!");
            setResetSignal((prev) => prev + 1); // Dispara reset global
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

    return {salvar, isLoading};
};