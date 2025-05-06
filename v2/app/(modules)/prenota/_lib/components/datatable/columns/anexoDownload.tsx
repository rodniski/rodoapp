"use client";

import React from "react";
import {Button, HoverCard, HoverCardContent, HoverCardTrigger,} from "ui";
import {Download, FileCheck2, FileX2} from "lucide-react";

type AnexoDownloadProps = {
    AnexoPath: string;
};

type Attachment = {
    Z07_FILIAL: string;
    Z07_CHAVE: string;
    Z07_DESC: string;
    Z07_PATH: string;
};

const AnexoDownload: React.FC<AnexoDownloadProps> = ({AnexoPath}) => {
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);
    const [, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (AnexoPath?.trim() !== "") {
            setIsLoading(true);
            fetch("http://172.16.99.174:8400/rest/reidoapsdu/consultar/pegarq/", {
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
                })
                .finally(() => setIsLoading(false));
        }
    }, [AnexoPath]);

    const handleDownload = (path: string) => {
        window.open(`http://172.16.99.187:3001/uploads/${path}`, "_blank");
    };

    const hasAttachments = attachments.length > 0;

    return (
        <HoverCard>
            <HoverCardTrigger className="cursor-pointer w-full h-full flex items-center justify-center">
                {hasAttachments ? (
                    <FileCheck2 className="text-lime-400" size={24}/>
                ) : (
                    <FileX2 className="text-red-400" size={24}/>
                )}
            </HoverCardTrigger>
            {hasAttachments && (
                <HoverCardContent>
                    <div className="space-y-2">
                        {attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleDownload(attachment.Z07_PATH)}
                                    className="flex justify-between items-center text-sm w-full"
                                >
                                    {attachment.Z07_DESC}
                                    <Download className="mr-1" size={16}/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </HoverCardContent>
            )}
        </HoverCard>
    );
};

export default AnexoDownload;
