import { atom } from "jotai";
import {
  AnexosCompleto,
  AnexoUpload,
  Produto,
  Rateio,
} from "#/incluir/interfaces";
import { rateiosAtom } from "#/incluir/atoms/postAtoms";
// Átomo para armazenar produtos
export const produtosAtom = atom<Produto[]>([]);
// Átomo para armazenar o valor total geral
export const arquivosUploadAtom = atom<AnexoUpload[]>([]); // Para o upload (FormData)
export const anexosAtom = atom<AnexosCompleto[]>([]); // Para o upload (FormData)

export const totalGeralAtom = atom<number>(0);

export const resetSignalAtom = atom<number>(0);
export const formErrorsAtom = atom<Record<string, string>>({});
export const clearErrorAtom = atom(null, (get, set, fieldName: string) => {
  const currentErrors = get(formErrorsAtom);
  const newErrors = { ...currentErrors };
  delete newErrors[fieldName];
  set(formErrorsAtom, newErrors);
});

// Estado global para armazenar a lista de fornecedores carregados
export const fornecedorSupAtom = atom<string>();

// Definição da interface para ações do rateio
type RateioAction =
  | { type: "add"; payload: Rateio }
  | { type: "edit"; payload: { id: string; updatedData: Partial<Rateio> } }
  | { type: "remove"; payload: { id: string } }
  | { type: "clear" };

// Função Type Guard para verificar se a ação é de edição
const isEditAction = (
  action: RateioAction
): action is {
  type: "edit";
  payload: { id: string; updatedData: Partial<Rateio> };
} => {
  return action.type === "edit";
};

// Átomo derivado para manipular os dados do rateio
export const rateiosActionsAtom = atom<null, [RateioAction], void>(
  null,
  (get, set, action) => {
    const currentRateios = get(rateiosAtom);

    switch (action.type) {
      case "add":
        set(rateiosAtom, [...currentRateios, action.payload]);
        break;

      case "edit":
        if (isEditAction(action)) {
          set(
            rateiosAtom,
            currentRateios.map((r) =>
              r.id === action.payload.id
                ? { ...r, ...action.payload.updatedData }
                : r
            )
          );
        }
        break;

      case "remove":
        set(
          rateiosAtom,
          currentRateios.filter((r) => r.id !== action.payload.id)
        );
        break;
      case "clear":
        set(rateiosAtom, []);
        break;

      default:
        throw new Error("Ação inválida!");
    }
  }
);
