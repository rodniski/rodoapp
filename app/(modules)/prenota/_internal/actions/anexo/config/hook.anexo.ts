"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  UseAnexoDownloadProps,
  UseAnexoDownloadReturn,
} from "@/app/(modules)/prenota/_internal/actions";
import { fetchAnexos } from "@/app/(modules)/prenota/_internal/actions";
import { defaultQueryOptions } from "@/app/(modules)/prenota/_internal/config";

/** URL base para downloads dos anexos */
const ANEXO_DOWNLOAD_URL = "http://172.16.99.187:3001/uploads/";

/**
 * Hook para gerenciar o estado e download de anexos usando React Query.
 */
export const useAnexoDownload = ({
  AnexoPath,
}: UseAnexoDownloadProps): UseAnexoDownloadReturn => {
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ["anexos", AnexoPath],
    queryFn: () => fetchAnexos(AnexoPath),
    enabled: !!AnexoPath?.trim(),
    ...defaultQueryOptions,
  });

  /**
   * Inicia o download do anexo em nova aba.
   */
  const handleDownload = (path: string) => {
    window.open(`${ANEXO_DOWNLOAD_URL}${path}`, "_blank");
  };

  return { attachments, isLoading, handleDownload };
};
