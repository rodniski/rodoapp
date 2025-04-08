// features/documentacao/ti/gmail/Celular.tsx
import React from "react";
import { Button } from "ui";
import { PageHeader, PageSection } from "../../components";

const Celular = () => {
  return (
      <div className="h-full w-full flex flex-col items-center justify-center overflow-auto">
        <div className="max-w-4xl h-full w-full overflow-auto">
          <PageHeader
              title="Gmail no Celular"
              date="4 de Agosto de 2024"
              description="Antes de começar, tenha seu endereço de e-mail e senha do Gmail em mãos. Certifique-se de estar conectado à internet para configurar e sincronizar sua conta."
          />

          <PageSection
              id="iniciando-configuracao"
              title="Iniciando a Configuração"
              content="Ao abrir o Gmail, selecione a opção 'Adicionar um endereço de e-mail' para começar a configurar sua conta."
          />
          <PageSection
              id="escolhendo-tipo-conta"
              title="Escolhendo o Tipo de Conta"
              content="Selecione a opção Google para continuar com a configuração da sua conta."
          />
          <PageSection
              id="inserindo-email"
              title="Inserindo Email"
              content="Digite o seu endereço de e-mail empresarial para prosseguir."
          />
          <PageSection
              id="inserindo-senha"
              title="Inserindo Senha"
              content="Digite a senha da sua conta de e-mail com atenção para garantir o acesso correto."
          />
          <PageSection
              id="conexao-concluida"
              title="Conexão Concluída"
              content="Pronto! Sua conta do Gmail está conectada ao seu dispositivo Android. Agora você pode acessar seus e-mails diretamente pelo aplicativo do Gmail."
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
                  window.open(
                      "http://hesk.rodoparana.com.br/index.php?a=add",
                      "_blank"
                  )
              }
          >
            Abrir Chamado
          </Button>
        </div>
      </div>
  );
};

export default Celular;