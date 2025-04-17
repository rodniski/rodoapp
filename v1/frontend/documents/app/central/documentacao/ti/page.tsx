"use client";
import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import { Card } from "$/components/aceternity/card";
import React from "react";
import Link from "next/link";


const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "TI" },
    ]);
  }, [setBreadcrumbs]);

  const cardData = [
    {
      imageSrc: "/documentacao/ti/backgrounds/reuniao.jpg",
      title: "Agendamento de Reunião",
      description: "Tutorial sobre agendamento de salas de reunião na matriz via Gmail ou Google Agenda",
      link: "/central/documentacao/ti/agendamentoreuniao" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/virus.jpg",
      title: "Anti Ameaças",
      description: "Página com dicas de segurança digital e prevenção contra ameaças como phishing, keyloggers, adwares, trojans, ransomware e outros tipos de malwares",
      link: "/central/documentacao/ti/antiameacas" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/assinatura-email.jpg",
      title: "Assinatura de Email",
      description: "Tutorial sobre como configurar a assinatura de e-mail no Gmail e Outlook",
      link: "/central/documentacao/ti/assinaturaemail" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/email-automatico.jpg",
      title: "Email Automatico",
      description: "Tutorial sobre como configurar a resposta automática no Gmail.",
      link: "/central/documentacao/ti/emailautomatico" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/email-ilimitado.jpg",
      title: "Email Limitado",
      description: "Página com tutorial sobre como resolver problemas de sincronização no Outlook, ajustando o limite da caixa de e-mails.",
      link: "/central/documentacao/ti/emaillimitado" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/gmail-celular.jpg",
      title: "Gmail no Celular",
      description: "Tutorial sobre como configurar o Gmail no celular.",
      link: "/central/documentacao/ti/gmailcelular" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/gmail-dicas.jpg",
      title: "Gmail Dicas",
      description: "Página com dicas práticas para o Gmail, incluindo como desativar o agrupamento de mensagens, organizar e-mails e mais.",
      link: "/central/documentacao/ti/gmaildicas" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/videoconferencia.jpg",
      title: "Google Met",
      description: "Página com tutorial sobre o uso do Google Meet para videoconferências.",
      link: "/central/documentacao/ti/googlemet" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/powerbi.jpg",
      title: "Power BI",
      description: "Página com tutorial sobre o uso do Power BI. Explica como acessar a ferramenta via navegador, utilizar filtros e mais.",
      link: "/central/documentacao/ti/powerbi" 
    },
    {
      imageSrc: "/documentacao/ti/backgrounds/proxy.jpg",
      title: "Proxy",
      description: "Página com instruções para configurar o proxy nas redes internas da empresa. Ensina a validar e ajustar as configurações no sistema e mais.",
      link: "/central/documentacao/ti/proxy" 
    },

  ];

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center gap-4">
      {cardData.map((card, index) => (
        <Link href={card.link} key={index}>
          <Card
            imageSrc={card.imageSrc}
            title={card.title}
            description={card.description}
          />
        </Link>
      ))}
    </div>
  );
};

export default Page;
