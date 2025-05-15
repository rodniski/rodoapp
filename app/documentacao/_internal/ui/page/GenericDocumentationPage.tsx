// app/documentacao/_internal/components/GenericDocumentationPage/GenericDocumentationPage.tsx
"use client";

import React from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { ScrollArea, Button as UiButton } from "ui"; // Seu componente Button de UI global
import { logger } from "utils";
import type {
  ArticleFrontmatter,
  ActionButtonConfig,
} from "@documentacao/logic"; // Seus tipos

// Importa o mapa de componentes MDX que acabamos de criar
import { mdxComponents } from "./mdx";

// Mapeamento de identificadores para funções onClick (para botões do frontmatter)
const clientActionMap: Record<string, () => void> = {
  openHeskTicket: () =>
    window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank"),
  openHeskTicketPowerBiUtilizacao: () =>
    window.open(
      "http://hesk.rodoparana.com.br/index.php?a=add&category=2_Power_BI_Utilizacao",
      "_blank"
    ),
  openHeskTicketPowerBiReports: () =>
    window.open(
      "http://hesk.rodoparana.com.br/index.php?a=add&category=2_Power_BI_Reports",
      "_blank"
    ),
  openHeskTicketPowerBiExportacao: () =>
    window.open(
      "http://hesk.rodoparana.com.br/index.php?a=add&category=2_Power_BI_Exportacao",
      "_blank"
    ),
  openPowerBiAppMain: () =>
    window.open(
      "https://app.powerbi.com/Redirect?action=OpenApp&appId=SEU_APP_ID&ctid=SEU_TENANT_ID",
      "_blank"
    ), // Lembre-se de atualizar IDs
  // Adicione outros aqui
};

const handleActionClick = (actionConfig?: ActionButtonConfig) => {
  if (!actionConfig) return;
  if (actionConfig.href) {
    window.open(actionConfig.href, "_blank");
  } else if (
    actionConfig.onClickIdentifier &&
    clientActionMap[actionConfig.onClickIdentifier]
  ) {
    clientActionMap[actionConfig.onClickIdentifier]();
  } else if (actionConfig.onClickIdentifier) {
    logger.warn(
      "Ação de botão (frontmatter) não definida ou identificador não encontrado:",
      { id: actionConfig.onClickIdentifier }
    );
    // toast.info(`Ação '${actionConfig.onClickIdentifier}' não implementada.`);
  }
};

export interface GenericDocumentationPageDisplayProps {
  frontmatter: ArticleFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
}

const GenericDocumentationPageComponent: React.FC<
  GenericDocumentationPageDisplayProps
> = ({ frontmatter, mdxSource }) => {
  const { title, group, date, description, headerButton, footerButton } =
    frontmatter;

  return (
    <ScrollArea className="h-full w-full" type="auto">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bloco de Cabeçalho Padrão (renderizado com base no frontmatter) */}
        <header className="mb-8">
          {title && (
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </h1>
          )}
          {(group || date) && (
            <p className="mt-2 text-sm text-muted-foreground">
              {group}
              {group && date && " • "}
              {date}
            </p>
          )}
          {description && (
            <p className="mt-3 text-lg text-muted-foreground">{description}</p>
          )}
          {headerButton && (
            <div className="mt-6">
              <UiButton
                variant={headerButton.variant || "outline"}
                className={headerButton.className}
                onClick={() => handleActionClick(headerButton)}
              >
                {headerButton.text}
              </UiButton>
            </div>
          )}
        </header>

        {/* Conteúdo MDX renderizado com os componentes de estilização e customizados */}
        <main className="max-w-none">
          {" "}
          {/* Sem classes 'prose' aqui, pois os estilos vêm dos mdxComponents */}
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </main>

        {footerButton && (
          <footer
            className="mt-12 pt-8 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <UiButton
              variant={footerButton.variant || "outline"}
              className={footerButton.className}
              onClick={() => handleActionClick(footerButton)}
            >
              {footerButton.text}
            </UiButton>
          </footer>
        )}
      </div>
    </ScrollArea>
  );
};

export const GenericDocumentationPage = React.memo(
  GenericDocumentationPageComponent
);
GenericDocumentationPage.displayName = "GenericDocumentationPage";
