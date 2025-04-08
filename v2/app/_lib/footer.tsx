import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <h2 className="font-bold">Grupo Rodoparaná</h2>
          <p className="text-sm text-muted-foreground">Hub de intranet para acesso centralizado às ferramentas internas.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Módulos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/prenotas" className="text-muted-foreground transition-colors hover:text-primary">
                  Prenotas
                </Link>
              </li>
              <li>
                <Link href="/controle" className="text-muted-foreground transition-colors hover:text-primary">
                  Controle de Saídas
                </Link>
              </li>
              <li>
                <Link href="/documentacao" className="text-muted-foreground transition-colors hover:text-primary">
                  Documentação
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Empresa</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/sobre" className="text-muted-foreground transition-colors hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground transition-colors hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Conectar</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/rodoparana"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/rodoparana"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Grupo Rodoparaná. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
