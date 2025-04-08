import { FileText, ClipboardList, BookOpen } from "lucide-react"

const features = [
  {
    name: "Prenotas",
    description: "Cadastro de pré-documentos de entrada do Protheus com funcionalidades avançadas para agilizar seu processo.",
    icon: FileText,
  },
  {
    name: "Controle de Saídas",
    description: "Gerenciamento eficiente da saída de pneus, com controle completo do processo de venda.",
    icon: ClipboardList,
  },
  {
    name: "Documentação",
    description: "Acesso centralizado a todos os processos e documentações da empresa, facilitando a consulta e o aprendizado.",
    icon: BookOpen,
  },
]

export function Features() {
  return (
    <section className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Módulos Integrados</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Conheça os módulos disponíveis no hub de intranet do Grupo Rodoparaná.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
