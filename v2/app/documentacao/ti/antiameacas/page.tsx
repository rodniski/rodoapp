"use client";

import GenericDocumentationPage, { GenericDocumentationPageProps } from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const ameacasContent: GenericDocumentationPageProps = {
    title: "Central Anti-Ameaças",
    group: "TI",
    date: "11 de Fevereiro de 2024",
    description: "Esta página foi criada para compartilhar dicas de segurança digital, exemplos de e-mails, links e arquivos maliciosos a serem evitados. Lembre-se: nenhum antivírus é infalível, então a atenção de todos é indispensável.",
    sections: [
      {
        id: "dicas-gerais",
        title: "Dicas Gerais",
        content: "Proteger seu computador contra vírus exige atenção e boas práticas. Comece instalando um antivírus confiável para bloquear arquivos maliciosos. Mantenha o sistema, navegador, antivírus e outros softwares sempre atualizados, já que novas versões corrigem vulnerabilidades. Faça backups regulares de arquivos importantes, armazenando-os em dispositivos externos ou na nuvem, para garantir sua recuperação em caso de problemas. Evite abrir e-mails de remetentes desconhecidos, acessar links suspeitos ou baixar arquivos de fontes não confiáveis. Caso baixe algo, escaneie o conteúdo com um antivírus antes de abrir. Troque suas senhas periodicamente e evite usar a mesma senha para diferentes contas. Pequenas precauções como essas reduzem significativamente o risco de infecção por vírus e mantêm seus dados seguros.",
      },
      {
        id: "pishing",
        title: "Pishing",
        content: "O phishing é uma ameaça comum em que atacantes se passam por entidades confiáveis para obter dados confidenciais, como senhas e informações financeiras. Nunca clique em links suspeitos ou forneça dados solicitados. Caso receba uma mensagem suspeita, bloqueie o remetente, marque como 'SPAM' e relate o incidente ao setor de TI imediatamente.",
      },
      {
        id: "keylogger",
        title: "Keylogger",
        content: "Keyloggers são programas maliciosos que registram tudo o que você digita, como senhas e dados bancários, enviando essas informações para criminosos. Para se prevenir, evite baixar arquivos de fontes desconhecidas, mantenha o antivírus atualizado e desconfie de links ou anexos suspeitos.",

      },
      {
        id: "adware",
        title: "Adware",
        content: "O adware é um programa que exibe anúncios automaticamente, muitas vezes sem permissão do usuário, podendo surgir no navegador ou como notificações no Windows. Para prevenir, evite instalar programas de fontes não confiáveis e desative notificações de sites suspeitos."
      },
      {
        id: "backdoor",
        title: "Backdoor",
        content: "Backdoor é um mecanismo usado por malwares para obter acesso remoto a sistemas ou redes infectadas, explorando falhas em softwares desatualizados, configurações inadequadas ou firewalls. Para previnir. mantenha sistemas e aplicativos atualizados, use firewalls bem configurados e evite instalar softwares de fontes desconhecidas."
      },
      {
        id: "browser-hijacker",
        title: "Browser Hijacker",
        content: "O browser hijacker é um vírus que altera configurações do navegador, como a página inicial e o mecanismo de busca, exibindo anúncios em sites legítimos e redirecionando para páginas maliciosas com possíveis ameaças. Para previnir, evite baixar arquivos de fontes desconhecidas, mantenha o navegador e o antivírus atualizados e desconfie de extensões ou pop-ups suspeitos."
      },
      {
        id: "trojan-horses",
        title: "Trojan Horses",
        content: "Trojan Horses (Cavalos de Tróia) são programas ocultos que instalam ameaças em dispositivos, geralmente vindos de e-mails, sites maliciosos ou arquivos suspeitos. Eles também exploram falhas nos navegadores para instalar softwares maliciosos. Para se previnir, evite abrir links ou anexos desconhecidos, mantenha navegadores e sistemas atualizados, e use soluções de segurança confiáveis."
      },
      {
        id: "rootkit",
        title: "Rootkit",
        content: "Rootkits são trojans avançados que se instalam em camadas profundas do sistema operacional, podendo se reinstalar após remoção e se espalhar rapidamente. Para prevenir, mantenha o sistema atualizado, use antivírus confiáveis e evite baixar arquivos de fontes desconhecidas."
      },
      {
        id: "spyware",
        title: "Spyware",
        content: "O spyware é um software espião que coleta dados sobre os hábitos dos usuários na internet para distribuir propagandas personalizadas. Para se prevenir, evite sites não confiáveis, não instale programas desconhecidos e use ferramentas de segurança atualizadas."
      },
      {
        id:"time-bomb",
        title:"Time Bomb",
        content:"O Time Bomb é um malware programado para ativar em um momento específico, causando danos ao sistema. Para se prevenir, mantenha o software atualizado, use antivírus confiáveis e evite abrir arquivos ou links desconhecidos."
      },
      {
        id:"worm",
        title:"Worm",
        content:"Worms são vírus que se autorreplicam sem infectar arquivos legítimos, espalhando-se rapidamente por redes e dispositivos USB. Eles também podem ser enviados por e-mail, anexados a mensagens e distribuídos aos contatos da conta invadida. Para se previnir, evite abrir anexos ou links suspeitos, mantenha o antivírus atualizado e desative a execução automática de dispositivos externos."
      },
      {
        id:"greyware",
        title:"Greyware",
        content:"Greyware é um tipo de malware que ocupa a 'zona cinzenta' entre software legítimo e vírus, causando mais incômodos do que danos. Exemplos incluem adwares e programas indesejados, como o Baidu. Para se prevenir, evite baixar softwares de fontes desconhecidas, leia atentamente durante instalações e use ferramentas confiáveis para detectar e remover programas suspeitos."
      },
      {
        id:"joke-program",
        title:"Joke Program",
        content:"Joke Programs são códigos criados para causar travamentos ou alterações temporárias no sistema operacional, sem danos reais ao computador. Para se prevenir, evite executar programas desconhecidos e mantenha o sistema atualizado."
      },
      {
        id:"macros",
        title:"Macros",
        content:"Macros são comandos automatizados em programas como Word e Excel que podem ser usados para criar documentos maliciosos, executando ações prejudiciais ao serem abertos ou fechados. Para se prevenir, evite abrir arquivos de fontes desconhecidas e desative macros, especialmente em documentos não confiáveis."
      },
      {
        id:"ransomware",
        title:"Ransomware",
        content:"O ransomware é um malware que criptografa arquivos ou sistemas inteiros, exigindo pagamento ou compra de mercadorias para supostamente liberar os dados. No entanto, mesmo com o pagamento, os arquivos geralmente não são recuperados, já que nem os criadores do ransomware possuem a chave de descriptografia. A melhor forma de prevenção é manter backups atualizados, evitar links e anexos suspeitos, usar softwares confiáveis e manter o sistema de segurança sempre atualizado."
      },
      {
        id:"trojan-banking",
        title:"Trojan Banking",
        content:"O Trojan Banking é um malware projetado para roubar dados bancários, de redes sociais, sites de compras e e-mails. Ele se disfarça como um arquivo ou software legítimo, espalhando-se por sites comprometidos ou e-mails maliciosos. Para se prevenir, evite baixar arquivos de fontes desconhecidas, não clique em links suspeitos e mantenha seu sistema e antivírus sempre atualizados."
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
      <GenericDocumentationPage {...ameacasContent} />
    </div>
  );
};

export default Page;