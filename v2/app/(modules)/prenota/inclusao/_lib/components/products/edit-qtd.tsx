import React, { useCallback, useEffect, useState } from "react";
import { PreNotaItem } from "@inclusao/types";
import { Input } from "ui";
import { toast } from "sonner";
import { usePreNotaAuxStore } from "@inclusao/stores";

// Tipo expandido: Inclui campos opcionais necessários
type PreNotaItemComDesc = PreNotaItem & {
  B1_DESC?: string; // Descrição do produto Protheus
  UNIDADE_XML?: string; // <<< SUBSTITUA PELO NOME CORRETO DO CAMPO UM DA XML >>>
  QUANTIDADE?: number; // <<< SUBSTITUA/CONFIRME O NOME DO CAMPO QTD DO PC >>>
};

// --- Componente Interno para a Célula de Quantidade Editável ---
// Este componente agora lê e escreve na usePreNotaAuxStore
export const EditableQuantityCell: React.FC<{ row: any }> = React.memo(
  ({ row }) => {
    // Usar React.memo para otimizar re-renderizações da célula
    const item = row.original as PreNotaItemComDesc; // Item vindo do array 'editableItems' da store auxiliar

    // <<< USA ACTIONS E ESTADO DA STORE AUXILIAR >>>
    const updateEditableItemQuantity = usePreNotaAuxStore(
      (state) => state.itemEditing.updateEditableItemQuantity
    );
    // Podemos pegar a lista inteira para referência, mas evitamos usá-la diretamente no render para otimizar
    // const editableItems = usePreNotaAuxStore((state) => state.itemEditing.editableItems);

    const isLinked = !!item.PRODUTO;
    // Quantidade atual vinda do item *editável* na store auxiliar
    const currentEditableQuantity = item.QUANTIDADE ?? 0;
    // <<< CONFIRME SE 'ITEM' É O IDENTIFICADOR ÚNICO CORRETO >>>
    const itemIdentifier = item.ITEM;

    // Estado local para controlar o valor DENTRO do input (como string)
    const [inputValue, setInputValue] = useState<string>(
      currentEditableQuantity.toString()
    );

    // Sincroniza o estado local 'inputValue' se o valor no array 'editableItems' mudar
    // Isso acontece se a store for atualizada externamente ou após um save bem-sucedido.
    useEffect(() => {
      // Compara como número para evitar atualizações desnecessárias por formatação ("5" vs "5.0")
      if (parseFloat(inputValue) !== currentEditableQuantity) {
        setInputValue(currentEditableQuantity.toString());
      }
      // A dependência é a quantidade vinda do item na store auxiliar
    }, [currentEditableQuantity]); // Removido inputValue para evitar loops

    // Define limites mínimo e máximo para o input
    const minQuantity = 0;
    // <<< CONFIRME/SUBSTITUA 'QTD_DISPONIVEL_PC' >>>
    // Usa a quantidade do pedido como máximo, se disponível e se o item estiver vinculado
    const maxQuantity =
      isLinked && typeof item.QUANTIDADE === "number"
        ? item.QUANTIDADE
        : undefined; // Sem limite máximo definido se não vinculado ou sem QTD_DISPONIVEL_PC

    // Função para validar, limitar e salvar a quantidade na store AUXILIAR
    const handleSave = useCallback(() => {
      if (!itemIdentifier) {
        console.error(
          "Identificador do item (ITEM) não encontrado para salvar quantidade."
        );
        toast.error("Não foi possível salvar: Item sem identificador.");
        setInputValue(currentEditableQuantity.toString()); // Reverte input para valor atual
        return;
      }

      let numericValue = parseFloat(inputValue);
      let clamped = false;

      // Valida se é um número, senão reverte
      if (isNaN(numericValue)) {
        numericValue = currentEditableQuantity;
        clamped = true; // Considera revertido como "clamped" para atualizar o input visualmente
      }

      // Aplica limite máximo (se definido)
      if (maxQuantity !== undefined && numericValue > maxQuantity) {
        numericValue = maxQuantity;
        toast.warn(
          `Quantidade ajustada para o máximo permitido (${maxQuantity}).`
        );
        clamped = true;
      }
      // Aplica limite mínimo
      if (numericValue < minQuantity) {
        numericValue = minQuantity;
        clamped = true;
      }

      // Atualiza o input visualmente apenas se foi revertido ou limitado
      if (clamped || isNaN(parseFloat(inputValue))) {
        setInputValue(numericValue.toString());
      }

      // Atualiza a store AUXILIAR somente se o valor numérico final for diferente
      if (numericValue !== currentEditableQuantity) {
        updateEditableItemQuantity(itemIdentifier, numericValue); // Chama action da store AUXILIAR
      }
      // Dependências do useCallback: precisam incluir tudo que a função usa de fora
    }, [
      inputValue,
      itemIdentifier,
      currentEditableQuantity,
      maxQuantity,
      updateEditableItemQuantity,
    ]);

    // Renderiza o texto se o item não estiver vinculado
    if (!isLinked) {
      return <span className="text-xs">{currentEditableQuantity}</span>;
    }

    // Renderiza o input editável se o item estiver vinculado
    return (
      <div className="flex items-center gap-1">
        <Input // Usar o componente Input da sua UI lib para consistência
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Atualiza estado local (string)
          onBlur={handleSave} // Salva ao perder foco
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave(); // Salva ao pressionar Enter
              (e.target as HTMLInputElement).blur(); // Tira foco
            } else if (e.key === "Escape") {
              // Reverte para o valor atual da store auxiliar no Esc
              setInputValue(currentEditableQuantity.toString());
              (e.target as HTMLInputElement).blur();
            }
          }}
          min={minQuantity}
          max={maxQuantity} // Define o máximo se disponível
          step="any" // Permite decimais, ajuste para "1" se for sempre inteiro
          className="w-fit h-7 px-1 text-center border rounded focus:outline-none focus:ring-1 focus:ring-ring text-xs bg-background focus:bg-accent" // Estilo ajustado, usando Input da UI
          onWheel={(e) => (e.target as HTMLInputElement).blur()} // Evita mudança com scroll
          title={
            maxQuantity !== undefined
              ? `Valor entre ${minQuantity} e ${maxQuantity}`
              : `Valor mínimo ${minQuantity}`
          }
          // disabled={maxQuantity === undefined} // Desabilitar se não houver limite?
        />
        <span>/</span>
        <span>{currentEditableQuantity}</span>
      </div>
    );
  }
);
EditableQuantityCell.displayName = "EditableQuantityCell";
