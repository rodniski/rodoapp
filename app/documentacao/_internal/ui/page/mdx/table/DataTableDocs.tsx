// app/documentacao/_internal/components/DataTableDocs/DataTableDocs.tsx
"use client"; // Se precisar de alguma interatividade no futuro, mas pode ser Server Component se for só display

import React, { memo } from "react";
import { cn } from "utils"; // Seu utilitário de classes
import type { DataTableDocsProps, TableDataRow } from "./DataTableDocs.config";

// Nomes de cabeçalho padrão baseados no seu exemplo original
const DEFAULT_HEADERS = ["Aplicativos", "Relatório", "Conteúdo"];
// Chaves correspondentes nos dados para os cabeçalhos padrão
const DEFAULT_DATA_KEYS: Array<keyof TableDataRow> = [
  "aplicativo",
  "relatorio",
  "conteudo",
];

/**
 * @component DataTableDocsComponent
 * @description Renderiza uma tabela simples e estilizada para exibir dados estruturados
 * dentro das páginas de documentação.
 *
 * @param {DataTableDocsProps} props - As propriedades do componente.
 */
const DataTableDocsComponent = ({
  data,
  headers,
  caption,
  className,
}: DataTableDocsProps) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "my-6 text-center text-muted-foreground italic",
          className
        )}
      >
        Nenhum dado disponível para exibir na tabela.
      </div>
    );
  }

  // Determina os cabeçalhos e as chaves para acessar os dados
  const tableHeaders = headers || DEFAULT_HEADERS;
  // Se os headers não forem fornecidos, e quisermos usar as chaves do objeto (mais dinâmico, mas menos controlado):
  // const dataKeys = headers ? DEFAULT_DATA_KEYS : Object.keys(data[0] || {}) as Array<keyof TableDataRow>;
  // Por agora, vamos manter as chaves fixas se os headers não forem passados, assumindo a estrutura do seu exemplo.
  const dataKeys = DEFAULT_DATA_KEYS;

  return (
    <div className={cn("my-6 w-full overflow-x-auto", className)}>
      <div className="border rounded-lg shadow-sm">
        {" "}
        {/* Contêiner com borda e sombra */}
        <table className="w-full min-w-[600px] text-sm caption-bottom">
          {" "}
          {/* min-w para scroll horizontal se necessário */}
          {caption && (
            <caption className="mt-4 p-2 text-center text-base font-semibold text-foreground">
              {caption}
            </caption>
          )}
          <thead className="bg-muted/50 [&_tr]:border-b">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={header || index} // Usa o header como chave, ou índice como fallback
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
              >
                {dataKeys.map((key, cellIndex) => (
                  <td
                    key={`${rowIndex}-${String(key)}-${cellIndex}`}
                    className="p-4 align-top [&:has([role=checkbox])]:pr-0" // Estilo similar ao Shadcn Table
                  >
                    {String(row[key])}{" "}
                    {/* Converte para string para garantir renderização */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DataTableDocs = memo(DataTableDocsComponent);
DataTableDocs.displayName = "DataTableDocs";
