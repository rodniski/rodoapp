"use client";

import * as React from "react";
import { Badge, Button } from "ui"; // Assumindo que vêm da sua lib de UI temática
import { XIcon } from "lucide-react";
import { cn } from "utils"; // Sua utilidade cn

// Interface de props mais alinhada com React.InputHTMLAttributes
type InputTagsProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>, // Usando atributos de input HTML do React
  "value" | "onChange" // Omitindo value e onChange padrão do input HTML
> & {
  value: string[]; // O valor é um array de strings
  onChange: React.Dispatch<React.SetStateAction<string[]>>; // Função para atualizar o array
  // Você pode adicionar outras props customizadas aqui se necessário
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, disabled, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    // Função auxiliar para adicionar tags, evitando duplicatas e vazias
    const addTagsFromInput = (inputString: string) => {
      const newTags = inputString
        .split(",")
        .map((chunk) => chunk.trim())
        .filter((tag) => tag.length > 0); // Filtra tags vazias

      if (newTags.length > 0) {
        onChange((prevValue) =>
          Array.from(new Set([...prevValue, ...newTags]))
        );
      }
    };

    React.useEffect(() => {
      // Processa vírgulas no pendingDataPoint (útil para colar texto com vírgulas)
      if (pendingDataPoint.includes(",")) {
        addTagsFromInput(pendingDataPoint);
        setPendingDataPoint(""); // Limpa o input após processar as vírgulas
      }
    }, [pendingDataPoint]); // Dependência apenas em pendingDataPoint para este efeito específico

    const handleAddPendingDataPoint = () => {
      // Adiciona o conteúdo atual do input como uma tag (ou múltiplas se tiver vírgula)
      // e limpa o input.
      if (pendingDataPoint.trim()) {
        addTagsFromInput(pendingDataPoint); // Processa vírgulas também aqui
        setPendingDataPoint("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAddPendingDataPoint();
      } else if (
        e.key === "Backspace" &&
        pendingDataPoint.length === 0 &&
        value.length > 0
      ) {
        e.preventDefault();
        // Remove a última tag do array 'value'
        onChange((prevValue) => prevValue.slice(0, -1));
      }
    };

    return (
      <div
        className={cn(
          // Usando classes Tailwind que mapeiam para variáveis de tema (shadcn/ui style)
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          // Estilos de foco usando :has (requer Tailwind v3.4+) ou pode usar focus-within no wrapper
          // Se :has não for suportado ou preferir focus-within:
          // "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          // Com :has para aplicar o anel apenas quando o input interno está focado:
          "has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className
        )}
        // Se não usar :has, pode-se adicionar um onClick ao wrapper para focar o input interno
        // onClick={() => ref?.current?.focus()} // Exemplo
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary" className="whitespace-nowrap">
            {item}
            <Button
              type="button" // Evita submissão de formulário se estiver dentro de um
              variant="ghost"
              size="icon"
              className="ml-1.5 h-4 w-4 hover:bg-destructive/20" // Ajuste de tamanho e margem
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
              disabled={disabled}
            >
              <XIcon className="h-3 w-3" /> {/* Ajuste de tamanho do ícone */}
            </Button>
          </Badge>
        ))}
        <input
          className="min-w-[60px] flex-1 bg-transparent py-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddPendingDataPoint} // Adiciona tag pendente ao perder o foco
          disabled={disabled}
          {...props} // Repassa outras props como placeholder, type, etc.
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
