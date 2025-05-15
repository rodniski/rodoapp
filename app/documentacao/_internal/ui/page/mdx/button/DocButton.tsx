// _core/components/mdx/DocButton/DocButton.tsx
"use client";

import React from "react";
import { Button as UiButton } from "ui"; // Importa seu Button global como UiButton para evitar conflito de nome
import { logger } from "utils";
import type { DocButtonProps } from "./DocButton.config";
import { defaultDocButtonProps } from "./DocButton.config";
import { toast } from "sonner";

//* Mapeamento de identificadores para funções onClick.
//  Mantenha ou mova para um local compartilhado se necessário.
const clientActionMap: Record<string, (props?: Record<string, any>) => void> = {
  openHeskTicket: () =>
    window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank"),
  openHeskTicketForPowerBi: () =>
    window.open(
      "http://hesk.rodoparana.com.br/index.php?a=add&category=2_Power_BI",
      "_blank"
    ),
  openHeskTicketForProtheus: () =>
    window.open(
      "http://hesk.rodoparana.com.br/index.php?a=add&category=1_Protheus",
      "_blank"
    ),
  openPowerBiAppMain: () =>
    window.open(
      "https://app.powerbi.com/Redirect?action=OpenApp&appId=SEU_APP_ID&ctid=SEU_TENANT_ID",
      "_blank"
    ),
  // Adicione outros identificadores aqui
};

/**
 * @component DocButtonComponent
 * @description Lógica interna e renderização do DocButton.
 * Este componente é um wrapper em torno do Button global de `ui`,
 * adicionando lógica para `onClickIdentifier` e `href` para uso em MDX.
 * @param {DocButtonProps} props - As propriedades do componente.
 */
const DocButtonComponent = (props: DocButtonProps) => {
  const {
    children,
    onClickIdentifier,
    href,
    variant,
    size,
    className,
    asChild,
    ...rest // Outras props para o UiButton (ex: type, disabled)
  } = { ...defaultDocButtonProps, ...props };

  const handleClick = () => {
    if (onClickIdentifier && clientActionMap[onClickIdentifier]) {
      clientActionMap[onClickIdentifier](rest); // Passa o restante das props para a ação, se necessário
    } else if (href) {
      // Se há href e não há onClickIdentifier específico, abre o link.
      // O UiButton com asChild={true} e um <Link> filho seria outra forma de lidar com links internos.
      window.open(href, "_blank");
    } else if (onClickIdentifier) {
      logger.warn(
        `Ação de botão não definida para o identificador: ${onClickIdentifier}`,
        {
          propsReceived: rest,
        }
      );
      toast.info(`Ação '${onClickIdentifier}' não implementada (MDX).`);
    }
  };

  // Se 'asChild' for true e houver um 'href', o ideal seria que o children fosse um <Link>.
  // O componente Button de `ui` com `asChild` passará as props para seu filho direto.
  // Se `href` estiver presente e `onClickIdentifier` não, e `asChild` não for usado para um Link,
  // o `onClick` no `UiButton` fará o trabalho de abrir o link.

  return (
    <UiButton
      variant={variant}
      size={size}
      className={className}
      onClick={onClickIdentifier || href ? handleClick : undefined} // O onClick do UiButton executa nossa lógica
      asChild={asChild}
      // Espalha quaisquer outras props que o UiButton aceite (como `type`, `disabled`, etc.)
      // Se o `UiButton` não aceitar `onClickIdentifier` ou `href` diretamente,
      // não os passamos no `...rest`. O `handleClick` já os utiliza.
      {...rest}
    >
      {children}
    </UiButton>
  );
};

export const DocButton = React.memo(DocButtonComponent);
DocButton.displayName = "DocButton";
