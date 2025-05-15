// app/api/doc-content/[categoria]/[artigo]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logger } from "utils"; // Seu logger
import type { ArticleFrontmatter } from "@documentacao/logic"; // Ajuste o path para seus tipos

// ! IMPORTANTE: Atualize este caminho para onde seus arquivos .mdx estão!
const DOCS_CONTENT_PATH = path.join(
  process.cwd(),
  "app/documentacao/_internal/archive"
);

interface ApiArticleData {
  frontmatter: ArticleFrontmatter;
  content: string; // Conteúdo MDX bruto
  slug: string;
  category: string;
  // scopeData?: Record<string, unknown>; // Se precisar passar dados para o escopo do MDX
}

export async function GET(
  _request: Request,
  { params }: { params: { categoria: string; artigo: string } }
) {
  const { categoria, artigo } = params;
  const normalizedCategory = categoria.toLowerCase();
  const normalizedArticleSlug = artigo.toLowerCase();

  // Constrói os caminhos possíveis para o arquivo, priorizando .mdx
  const mdxFilePath = path.join(
    DOCS_CONTENT_PATH,
    normalizedCategory,
    `${normalizedArticleSlug}.mdx`
  );
  const mdFilePath = path.join(
    DOCS_CONTENT_PATH,
    normalizedCategory,
    `${normalizedArticleSlug}.md`
  );

  let filePathToUse: string | undefined;

  if (fs.existsSync(mdxFilePath)) {
    filePathToUse = mdxFilePath;
  } else if (fs.existsSync(mdFilePath)) {
    filePathToUse = mdFilePath;
  }

  if (!filePathToUse) {
    logger.warn(
      `[API DocContent] Artigo não encontrado: ${normalizedCategory}/${normalizedArticleSlug}`
    );
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  try {
    const fileContents = fs.readFileSync(filePathToUse, "utf8");
    const { data, content } = matter(fileContents); // `data` é o frontmatter

    if (!data.title || !data.group) {
      logger.error(
        `[API DocContent] Frontmatter inválido para ${filePathToUse}: 'title' ou 'group' ausente.`,
        { frontmatter: data }
      );
      return NextResponse.json(
        { error: "Invalid article frontmatter" },
        { status: 500 }
      );
    }

    const finalFrontmatter: ArticleFrontmatter = {
      group:
        data.group ||
        normalizedCategory.charAt(0).toUpperCase() +
          normalizedCategory.slice(1),
      date: data.date || "",
      description: data.description || "",
      ...data,
      title: data.title,
    };

    // Se você precisar passar dados específicos para o escopo do MDX (como tableData)
    // você pode carregar esses dados aqui e incluí-los na resposta.
    // Exemplo:
    // let scopeData = {};
    // if (normalizedCategory === 'powerbi' && normalizedArticleSlug === 'relatorios') {
    //   // const { relatoriosTableData } = await import('@/app/documentacao/_internal/archive/powerbi/relatorios.data');
    //   // scopeData = { tableData: relatoriosTableData };
    // }

    const responsePayload: ApiArticleData = {
      frontmatter: finalFrontmatter,
      content,
      slug: normalizedArticleSlug,
      category: normalizedCategory,
      // scopeData, // Descomente se estiver usando scopeData
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    logger.error(
      `[API DocContent] Erro ao carregar ou parsear o artigo: ${filePathToUse}`,
      {
        errorMessage: error.message,
      }
    );
    return NextResponse.json(
      { error: "Failed to load or parse article" },
      { status: 500 }
    );
  }
}
