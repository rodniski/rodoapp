"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// Importa os DADOS estaticamente - Se for muito grande, considere buscar de API
import { dashboardData } from "./_lib/data/menu-items";
import { useSession } from "next-auth/react";
// Importa dynamic do Next.js para carregamento dinâmico
import dynamic from "next/dynamic";
import { Background } from "comp";

// --- Otimização: Carregamento Dinâmico do Carrossel ---
// O componente Carousel só terá seu código JavaScript baixado e executado
// quando ele for realmente necessário na tela, não no carregamento inicial.
const Carousel = dynamic(
  // Função que retorna a importação do componente
  () => import("./_lib/components").then((mod) => mod.Carousel),
  {
    // Opcional: O que mostrar enquanto o JS do Carrossel está carregando
    loading: () => (
      <div className="h-48 flex items-center justify-center rounded-lg bg-muted/50">
        {" "}
        {/* Exemplo de Skeleton/Loader */}
        <p className="text-muted-foreground">Carregando conteúdo...</p>
      </div>
    ),
    // ssr: false -> O Carrossel não será pré-renderizado no servidor.
    // É comum para componentes interativos que dependem do cliente.
    // Se você precisar que ele apareça no HTML inicial (para SEO, por exemplo), remova esta linha.
    ssr: false,
  }
);
// --- Fim da Otimização ---

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  // Efeito para verificar autenticação e redirecionar
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Exibe estado de carregamento enquanto a sessão é verificada
  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-lg animate-pulse text-muted-foreground">
          Carregando sessão...
        </p>{" "}
        {/* Estilo de loading */}
      </div>
    );
  }

  // Se após carregar, não está autenticado, retorna null (redirect já deve ter ocorrido)
  if (!isAuthenticated) {
    return null;
  }

  // Renderiza o dashboard para usuários autenticados
  return (
    <main className="w-full h-[calc(100vh-65px)] flex justify-center flex-col overflow-y-auto lg:px-5 fhd:px-20">
      <Background />
      <div className="z-10 space-y-8">
        {dashboardData.map((category) => (
          <section
            key={category.id}
            aria-labelledby={`category-title-${category.id}`}
          >
            <Carousel cards={category.cards} category={category.title} />
          </section>
        ))}
      </div>
    </main>
  );
}
