import { getDefaultStore } from "jotai";
import { filiaisAtom, filiaisLoadingAtom, Filial } from "$/atoms";

export const fetchFiliais = async (): Promise<void> => {
  const store = getDefaultStore();
  store.set(filiaisLoadingAtom, true);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_PRODUCTION_URL}reidoapsdu/consultar/filiais/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar filiais: ${response.statusText}`);
    }

    const data = await response.json();

    const formattedData = data.map((filial: Filial) => ({
      numero: filial.numero.trim(),
      filial: filial.filial.trim(),
      cnpjFilial: filial.cnpjFilial.trim(),
    }));

    // Salva no átomo global
    store.set(filiaisAtom, formattedData);
  } catch (error) {
    console.error("Erro ao buscar filiais:", error);
  } finally {
    store.set(filiaisLoadingAtom, false);
  }
};
