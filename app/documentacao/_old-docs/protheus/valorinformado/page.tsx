"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_internal/ui/GenericDocumentationPage";

const Page = () => {
  const vendaDePecasContent: GenericDocumentationPageProps = {
    title: "Serviço com Valor Informado (VI)",
    group: "Protheus",
    date: "17 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá como utilizar o tipo de serviço 'VI' (Valor Informado) para definir valores personalizados na OS, ajustar o campo 'Vlr Fixo Srv' dentro dos limites permitidos e solicitar permissões necessárias, caso exigido pelo sistema.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para informar um valor específico para o serviço em uma Ordem de Serviço, utilize o tipo de serviço 'VI' (Valor Informado). No campo 'Cod Serviço', pressione F4 para abrir a lista e selecionar o serviço desejado. O sistema permite ajustar o valor total dos serviços em até 10 vezes o valor original, tanto para mais quanto para menos (99,99%). Por exemplo, se o valor inicial do serviço for R$ 270,00, é possível ajustar para até R$ 2.697,30. Basta inserir esse valor no campo 'Vlr Fixo Srv'. Após salvar, o valor do serviço será atualizado, e você pode repetir o processo alterando novamente a quantidade de horas para atingir o valor desejado. Lembre-se de que o vendedor deve ter permissão para utilizar este campo. Caso apareça uma mensagem de restrição, solicite a liberação à equipe de TI.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/valor-informado.png",
                props: { alt: "Print do erro", width: 400, height: 200 }
            },
            {
                type: "iframe", 
                content: "https://www.youtube.com/embed/aW1x-PCyi6Q", // Link de embed do YouTube
                props: {
                  className: "w-[700px] h-[400px] my-3",
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowFullScreen: true,
                },
            }
        ],
      },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content:
          "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!",
      },
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () =>
        window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank"),
    },
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...vendaDePecasContent} />
    </div>
  );
};

export default Page;
