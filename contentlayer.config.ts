// Exemplo conceitual de contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const DocPage = defineDocumentType(() => ({
  name: "DocPage",
  filePathPattern: `documentacao/**/*.mdx`, // Padrão para encontrar seus arquivos
  contentType: "mdx",
  fields: {
    // Define os campos do seu frontmatter
    title: { type: "string", required: true },
    group: { type: "string", required: true },
    date: { type: "date" },
    description: { type: "string" },
    // headerButton, footerButton seriam objetos, ou você pode achatá-los
  },
  computedFields: {
    // Campos computados, como a URL ou slugs
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^documentacao\//, ""),
    },
    category: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
    },
    articleSlug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/")[2],
    },
    url: {
      type: "string",
      resolve: (doc) =>
        `/documentacao/${doc._raw.flattenedPath.replace(
          /^documentacao\//,
          ""
        )}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "app/documentacao/_internal/archive", // Sua pasta de conteúdo
  documentTypes: [DocPage],
  // Opções MDX (plugins remark/rehype) podem ser configuradas aqui também
});
