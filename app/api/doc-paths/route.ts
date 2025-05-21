// app/api/doc-paths/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { logger } from "utils";

// ! IMPORTANTE: Atualize este caminho para onde seus arquivos .mdx estão!
const DOCS_CONTENT_PATH = path.join(
  process.cwd(),
  "app/documentacao/_internal/archive"
);

export async function GET() {
  const paths: Array<{ categoria: string; artigo: string }> = [];
  logger.debug(
    `[API DocPaths] Iniciando varredura de caminhos em: ${DOCS_CONTENT_PATH}`
  );

  try {
    const categories = fs
      .readdirSync(DOCS_CONTENT_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(DOCS_CONTENT_PATH, category);
      let articlesInDir: fs.Dirent[] = [];
      try {
        articlesInDir = fs.readdirSync(categoryPath, { withFileTypes: true });
      } catch (dirError: any) {
        logger.warn(
          `[API DocPaths] Não foi possível ler a pasta da categoria: ${categoryPath}`,
          { message: dirError.message }
        );
        continue;
      }

      for (const articleFile of articlesInDir) {
        if (
          articleFile.isFile() &&
          (articleFile.name.endsWith(".mdx") ||
            articleFile.name.endsWith(".md"))
        ) {
          const articleSlug = articleFile.name.replace(/\.mdx?$/, "");
          paths.push({
            categoria: category.toLowerCase(),
            artigo: articleSlug.toLowerCase(),
          });
        }
      }
    }
    logger.info(
      `[API DocPaths] ${paths.length} caminhos de documentação encontrados.`
    );
    return NextResponse.json(paths);
  } catch (error: any) {
    logger.error(
      "[API DocPaths] Falha crítica ao listar os caminhos da documentação.",
      {
        errorMessage: error.message,
        pathAttempted: DOCS_CONTENT_PATH,
      }
    );
    return NextResponse.json(
      { error: "Failed to list documentation paths" },
      { status: 500 }
    );
  }
}
