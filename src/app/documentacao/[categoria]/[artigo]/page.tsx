// app/documentacao/[categoria]/[artigo]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { logger } from "utils"; // Nosso logger global

//? Plugins MDX para funcionalidades extras (certifique-se de que estão instalados)
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

//? Componentes e Tipos Específicos da Documentação (usando seus aliases)
import { GenericDocumentationPage } from "@documentacao/ui";
import type { ArticleFrontmatter } from "@documentacao/logic";
// `getAllDocumentationPaths` não é mais importado aqui, pois `generateStaticParams` buscará da API.

import type { MDXRemoteSerializeResult } from "next-mdx-remote";

//* --- Tipagem das Props da Página Dinâmica ---
interface DynamicArticlePageProps {
  params: {
    categoria: string;
    artigo: string;
  };
}

//* --- Tipagem para os Dados Serializados do Artigo (retorno da API e da função helper) ---
interface SerializedArticleData {
  frontmatter: ArticleFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
  scopeData?: Record<string, unknown>; // Para dados como tableData, passados ao escopo do MDX
}

//* --- Função Helper para Buscar e Serializar o Artigo via API Interna ---
/**
 * @async
 * @function fetchAndSerializeArticleFromApi
 * @description Busca o conteúdo de um artigo da API interna (/api/doc-content) e serializa o MDX.
 * @param {string} categoria - Slug da categoria.
 * @param {string} artigo - Slug do artigo.
 * @returns {Promise<SerializedArticleData | null>} Objeto com frontmatter e MDX serializado, ou null se não encontrado/erro.
 */
async function fetchAndSerializeArticleFromApi(
  categoria: string,
  artigo: string
): Promise<SerializedArticleData | null> {
  const normalizedCategoria = categoria.toLowerCase();
  const normalizedArtigo = artigo.toLowerCase();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/doc-content/${normalizedCategoria}/${normalizedArtigo}`;

  //! Estratégia de Cache:
  //  - Em produção/build (SSG/ISR): 'force-cache' (ou o default do Next.js) é geralmente bom para performance.
  //  - Em desenvolvimento: 'no-store' é crucial para ver atualizações de conteúdo MDX imediatamente.
  const cacheOption =
    process.env.NODE_ENV === "development" ? "no-store" : "force-cache";

  try {
    logger.debug(
      `[Page Fetch] Buscando artigo da API: ${apiUrl} com cache: ${cacheOption}`
    );
    const response = await fetch(apiUrl, { cache: cacheOption });

    if (!response.ok) {
      if (response.status === 404) {
        logger.warn(
          `[Page Fetch] Artigo não encontrado pela API: ${apiUrl} (Status: 404)`
        );
        return null;
      }
      const errorText = await response.text();
      logger.error(`[Page Fetch] Falha ao buscar artigo da API: ${apiUrl}`, {
        status: response.status,
        statusText: response.statusText,
        responseText: errorText,
      });
      return null; // Levará a notFound() na página
    }

    const data = await response.json(); // Espera-se { frontmatter, content, scopeData? }

    if (!data || !data.content || !data.frontmatter) {
      logger.error(
        `[Page Fetch] Dados inválidos ou conteúdo/frontmatter ausente da API: ${apiUrl}`,
        { responseData: data }
      );
      return null;
    }

    const mdxSource = await serialize(data.content, {
      parseFrontmatter: false, // O frontmatter já foi parseado pela API
      scope: data.scopeData || {}, // Passa dados extras para o escopo do MDX
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }], // Adiciona links âncora envolvendo os cabeçalhos
        ],
      },
    });

    return {
      frontmatter: data.frontmatter,
      mdxSource,
      scopeData: data.scopeData,
    };
  } catch (error: any) {
    logger.error(`[Page Fetch] Exceção ao buscar ou serializar ${apiUrl}`, {
      errorMessage: error.message,
      // O logger já deve capturar o stack automaticamente se um Error object for passado
    });
    return null;
  }
}

//* --- Geração de Metadados Dinâmicos (SEO, Título da Aba) ---
export async function generateMetadata(
  { params }: DynamicArticlePageProps,
  parent: ResolvingMetadata // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<Metadata> {
  const { categoria, artigo } = params;
  // Para metadados, também buscamos da API. O cache 'force-cache' é apropriado aqui
  // pois generateMetadata roda no servidor (build-time para SSG, request-time para dinâmico).
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/doc-content/${categoria.toLowerCase()}/${artigo.toLowerCase()}`;

  try {
    const response = await fetch(apiUrl, { cache: "force-cache" });
    if (!response.ok) {
      logger.warn(
        `[Page Metadata] Artigo não encontrado para metadados (API): ${apiUrl}`,
        { status: response.status }
      );
      return { title: "Documento Não Encontrado - RodoApp" };
    }
    const data = await response.json();

    if (!data || !data.frontmatter) {
      logger.warn(
        `[Page Metadata] Frontmatter não encontrado para metadados (API): ${apiUrl}`
      );
      return { title: "Documento Inválido - RodoApp" };
    }

    const frontmatter = data.frontmatter as ArticleFrontmatter;
    return {
      title: `${frontmatter.title} - Documentação RodoApp`,
      description:
        frontmatter.description ||
        `Documentação sobre ${frontmatter.title} no sistema RodoApp.`,
    };
  } catch (error: any) {
    logger.warn(
      `[Page Metadata] Erro ao gerar metadados para ${categoria}/${artigo} (API)`,
      {
        errorMessage: error.message,
      }
    );
    return { title: "Erro na Documentação - RodoApp" };
  }
}

