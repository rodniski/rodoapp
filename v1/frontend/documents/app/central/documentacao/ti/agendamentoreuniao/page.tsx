"use client";

import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import GenericDocumentationPage, { GenericDocumentationPageProps } from "doc/components/GenericDocumentationPage";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "TI", href: "/central/documentacao/ti" },
      { label: "Agendamento de Reunião" },
    ]);
  }, [setBreadcrumbs]);

  const agendamentoContent: GenericDocumentationPageProps = {
    title: "Agendamento de Reunião",
    date: "18 de Outubro de 2024",
    description: "Para reservar salas de reunião na matriz, utilize os botões abaixo do Gmail ou do Google Calendar. Ambos métodos criam eventos públicos visíveis no ambiente Google da Rodoparaná. Lembre-se de respeitar as reservas existentes. Caso precise de ajuda, entre em contato com a Teresa (ramal 1400, Skype ou e-mail). Ela verificará a disponibilidade e realizará a reserva. Para cadastrar salas de filiais, informe à TI o nome da sala e sua capacidade de lotação.",
    headerButton: {
      text: "Google Calendar",
      onClick: () => window.open("http://calendar.google.com/", "_blank")
    },
    sections: [
      {
        id: "agendamento-gmail",
        title: "Agendando Pelo Gmail",
        content: "O método mais prático para agendar uma sala é pelo Gmail, onde é possível reservar diretamente sem sair do site. Clique no ícone do Google Agenda na lateral superior direita da página. Caso ele não apareça, clique na seta '<' para exibir o painel lateral. Selecione a data e horário desejados arrastando o mouse sobre o período da reunião ou clique em 'Criar um evento'. Verifique os detalhes como data e hora, adicione os convidados e, em seguida, clique em 'Adicionar salas'. Use o filtro 'somente as salas disponíveis' para visualizar apenas as salas livres, ocultando automaticamente as ocupadas. Se algum dos convidados for de uma filial ou externo, um link para uma sala online do Google Meet será gerado automaticamente e incluído no convite para a reunião.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/agendamento/agendamento-gmail.mp4",
            props: { className: "w-full max-w-[700px] h-auto", muted: true, controls: true }
          }
        ]
      },
      {
        id: "agendamento-google-agenda",
        title: "Agendando Pelo Google Agenda",
        content: "Para quem utiliza o Outlook ou prefere uma visão detalhada diretamente no aplicativo, é possível realizar o agendamento pelo site acessando o link fornecido. O processo é semelhante ao realizado no Gmail: selecione o horário e a data desejados, insira o contexto da reunião, adicione os participantes pelos seus e-mails e confirme. O sistema gerará um link do Google Meet e verificará automaticamente a disponibilidade da sala para o horário solicitado.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/agendamento/agendamento-agenda.mp4",
            props: { className: "w-full max-w-[700px] h-auto", muted: true, controls: true }
          }
        ]
      },
      {
        id: "disponibilidade-salas",
        title: "Disponibilidade de Salas",
        content: "Para desbloquear a visibilidade das salas de reunião, siga estes passos: entre no Google Agenda e acesse o menu lateral em 'Outras agendas'. Clique no ícone de '+' ao lado e selecione 'Procurar recursos'. Na próxima tela, escolha as salas de reunião que deseja acompanhar e, em seguida, saia clicando na seta ao lado de 'Configurações'. A partir disso, sempre que um evento com o nome da sala aparecer, será indicado que ela já está em uso, mostrando também o tempo em que estará indisponível.",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/ti/agendamento/salas-disponiveis.mp4",
            props: { className: "w-full max-w-[700px] h-auto", muted: true, controls: true }
          }
        ]
      },
      {
        id: "salas-disponiveis",
        title: "Salas de Reunião Disponíveis",
        content: (
          <div>
            <p className="mt-4">Rodoparaná Matriz</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Raul Randon:</strong> Sala de reuniões localizada ao
                lado da TI, com capacidade para até 10 pessoas.
              </li>
              <li>
                <strong>Hercílio Randon:</strong> Auditório situado na área da
                diretoria, com capacidade para até 50 pessoas.
              </li>
            </ul>
            <p className="mt-6">Grupo Timber Matriz</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <strong>Sala de Reunião:</strong> Espaço com capacidade para
                até 8 pessoas.
              </li>
            </ul>
          </div>
        )
      },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content: "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
      }
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () => window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank")
    }
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...agendamentoContent} />
    </div>
  );
};

export default Page;

