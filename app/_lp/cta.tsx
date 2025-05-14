import { Button } from "ui"
import { ExternalLink } from "lucide-react"

export function CTA() {
  return (
    <section>
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Precisa de suporte técnico?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Acesse o HESK, nossa plataforma de abertura de chamados, para solicitar suporte técnico, reportar problemas ou solicitar melhorias em qualquer um dos módulos do hub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button size="lg" asChild>
            <a href="http://hesk.rodoparana.com.br" target="_blank" rel="noopener noreferrer">
              Acessar HESK <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg">
            Acessar o Sistema
          </Button>
        </div>
      </div>
    </section>
  )
}
