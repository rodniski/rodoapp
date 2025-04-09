// eslint.config.js (ou nome similar)
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
// Pode ser necessário importar explicitamente se não vier dos extends
// import typescriptParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Suas configurações existentes carregadas com FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ---> Adicione este objeto para desabilitar a regra <---
  {
    files: ["**/*.ts", "**/*.tsx"], // Aplica somente a arquivos TypeScript
    // NOTA: Verifique se languageOptions (parser, etc.) são herdados corretamente dos 'extends'.
    // Se não forem, você pode precisar especificá-los aqui também:
    // languageOptions: {
    //   parser: typescriptParser,
    //   parserOptions: { project: true, tsconfigRootDir: __dirname }
    // },
    rules: {
      // Adicione outras regras globais customizadas aqui se precisar
      "@typescript-eslint/no-explicit-any": "off" // Desliga a regra!
    }
  },
  // ---> Fim do objeto adicionado <---

  // Outras configurações flat podem vir aqui
];

export default eslintConfig;