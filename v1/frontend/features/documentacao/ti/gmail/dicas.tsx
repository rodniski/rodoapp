// features/documentacao/ti/gmail/Dicas.tsx
import React from "react";
import { ScrollArea, Button } from "ui";
import { PageHeader, PageSection } from "../../components";

const Dicas = () => {
  return (
      <ScrollArea className="h-full w-full flex flex-col items-center justify-center overflow-auto">
        <div className="max-w-4xl h-full w-full overflow-auto">
          <PageHeader
              title="Gmail Dicas"
              date="18 de Outubro de 2024"
              description="Dicas práticas para resolver problemas no Outlook e acabar com dores de cabeça desnecessárias."
          />

          <PageSection
              id="layout"
              title="Layout"
              content="Se o layout do Gmail está te confundindo, desative o agrupamento de mensagens.
          Clique na engrenagem no canto superior direito, vá em 'Visualização de conversas' e desative a opção."
          />
          <video
              src="/documentacao/ti/layout-conversa-gmail.mp4"
              className="w-full max-w-[700px] h-auto"
              loop
              autoPlay
              muted
          />

          <PageSection
              id="organizacao"
              title="Organização"
              content="Quer criar regras para que determinados e-mails sejam direcionados automaticamente para pastas específicas (marcadores)? Confira o vídeo abaixo para o passo a passo!"
          />
          <video
              src="/documentacao/ti/marcadores.mp4"
              className="w-[700px] h-auto"
              controls
              muted
          />

          <PageSection
              id="atalhos-teclado"
              title="Atalhos de Teclado"
              content="Os atalhos de teclado são uma excelente ferramenta para tornar o uso do seu e-mail mais rápido e eficiente. Para ativá-los, siga os passos abaixo:"
          />
          <video
              src="/documentacao/ti/atalhos-teclado.mp4"
              className="w-full max-w-[700px] h-auto"
              muted
              controls
          />

          <PageSection
              id="outros-problemas"
              title="Outros Problemas"
              content="Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
          />

          <Button
              variant={"outline"}
              className="mb-10"
              onClick={() =>
                  window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank")
              }
          >
            Abrir Chamado
          </Button>
        </div>
      </ScrollArea>
  );
};

export default Dicas;