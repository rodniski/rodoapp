// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Verifica se há dados de autenticação (no caso, usando cookies ou localStorage)
  const authData = request.cookies.get("auth")?.value;

  // Parseia os dados de autenticação (se existirem)
  let isAuthenticated = false;
  try {
    const parsedAuth = authData ? JSON.parse(authData) : null;
    isAuthenticated = parsedAuth?.isAuthenticated || false;
  } catch (err) {
    console.error("[Middleware] Falha ao parsear auth data:", err);
  }

  // Rotas que devem ser excluídas da verificação de autenticação
  const excludedPaths = ["/", "/login", "/documentacao"];
  const isExcludedRoute = excludedPaths.some((path) =>
    request.nextUrl.pathname === path
  );

  // Define as rotas protegidas (todas dentro de (modules), exceto as excluídas)
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/") && !isExcludedRoute;

  // Redireciona para a página de login se não estiver autenticado e a rota for protegida
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Continua para a próxima rota se autenticado ou se a rota está excluída
  return NextResponse.next();
}

// Configura quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    // Aplica o middleware a todas as rotas, exceto as excluídas
    "/((?!login|documentacao|_next|static|favicon.ico).*)",
  ],
};