//* --- Componente da Página Principal (Async Server Component) ---
export default async function ArticlePage({ params }: DynamicArticlePageProps) {
  const serializedArticle = await fetchAndSerializeArticleFromApi(
    params.categoria,
    params.artigo
  );

  if (!serializedArticle) {
    notFound(); // Dispara a renderização da página 404 padrão do Next.js
  }

  //? O layout principal (sidebar, padding geral da área de conteúdo) deve vir de
  //? app/documentacao/layout.tsx. GenericDocumentationPage foca no conteúdo do artigo.
  return (
    <GenericDocumentationPage
      frontmatter={serializedArticle.frontmatter}
      mdxSource={serializedArticle.mdxSource}
      // Se scopeData fosse usado pelo GenericDocumentationPage diretamente:
      // scopeData={serializedArticle.scopeData}
    />
  );
}

//* --- Geração de Páginas Estáticas (SSG) no Momento do Build ---
export async function generateStaticParams() {
  // Busca a lista de todos os caminhos de documentação da API /api/doc-paths
  // Esta API Route usará fs para listar os arquivos, mantendo fs isolado.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const pathsApiUrl = `${baseUrl}/api/doc-paths`;

  try {
    logger.info(
      `[SSG Params] Buscando caminhos de documentação de: ${pathsApiUrl}`
    );
    const response = await fetch(pathsApiUrl, { cache: "force-cache" }); // Cache é bom para build

    if (!response.ok) {
      // Corrigido o typo aqui
      throw new Error(
        `Falha ao buscar caminhos para SSG de ${pathsApiUrl}: ${response.status} ${response.statusText}`
      );
    }
    const pathsData = (await response.json()) as Array<{
      categoria: string;
      artigo: string;
    }>;

    if (!Array.isArray(pathsData)) {
      throw new Error(
        `[SSG Params] Resposta de ${pathsApiUrl} não é um array.`
      );
    }

    logger.info(
      `[SSG Params] ${pathsData.length} caminhos recebidos para geração estática.`
    );
    return pathsData.map((p) => ({
      categoria: p.categoria,
      artigo: p.artigo,
    }));
  } catch (error: any) {
    logger.error(
      "Falha crítica ao executar generateStaticParams buscando de /api/doc-paths.",
      { errorMessage: error.message }
    );
    return []; // Retorna vazio para não quebrar o build, mas indica um problema sério.
  }
}

//? Para Revalidação Estática Incremental (ISR) ou renderização dinâmica total:
// export const revalidate = 3600; // Revalida a página a cada 1 hora (ISR)
// ou para desabilitar SSG e forçar renderização dinâmica em cada request:
// export const dynamic = 'force-dynamic';
