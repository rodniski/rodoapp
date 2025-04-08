import React from "react";
import { Button } from "ui";
import { PageHeader, PageSection } from "../../components";
import Link from "next/link";

const Assinatura = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="max-w-4xl h-full w-full overflow-auto">
        <PageHeader
          title="Assinatura de Email"
          date="1 de Março de 2024"
          description="Crie sua assinatura no botãop abaixo e em seguida, copie-a para a área de transferência (CTRL + C) e siga as instruções para configurá-la no Outlook ou Gmail."
        />
        <Button
          variant={"outline"}
          className="mb-3"
          onClick={() =>
            window.open("http://hesk.rodoparana.com.br/signaturegen/", "_blank")
          }
        >
          Criar Assinatura
        </Button>

        <PageSection
          title="Configurando a Assinatura no Gmail"
          content="Acesse sua conta de e-mail, clique no ícone de engrenagem no canto superior direito e selecione Configurações."
          id="Configurando a Assinatura no Gmail"
        />

        <PageSection
          title="Adicionando Sua Assinatura"
          content="Nas configurações, localize a seção Assinatura, clique em Criar Nova e atribua um nome à sua nova assinatura."
          id="Adicionando Sua Assinatura"
        />

        <PageSection
          title="Finalizando a Assinatura no Gmail"
          content="Cole a assinatura copiada anteriormente no campo indicado. Marque as opções para utilizá-la em novos e-mails e respostas/encaminhamentos (As imagens podem não aparecer agora. Finalize e envie um teste para confirmar, as imagens devem aparecer normalmente)"
          id="Finalizando a Assinatura no Gmail"
        />

        <PageSection
          title="Outros Problemas"
          content="Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
          id="Outros Problemas"
        />
        <Link href={"http://hesk.rodoparana.com.br/index.php?a=add"}>
          <Button variant={"outline"} className="mb-10">
            Abrir Chamado
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Assinatura;
