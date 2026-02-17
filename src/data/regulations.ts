export interface RegulationArticle {
    id: string;
    article: string;
    topic: string[];
    content: string;
}

export const CONDO_REGULATIONS: RegulationArticle[] = [
    {
        id: 'art-42',
        article: 'Art. 42',
        topic: ['obra', 'varanda', 'vidro', 'fachada', 'reforma'],
        content: 'O fechamento de varandas é permitido mediante aprovação em assembleia, devendo seguir rigorosamente o padrão "Sistema Reiki" com vidros incolores e sem esquadrias verticais aparentes. É proibida a alteração da cor da fachada ou instalação de cortinas fora do padrão "Rolô Off-White".'
    },
    {
        id: 'art-15',
        article: 'Art. 15',
        topic: ['silêncio', 'barulho', 'obra', 'horário'],
        content: 'O horário de silêncio é compreendido entre 22h00 e 07h00. Obras e reformas ruidosas são permitidas apenas de segunda a sexta-feira, das 08h00 às 17h00, sendo proibidas aos sábados, domingos e feriados.'
    },
    {
        id: 'art-28',
        article: 'Art. 28',
        topic: ['animais', 'pet', 'cachorro', 'gato', 'área comum'],
        content: 'É permitida a permanência de animais nas unidades, desde que não perturbem o sossego. Nas áreas comuns, os animais devem transitar obrigatoriamente no colo ou em caixa de transporte, sendo vedada sua circulação em áreas de lazer como piscina, salão de festas e playground.'
    },
    {
        id: 'art-50',
        article: 'Art. 50',
        topic: ['mudança', 'elevador', 'horário', 'agendamento'],
        content: 'Mudanças devem ser agendadas com no mínimo 72h de antecedência. O horário permitido é de segunda a sexta, das 08h00 às 18h00, e sábados das 08h00 às 14h00. É obrigatório o uso do elevador de serviço com acolchoamento de proteção.'
    }
];
