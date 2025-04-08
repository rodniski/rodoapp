# Aliases Configurados no Projeto

Os aliases foram configurados para simplificar os imports no projeto.

## Exemplo de Configuração
Veja abaixo como os aliases foram configurados no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "!/*": ["./features/assinatura/*"],
      "!": ["./features/assinatura"],
      "@/*": ["./features/portaria/*"],
      "@": ["./features/portaria"],
      "#/*": ["./features/prenota/*"],
      "#": ["./features/prenota"],
      "$/*": ["./features/shared/*"],
      "$": ["./features/shared"],
      "components/*": ["./features/shared/components/*"],
      "components": ["./features/shared/components"],
      "constants/*": ["./features/shared/constants/*"],
      "constants": ["./features/shared/constants"],
      "hooks/*": ["./features/shared/hooks/*"],
      "hooks": ["./features/shared/hooks"],
      "lib/*": ["./features/shared/lib/*"],
      "lib": ["./features/shared/lib"],
      "types/*": ["./features/shared/types/*"],
      "types": ["./features/shared/types"],
      "utils/*": ["./features/shared/utils/*"],
      "utils": ["./features/shared/utils"]
    }
  }
}
