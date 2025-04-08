import Link from "next/link"
import { Linkedin, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <h2 className="font-bold">Grupo Rodoparaná</h2>
          <p className="text-sm text-muted-foreground">
            Hub de intranet para acesso centralizado às ferramentas internas.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Módulos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/central/prenota" className="text-muted-foreground transition-colors hover:text-primary">
                  Prenotas
                </Link>
              </li>
              <li>
                <Link href="/central/portaria" className="text-muted-foreground transition-colors hover:text-primary">
                  Controle de Saídas
                </Link>
              </li>
              <li>
                <Link href="/central/documentacao" className="text-muted-foreground transition-colors hover:text-primary">
                  Documentação
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Links Externos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="http://hesk.rodoparana.com.br/signaturegen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary flex items-center">
                  Assinatura <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="http://hesk.rodoparana.com.br" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary flex items-center">
                  Suporte <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="https://intranet.rodoparana.com.br/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary flex items-center">
                  Intranet <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sites</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="https://rodoparana.com.br" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary flex items-center">
                  Rodoparaná <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="https://grupotimber.com.br" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary flex items-center">
                  Grupo Timber <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} RODOPARANA IMPLEMENTOS RODOVIARIOS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
