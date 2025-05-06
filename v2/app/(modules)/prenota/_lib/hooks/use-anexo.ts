import { useState, useEffect } from "react";
import { config } from "config";

interface Attachment {
  Z07_FILIAL: string;
  Z07_CHAVE: string;
  Z07_DESC: string;
  Z07_PATH: string;
}

interface UseAnexoDownloadProps {
  AnexoPath: string;
}

interface UseAnexoDownloadReturn {
  attachments: Attachment[];
  isLoading: boolean;
  handleDownload: (path: string) => void;
}

export const useAnexoDownload = ({
  AnexoPath,
}: UseAnexoDownloadProps): UseAnexoDownloadReturn => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const url = config.API_PRODUCTION_URL;
  useEffect(() => {
    if (AnexoPath?.trim() !== "") {
      setIsLoading(true);
      fetch(`${url}reidoapsdu/consultar/pegarq/`, {
        method: "GET",
        headers: {
          documento: AnexoPath,
        },
      })
        .then((res) => res.json())
        .then((data: Attachment[]) => {
          setAttachments(data);
        })
        .catch((err) => {
          console.error("Erro ao buscar anexos", err);
          setAttachments([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setAttachments([]);
      setIsLoading(false);
    }
  }, [AnexoPath]);

  const handleDownload = (path: string) => {
    window.open(`http://172.16.99.187:3001/uploads/${path}`, "_blank");
  };

  return {
    attachments,
    isLoading,
    handleDownload,
  };
};
