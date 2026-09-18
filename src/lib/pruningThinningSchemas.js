// Base de dados estruturada de esquemas técnicos e visuais para Podas e Mondas
// Cobre todas as 22 espécies de árvores/arbustos e 22 culturas de horta

export const PODA_SCHEMAS = {
  // --- VINHA ---
  poda_vinha_inverno: {
    id: "poda_vinha_inverno",
    title: "Videira - Poda de Inverno (Guyot & Royat)",
    diagramType: "grapevine_winter",
    cutAngle: "Bisel a 45° inclinado no sentido oposto à gema terminal",
    cutHeight: "2 a 3 cm acima do gomo superior (evita que a lágrima queime a gema)",
    tools: ["Tesoura de poda de uma mão afiada", "Serrote de poda para braços velhos", "Álcool 70° ou lixívia diluída"],
    goldenRule: "Nunca cortes plano sobre o gomo: o 'choro' da videira deve escorrer pelo lado oposto para não afogar a gema fértil.",
    steps: [
      {
        step: 1,
        title: "Limpeza de Madeira Velha",
        badge: "Sanidade",
        cut: "Varas que já frutificaram no ano anterior, pâmpanos secos ou atacados por míldio/oídio.",
        keep: "O tronco principal e os braços estruturais sãos.",
        description: "Elimina toda a ramaria que deu uva no ciclo passado. A uva dá sempre em rebentos novos que nascem de madeira do ano anterior.",
        proTip: "Se vires madeira enegrecida ou com cancro, corta até encontrares tecido verde e desinfeta a lâmina de seguida."
      },
      {
        step: 2,
        title: "Seleção de Talões ou Varas",
        badge: "Estrutura",
        cut: "Varas fracas, tortas, ladrões da base do tronco e sarmentos em excesso.",
        keep: "1 a 2 sarmentos vigorosos e bem lignificados por cada ponto de vegetação.",
        description: "No sistema Royat (cordão), corta cada vara deixando apenas um talão curto com 2 gomos férteis. No sistema Guyot, deixa uma vara longa (6-8 gomos) e um talão de reserva (2 gomos).",
        proTip: "Escolhe sarmentos da grossura de um lápis, de cor castanho-dourada uniforme e entrenós curtos."
      },
      {
        step: 3,
        title: "Corte em Bisel Inclinado",
        badge: "Execução",
        cut: "Corte oblíquo a 45° virado para o lado oposto ao último gomo.",
        keep: "2 a 3 cm de distância de segurança entre o corte e o gomo.",
        description: "A videira 'chora' seiva abundante no início da primavera. O declive do corte guia as gotas para o solo, protegendo a gema fértil de fungos e apodrecimento.",
        proTip: "Mantém a lâmina de corte sempre virada para o lado da videira que fica e a contra-lâmina virada para o ramo descartado."
      },
      {
        step: 4,
        title: "Amarração & Proteção",
        badge: "Acabamento",
        cut: "Fios velhos de atilho que estejam a estrangular os ramos.",
        keep: "Varas curvadas e amarradas ao arame com folga.",
        description: "Arqueia a vara produtiva suavemente no arame de suporte e ata com ráfia ou vime. Aplica calda bordalesa no final da poda.",
        proTip: "Arqueia os ramos nos dias menos frios da tarde, quando a madeira está mais flexível e não parte."
      }
    ]
  },

  poda_vinha_verde: {
    id: "poda_vinha_verde",
    title: "Videira - Poda em Verde & Desladroamento",
    diagramType: "grapevine_green",
    cutAngle: "Desbaste manual / beliscão com as unhas ou tesourinha de colheita",
    cutHeight: "Pela base do rebento tenro sem rasgar a casca do braço",
    tools: ["Unhas/dedos (manual)", "Tesoura pequena de desbaste"],
    goldenRule: "Abre janelas de sol sobre os cachos sem os expor a escaldões diretos nas horas de pico.",
    steps: [
      {
        step: 1,
        title: "Esladroamento dos Braços",
        badge: "Limpeza",
        cut: "Todos os rebentos ladrões que nasçam do tronco velho ou braços sem cacho.",
        keep: "Apenas os rebentos nascidos dos talões de inverno que sustentam cachos de uva.",
        description: "Retira os rebentos gulosos que brotam da madeira velha. Enquanto tenros (menos de 15 cm), partem-se facilmente com um simples toque lateral do polegar.",
        proTip: "Faz o esladroamento de manhã cedo quando as plantas estão túrgidas e estalam facilmente."
      },
      {
        step: 2,
        title: "Desponta Apical (Topping)",
        badge: "Equilíbrio",
        cut: "Os últimos 10 a 20 cm da ponta dos pâmpanos que ultrapassam o arame superior.",
        keep: "8 a 10 folhas adultas saudáveis acima do último cacho.",
        description: "Ao cortar a ponta do ramo que cresce sem parar, forças a planta a enviar a seiva elaborada para o enchimento dos bagos em vez de produzir mais folhagem.",
        proTip: "Corta logo acima de uma folha bem desenvolvida."
      },
      {
        step: 3,
        title: "Desfolha Seletiva da Zona dos Cachos",
        badge: "Arejamento",
        cut: "2 a 3 folhas velhas ou amarelecidas que tapem diretamente os cachos no lado virado a norte/nascente.",
        keep: "A folhagem protetora do lado poente para evitar queimaduras solares nos bagos.",
        description: "Permite que a brisa seque o orvalho matinal e previne o míldio e a podridão cinzenta (botrite) sem necessidade de químicos.",
        proTip: "Nunca desfolhes em demasia em anos de calor extremo para não cozer a uva."
      }
    ]
  },

  // --- FRUTEIRAS DE PEPITA ---
  poda_macieira: {
    id: "poda_macieira",
    title: "Macieira - Poda de Frutificação & Taça Aberta",
    diagramType: "cup_shape",
    cutAngle: "45° em bisel voltado para fora sobre uma gema exterior",
    cutHeight: "5 mm acima do gomo voltado para o exterior da copa",
    tools: ["Tesoura de poda bem afiada", "Serrote para ramos secos centrais", "Pasta cicatrizante"],
    goldenRule: "Preserva as lamburdas, bolsas e brindilhas curtas: são nelas que nascem as melhores maçãs!",
    steps: [
      {
        step: 1,
        title: "Limpeza Sanitária e Ladrões",
        badge: "Sanidade",
        cut: "Ramos secos, doentes, atacados por cancro e 'ladrões' verticais vigorosos no cimo da copa.",
        keep: "Ramos estruturais horizontais ou com inclinação a 45°.",
        description: "Elimina os ramos verticais que sugam seiva sem dar flor. O centro da macieira deve receber luz solar direta em todas as horas do dia.",
        proTip: "Ramos com ângulo de 45° a 60° em relação ao tronco dão muito mais fruta do que ramos perfeitamente verticais."
      },
      {
        step: 2,
        title: "Reconhecimento dos Órgãos de Frutificação",
        badge: "Identificação",
        cut: "Ramos cruzados que atritem uns contra os outros.",
        keep: "Lamburdas (pequenos esporões enrugados terminados em botão floral gordo) e dardos.",
        description: "A macieira frutifica nos mesmos órgãos durante anos consecutivos. Nunca cortes os pequenos esporões rugosos e curtos colados aos ramos principais.",
        proTip: "O botão de flor da macieira é gordo, aveludado e arredondado; a gema vegetativa de madeira é pontiaguda e achatada."
      },
      {
        step: 3,
        title: "Desponte em Bisel sobre Gema Exterior",
        badge: "Condução",
        cut: "1/3 da ponta dos ramos do ano que estejam a esticar demasiado.",
        keep: "Gema terminal sempre virada para fora da copa.",
        description: "Faz o corte a 45° inclinado, 5 mm acima de um gomo voltado para o exterior. O rebento que dali nascer vai abrir a copa em taça em vez de fechar o centro.",
        proTip: "Se cortares sobre uma gema virada para dentro, o novo ramo vai crescer para o meio da árvore e criar emaranhado."
      },
      {
        step: 4,
        title: "Proteção de Feridas",
        badge: "Cicatrização",
        cut: "Rebarbas ou casca estalada deixadas pelo corte.",
        keep: "Superfície do corte lisa e limpa.",
        description: "Pincela com pasta fúngica ou pasta de poda qualquer corte com diâmetro superior a 2 cm para prevenir a entrada do cancro da macieira.",
        proTip: "Aplica tratamento de inverno com óleo de verão e calda cúprica logo a seguir à poda."
      }
    ]
  },

  poda_pereira: {
    id: "poda_pereira",
    title: "Pereira (Pêra Rocha) - Condução e Formação",
    diagramType: "cup_shape",
    cutAngle: "45° em bisel acima de botão fértil ou gema exterior",
    cutHeight: "5 a 7 mm acima do nó",
    tools: ["Tesoura de poda profissional", "Serrote", "Desinfetante de lâminas"],
    goldenRule: "A pereira tem tendência natural para crescer muito vertical: abre os ramos puxando-os com atilhos para ficarem mais horizontais.",
    steps: [
      {
        step: 1,
        title: "Eliminação da Concorrência Apical",
        badge: "Abertura",
        cut: "Ramos chupões verticais que concorrem com a flecha principal e ramos que crescem para dentro.",
        keep: "Ramos laterais bem distribuídos nos diferentes andares da árvore.",
        description: "A Pêra Rocha desenvolve rebentos verticais com facilidade extraordinária. Corta esses rebentos na base, junto ao anel do ramo, sem deixar tocos.",
        proTip: "Ramos inclinados produzem pêras mais cedo; vergas ou pesos podem ser usados para deitar os ramos sem os partir."
      },
      {
        step: 2,
        title: "Arejamento das Lamburdas e Bolsas",
        badge: "Produção",
        cut: "Bolsas velhas esgotadas ou com excesso de esporões aglomerados.",
        keep: "Bolsas jovens com botões redondos bem nutridos.",
        description: "Nas pereiras adultas, as bolsas ramificam-se em demasia ao fim de 3 a 4 anos. Raleia metade das gemas velhas para dar calibre à Pêra Rocha remanescente.",
        proTip: "Se deixares todas as lamburdas, terás muitas pêras minúsculas; desbastando na poda, terás pêras Rocha graúdas e sumarentas."
      },
      {
        step: 3,
        title: "Desponte e Iluminação",
        badge: "Equilíbrio",
        cut: "Ponta de ramos compridos que sombreiem os pisos inferiores.",
        keep: "Copa em pirâmide ou taça onde o sol banhe o tronco até à base.",
        description: "O sol é indispensável para criar o típico 'carepô' aromático na casca da Pêra Rocha.",
        proTip: "Evita podas drásticas no inverno rigoroso: dias secos e sem geada são a condição de ouro."
      }
    ]
  },

  poda_marmeleiro: {
    id: "poda_marmeleiro",
    title: "Marmeleiro - Poda de Limpeza e Arejamento",
    diagramType: "cup_shape",
    cutAngle: "45° em bisel suave",
    cutHeight: "5 mm acima de gomo vigoroso",
    tools: ["Tesoura de poda", "Serrote leve"],
    goldenRule: "O marmeleiro tem madeira quebradiça e ramifica em emaranhado: o segredo é manter o centro livre e desimpedido.",
    steps: [
      {
        step: 1,
        title: "Desbaste do Emaranhado Central",
        badge: "Arejamento",
        cut: "Ramos cruzados que raspam entre si, ramos secos e ramos que apontam para o centro.",
        keep: "4 a 5 pernadas estruturais bem espaçadas que formem um cálice.",
        description: "O marmeleiro frutifica nas extremidades dos ramos jovens nascidos na primavera anterior. Eliminar o miolo fechado é crucial para evitar a moniliose nos marmelos.",
        proTip: "A casca do marmeleiro é fina: corta com tesoura impecavelmente afiada para não lascar a madeira."
      },
      {
        step: 2,
        title: "Eliminação de Ladrões de Raiz",
        badge: "Limpeza",
        cut: "Rebentos que brotam da base do tronco e das raízes superficiais.",
        keep: "O tronco único limpo até pelo menos 50 cm do chão.",
        description: "O marmeleiro é muito afiado a emitir rebentos basais (bastardos). Retira-os rente ao solo logo no inverno.",
        proTip: "Se os arrancares com puxão firme para baixo quando ainda jovens no verão, não voltam a brotar com tanta força."
      },
      {
        step: 3,
        title: "Desponte Suave",
        badge: "Produção",
        cut: "Apenas 1/4 das pontas dos ramos mais longos e descaídos.",
        keep: "A maior parte da ramaria terminal, onde se formam as flores solitárias aromáticas.",
        description: "Uma poda demasiado severa atrasa a colheita e induz crescimento vegetativo desmesurado em detrimento dos marmelos.",
        proTip: "Terminada a poda, queima ou composteia a madeira cortada para não propagar esporos fúngicos de moniliose."
      }
    ]
  },

  // --- FRUTEIRAS DE CAROÇO ---
  poda_pessegueiro: {
    id: "poda_pessegueiro",
    title: "Pessegueiro e Nectarina - Poda de Vaso Aberto",
    diagramType: "cup_shape",
    cutAngle: "45° rigoroso virado para fora da copa",
    cutHeight: "5 mm acima de gema de madeira ou nó triplo",
    tools: ["Tesoura de poda de precisão", "Desinfetante de lâmina"],
    goldenRule: "O pessegueiro só dá fruto em ramos de 1 ano que nunca mais voltam a produzir: é obrigatório renovar ramos todos os anos!",
    steps: [
      {
        step: 1,
        title: "Identificação dos Ramos Mistos",
        badge: "Anatomia",
        cut: "Ramos velhos que já deram pêssegos no ano anterior (estão escuros e sem gemas no miolo).",
        keep: "Ramos mistos de 1 ano com cor avermelhada e nós de 3 gemas (duas de flor redondas com uma de madeira pontiaguda no meio).",
        description: "O nó triplo é o tesouro do pessegueiro: a gema do meio produz a folha que alimenta o fruto das gemas laterais.",
        proTip: "Ramos fininhos frágeis (maios) devem ser cortados ou encurtados; prefere ramos mistos da grossura de uma caneta."
      },
      {
        step: 2,
        title: "Abertura Total da Taça (Vaso)",
        badge: "Estrutura",
        cut: "Todos os ramos verticais que ocupem o centro da taça.",
        keep: "3 a 4 ramos mestres abertos como um cálice onde o sol penetre até ao tronco.",
        description: "Sem sol direto na copa, os pêssegos não ganham cor, ficam ácidos e são atacados por lepra (Taphrina deformans).",
        proTip: "Poda tarde: o melhor momento é quando os botões florais já mostram a cor rosada (início do desborre)."
      },
      {
        step: 3,
        title: "Encurtamento Produtivo",
        badge: "Corte",
        cut: "Reduzir os ramos mistos selecionados para 20 a 30 cm de comprimento (cerca de 4 a 6 botões florais).",
        keep: "Sempre uma gema de madeira na extremidade do corte para puxar a seiva.",
        description: "Se não encurtares, o ramo vai vergar com o peso dos pêssegos e partir-se ao meio, além de dar fruta miúda.",
        proTip: "Nunca deixes o ramo sem gema de folha na ponta, caso contrário o ramo seca e o fruto cai."
      }
    ]
  },

  poda_cerejeira: {
    id: "poda_cerejeira",
    title: "Cerejeira - Poda Pós-Colheita ou de Fim de Verão",
    diagramType: "stone_fruit_summer",
    cutAngle: "Bisel limpo junto ao anel do ramo sem toco e sem ferir a casca",
    cutHeight: "Rente ao colar de cicatrização",
    tools: ["Tesoura muito afiada", "Serrote fino", "Mástique protetor impermeabilizante"],
    goldenRule: "Nunca podes a cerejeira no inverno frio e húmido: a humidade provoca gomose fatal e cancro bacteriano. Poda sempre em tempo seco pós-colheita!",
    steps: [
      {
        step: 1,
        title: "Poda em Verde após a Colheita (Julho/Agosto)",
        badge: "Época Crítica",
        cut: "Ramos doentes, ramos secos e ramos chupões que cresceram desordenadamente.",
        keep: "Os tufos de gemas de flor arredondados chamados 'buquês de maio'.",
        description: "Ao podar com a cerejeira ainda em folha e com calor de verão, a seiva ativa fecha as feridas em poucos dias com resina natural.",
        proTip: "Se precisares de podar no inverno, fá-lo apenas no início do desborre e pinta logo com pasta cúprica."
      },
      {
        step: 2,
        title: "Preservação dos Buquês de Maio",
        badge: "Produção",
        cut: "Ramos grossos que façam sombra cerrada sobre os ramos baixos.",
        keep: "Pequenos raminhos curtos de 2 a 5 cm coroados por 5 a 8 gemas florais juntas.",
        description: "Os buquês de maio são as verdadeiras fábricas de cerejas e continuam a dar fruta durante 10 ou mais anos se tiverem luz.",
        proTip: "Não toques nem desponte os buquês de maio: raleia apenas ramos grandes à volta deles para lhes dar luz."
      },
      {
        step: 3,
        title: "Redução de Altura e Arejamento",
        badge: "Acesso",
        cut: "O ápice de ramos mestres demasiado altos, cortando sobre uma derivação lateral mais baixa.",
        keep: "A árvore a uma altura manejável que permita a colheita sem risco.",
        description: "Transfere o crescimento para um ramo lateral secundário oblíquo (corte de retorno), diminuindo a altura da copa.",
        proTip: "Desinfeta a lâmina a cada 2 árvores com álcool para não transmitir o cancro bacteriano (Pseudomonas)."
      }
    ]
  },

  poda_ameixeira: {
    id: "poda_ameixeira",
    title: "Ameixeira - Poda de Vaso Aberto e Iluminação",
    diagramType: "cup_shape",
    cutAngle: "45° virado para fora",
    cutHeight: "5 mm acima de gomo sadio",
    tools: ["Tesoura de duas mãos", "Tesoura de uma mão", "Pasta cicatrizante"],
    goldenRule: "Raleia os ramos antes que fiquem muito densos: a ameixeira tem folhagem escura e pesada que atrai afídeos se não estiver arejada.",
    steps: [
      {
        step: 1,
        title: "Eliminação de Ramos Ladrões Verticais",
        badge: "Controlo",
        cut: "Chupões vigorosos do interior da copa que crescem mais de 1 metro por ano.",
        keep: "Ramos laterais inclinados de 1 e 2 anos com buquês e dardos florais.",
        description: "A ameixeira lança ramos chupões com enorme vigor. Elimina-os na base sem deixar pedúnculos toscos.",
        proTip: "Se um ladrão estiver num sítio vazio da copa, podes dobrá-lo ou encurtá-lo a 3 gemas para o transformar em ramo frutuário."
      },
      {
        step: 2,
        title: "Manutenção do Centro Desimpedido",
        badge: "Arejamento",
        cut: "Ramos cruzados e ramos que cresçam em direção ao tronco principal.",
        keep: "Estrutura em vaso com 3 a 4 ramos principais virados para os quatro pontos cardeais.",
        description: "O sol tem de bater na casca das ameixas para desenvolver os açúcares e a camada pruinosa (cera azulada protetora).",
        proTip: "Evita podas de inverno em regiões de geada forte: espera pelo fim do inverno com tempo estável."
      },
      {
        step: 3,
        title: "Alívio de Pontas Pesadas",
        badge: "Prevenção",
        cut: "1/3 da ponta de ramos compridos que verguem demasiado.",
        keep: "Ramos robustos capazes de suportar o peso tremendo de cachos de ameixas sem partir.",
        description: "As ameixeiras são campeãs a quebrar ramos carregados no verão. O desponte de inverno confere rigidez aos suportes.",
        proTip: "No verão seguinte, faz monda manual de ameixas deixando 1 fruto a cada 5 a 8 cm."
      }
    ]
  },

  poda_damasqueiro: {
    id: "poda_damasqueiro",
    title: "Damasqueiro (Alperceiro) - Poda Suave em Taça",
    diagramType: "cup_shape",
    cutAngle: "Bisel perfeito a 45° acima de gema exterior",
    cutHeight: "5 a 8 mm acima do gomo",
    tools: ["Tesoura afiadíssima", "Serrote japonês", "Cobre protetor"],
    goldenRule: "O alperceiro cicatriza mal e teme a apoplexia (fungos vasculares): poda o mínimo possível e sempre com tempo seco.",
    steps: [
      {
        step: 1,
        title: "Limpeza Cirúrgica",
        badge: "Sanidade",
        cut: "Ramos secos, ramos lascados pelo vento e madeira morta.",
        keep: "Madeira viva e ramos de 1 ano bem bronzeados pelo sol.",
        description: "Nunca faças podas drásticas no damasqueiro. Limita-te a cortes de limpeza e pequenas correções de copa.",
        proTip: "O momento ideal é no final da floração ou logo após a colheita dos alperces no início do verão."
      },
      {
        step: 2,
        title: "Preservação de Órgãos Produtivos",
        badge: "Produção",
        cut: "Ramos verticais ensombradores.",
        keep: "Ramos mistos curtos e buquês de maio na madeira de 2 anos.",
        description: "Os alperces dão-se muito perto da madeira velha. Não desbastes em demasia os pequenos raminhos laterais.",
        proTip: "Ao cortar ramos grossos, usa obrigatoriamente a técnica dos 3 cortes para não rasgar a casca delicada."
      },
      {
        step: 3,
        title: "Tratamento Protetor Imediato",
        badge: "Proteção",
        cut: "Ramos infectados até encontrar madeira alva e sã.",
        keep: "Cortes limpos sem fibras desfiadas.",
        description: "Pincela imediatamente todos os cortes com mástique cicatrizante e pulveriza a copa com sulfato de cobre.",
        proTip: "Nunca podes com chuva prevista para as próximas 48 horas."
      }
    ]
  },

  // --- CITRINOS ---
  poda_laranjeira: {
    id: "poda_laranjeira",
    title: "Laranjeira - Poda de Arejamento 'Guarda-Chuva Iluminado'",
    diagramType: "citrus",
    cutAngle: "Corte rente ao anel do ramo sem danificar a casca protetora",
    cutHeight: "Rente à inserção do ramo",
    tools: ["Tesoura de poda média", "Serrote para ramos secos interiores", "Luvas de couro"],
    goldenRule: "A laranjeira é uma árvore de folha persistente: o seu interior deve ser iluminado, mas nunca tosquiado; as folhas protegem a casca do sol abrasador.",
    steps: [
      {
        step: 1,
        title: "Limpeza do Interior da Copa",
        badge: "Descongestionamento",
        cut: "Ramos secos interiores que morreram por falta de luz, ramos cruzados e ramos com cochonilha.",
        keep: "O dossel exterior de folhagem verde e saudável.",
        description: "Cria 'chaminés de luz' no interior. Ao olhar para cima através do tronco, deves ver pontinhos de céu azul entre as folhas.",
        proTip: "A laranjeira dá fruta na periferia exterior da copa; limpar o interior poupa nutrientes e afasta pragas de fungos (fumagina)."
      },
      {
        step: 2,
        title: "Eliminação dos Ladrões ('Chupones')",
        badge: "Controlo",
        cut: "Varas verticais compridas, com espinhos longos e folhas muito grandes que disparam do centro.",
        keep: "Ramos finos com folhagem média e flores perfumadas de laranjeira (azahar).",
        description: "Os rebentos ladrões dos citrinos sugam enormes quantidades de água e azoto e raramente produzem laranjas doces.",
        proTip: "Corta os ladrões o mais cedo possível, logo que atinjam 20 a 30 cm de comprimento."
      },
      {
        step: 3,
        title: "Levantamento da Saia (Desabafo Inferior)",
        badge: "Sanidade",
        cut: "Ramos baixos que toquem ou fiquem a menos de 30 a 40 cm do solo.",
        keep: "Ramos a partir de 40 cm de altura.",
        description: "Evita que as laranjas toquem na terra onde apodrecem e corta a escada de acesso a caracóis, lesmas e formigas.",
        proTip: "Poda no início da primavera, após as colheitas e quando o perigo de geadas tardias tiver passado por completo."
      }
    ]
  },

  poda_limoeiro: {
    id: "poda_limoeiro",
    title: "Limoeiro 4 Estações - Poda Contínua e Equilíbrio",
    diagramType: "citrus",
    cutAngle: "Corte limpo junto ao tronco ou nó",
    cutHeight: "Sem tocos salientes",
    tools: ["Tesoura de poda afiada", "Luvas resistentes a espinhos"],
    goldenRule: "O limoeiro produz flores e limões durante todo o ano: a poda deve ser ligeira e constante, nunca agressiva!",
    steps: [
      {
        step: 1,
        title: "Remoção de Ladrões Espinhosos",
        badge: "Seiva",
        cut: "Rebentos verticais ultra-rápidos armados de grandes espinhos que brotam do interior.",
        keep: "Ramos curvos e flexíveis onde se encontram botões de flor e limões verdes.",
        description: "Elimina estes ramos vigorosos na sua base. Eles desequilibram a copa e tiram calibre aos limões em crescimento.",
        proTip: "Se tiveres um vazio grande na copa de um limoeiro desequilibrado, corta o ladrão a 20 cm para forçar ramificação produtiva."
      },
      {
        step: 2,
        title: "Desbaste e Arejamento",
        badge: "Sanidade",
        cut: "Ramos emaranhados, ramos atacados pela larva mineira dos citrinos ou com folhas enroladas.",
        keep: "Folhas brilhantes e sãs que alimentam os frutos durante o inverno.",
        description: "Um limoeiro muito denso cria o ambiente perfeito para cochonilha-algodão e fumagina negra.",
        proTip: "Lava a tesoura em álcool entre árvores para travar a propagação de vírus dos citrinos."
      },
      {
        step: 3,
        title: "Alívio de Carga e Saia Baixa",
        badge: "Estrutura",
        cut: "Ramos que arrastem limões no chão e pontas que toquem em muros ou vedações.",
        keep: "Estrutura arredondada e compacta fácil de colher.",
        description: "Mantém a base limpa e a copa contida para facilitar a apanha frequente dos limões ao longo das 4 estações.",
        proTip: "Aduba com quelatos de ferro e adubo de citrinos rico em potássio após a poda para estimular novas florações."
      }
    ]
  },

  poda_clementineira: {
    id: "poda_clementineira",
    title: "Tangerineira e Clementina - Iluminação e Calibre",
    diagramType: "citrus",
    cutAngle: "Bisel limpo rente à inserção",
    cutHeight: "5 mm acima do colar",
    tools: ["Tesoura de poda leve", "Desinfetante"],
    goldenRule: "A clementina tende a produzir em alternância (ano de muita fruta miúda vs ano vazio): a poda equilibra a safra todos os anos.",
    steps: [
      {
        step: 1,
        title: "Abertura de Claraboias de Luz",
        badge: "Iluminação",
        cut: "Ramos centrais densos que façam sombra cerrada no miolo.",
        keep: "Copa aberta em forma de cogumelo ou guarda-chuva iluminado.",
        description: "A casca da tangerina precisa de sol para ganhar a coloração alaranjada viva e doçura açucarada.",
        proTip: "Poda logo após a colheita de inverno, antes da grande rebentação primaveril de março."
      },
      {
        step: 2,
        title: "Raleio de Ramos Secos e Fracos",
        badge: "Limpeza",
        cut: "Galhos finos esgotados pelo peso da safra anterior.",
        keep: "Ramos médios vigorosos e bem orientados.",
        description: "Eliminar a ramaria fina e seca reduz a fricção entre ramos que arranha a casca fina das clementinas com vento.",
        proTip: "Tangerineiras com ramos arejados quase não sofrem de mosca-da-fruta nem de cochonilha."
      },
      {
        step: 3,
        title: "Levantamento da Base",
        badge: "Acesso",
        cut: "Ramos inferiores a menos de 35 cm do chão.",
        keep: "Espaço livre para circular ar fresco e permitir rega limpa.",
        description: "Clementinas caídas ou a tocar na terra apodrecem em poucas horas com as chuvas de outono.",
        proTip: "Aproveita para recolher as folhas caídas da base e aplicar uma cobertura morta de palha limpa."
      }
    ]
  },

  // --- OLIVEIRA ---
  poda_oliveira: {
    id: "poda_oliveira",
    title: "Oliveira - Poda de Produção & Copa Aberta",
    diagramType: "olive_production",
    cutAngle: "Inclinado no topo; rente ao anel nos ramos laterais",
    cutHeight: "Sem deixar cepos mortos",
    tools: ["Tesourão de duas mãos", "Serrote de cabo longo", "Motosserra de poda para troncos velhos"],
    goldenRule: "Como diz a tradição alentejana: 'Pela copa da oliveira deve conseguir passar um pássaro a voar sem bater com as asas nas folhas!'",
    steps: [
      {
        step: 1,
        title: "Desbaste do Centro (Abertura da Copa)",
        badge: "Luz",
        cut: "Ramos centrais altos ('chaminés') que tapam o sol e roubam força ao perímetro.",
        keep: "3 a 4 pernadas mestras orientadas para o exterior formando um cálice aberto.",
        description: "A azeitona produz exclusivamente em madeira de 1 ano bem banhada pelo sol. O centro fechado só dá folhas amarelas e rama seca.",
        proTip: "Cortar a chaminé central reduz a altura da oliveira e torna a apanha das azeitonas 3 vezes mais rápida."
      },
      {
        step: 2,
        title: "Raleio de Ramos Secundários",
        badge: "Produção",
        cut: "Ramos cruzados, ramos verticais e ramos pendentes velhos que já produziram.",
        keep: "Ramos de 1 ano com inclinação de 45° e pontas arqueadas com folhagem verde-prateada viçosa.",
        description: "A oliveira sofre de alternância de produção (safra e contrasafra). A poda anual equilibrada garante azeitona de qualidade todos os anos.",
        proTip: "Poda entre o fim da colheita e o início da floração (fevereiro a abril), em dias secos."
      },
      {
        step: 3,
        title: "Limpeza de Ramos Baixos e Doentes",
        badge: "Sanidade",
        cut: "Ramos com gafa, olho de pavão ou feridas de granizo.",
        keep: "Ramos arejados onde o vento circule livremente.",
        description: "O vento e o sol são os maiores inimigos do olho de pavão (Spilocaea oleaginea). Uma oliveira podada não cria fungos.",
        proTip: "Aplica de imediato calda bordalesa ou óxido cuproso logo após o término da poda."
      }
    ]
  },

  poda_oliveira_desladroamento: {
    id: "poda_oliveira_desladroamento",
    title: "Oliveira - Desladroamento do Tronco e da Raiz",
    diagramType: "olive_suckers",
    cutAngle: "Rente à casca da base sem toco",
    cutHeight: "Ao nível do colo do tronco ou abaixo da linha da terra",
    tools: ["Podão alentejano ou tesourão", "Enxadote pequeno para desenterrar a raiz"],
    goldenRule: "Retira os ladrões da base no verão: se os deixares crescer, roubam mais de 40% da seiva que devia alimentar as azeitonas.",
    steps: [
      {
        step: 1,
        title: "Descoberta da Raiz e Colo",
        badge: "Preparação",
        cut: "Não cortar antes de afastar a terra superficial.",
        keep: "A casca sã do colo do tronco intacta.",
        description: "Muitos ladrões nascem de gemas subterrâneas do porta-enxerto. Afasta a terra com um sacho para ver de onde brota o rebento.",
        proTip: "Se cortares à tona da terra sem desenterrar a base, cada ladrão cortado vai gerar 3 novos rebentos em poucas semanas."
      },
      {
        step: 2,
        title: "Corte Rente na Inserção",
        badge: "Execução",
        cut: "Todos os rebentos ladrões do tronco, nós baixos e raízes de suporte.",
        keep: "Apenas os ramos principais da copa produtiva.",
        description: "Usa o podão ou tesourão com lâmina encostada ao tronco. Um corte rente permite que o calo de cicatrização feche a ferida sem novas brotações.",
        proTip: "Faz esta operação entre julho e setembro com o tempo quente e seco; as feridas cicatrizam rapidamente sem risco de fungos."
      },
      {
        step: 3,
        title: "Aconchego de Terra e Proteção",
        badge: "Acabamento",
        cut: "Restos de folhagem espalhada junto ao tronco.",
        keep: "Base do tronco limpa e arejada.",
        description: "Volta a tapar a raiz com terra limpa e aconchega. A oliveira agradece com um crescimento vigoroso na copa.",
        proTip: "A madeira tenra de desladroamento é rica em celulose e pode ser triturada para enriquecer a pilha de compostagem."
      }
    ]
  },

  // --- FRUTOS SECOS ---
  poda_amendoeira: {
    id: "poda_amendoeira",
    title: "Amendoeira - Poda de Vaso Aberto",
    diagramType: "cup_shape",
    cutAngle: "45° acima de gema exterior",
    cutHeight: "5 mm acima do nó",
    tools: ["Tesoura de poda", "Serrote", "Pasta cicatrizante"],
    goldenRule: "A amendoeira é a primeira árvore a florescer (janeiro/fevereiro): poda cedo no início do outono ou logo após a queda da folha!",
    steps: [
      {
        step: 1,
        title: "Limpeza de Madeira Seca",
        badge: "Sanidade",
        cut: "Ramos velhos atacados por mancha-ocre, ramos secos e partidos pelo varejo das amêndoas.",
        keep: "Ramos sãos e vigorosos de 1 e 2 anos.",
        description: "O varejo da colheita costuma quebrar pontas de ramos. Poda essas pontas estaladas para evitar a entrada de fungos da madeira.",
        proTip: "Corta sempre até à madeira branca e fresca, eliminando qualquer vestígio de necrose."
      },
      {
        step: 2,
        title: "Abertura Central da Taça",
        badge: "Estrutura",
        cut: "Ramos que fechem a copa e ladrões verticais sem gema de flor.",
        keep: "Estrutura em vaso iluminada.",
        description: "O pólen das amendoeiras é transportado pelas abelhas. Uma copa aberta facilita o voo e a polinização das flores no inverno.",
        proTip: "Mantém a árvore aberta para que o orvalho e as geadas da manhã evaporem rapidamente com os primeiros raios de sol."
      },
      {
        step: 3,
        title: "Conservação de Esporões Floríferos",
        badge: "Produção",
        cut: "Apenas ramos com excesso de concorrência.",
        keep: "Raminhos curtos enrugados com dezenas de botões redondos de flor.",
        description: "As amêndoas concentram-se em esporões de 2 a 3 anos. Poda apenas os prolongamentos excessivos.",
        proTip: "Aplica tratamento de inverno à base de cobre após a poda para prevenir a mancha-ocre (Polystigma fulvum)."
      }
    ]
  },

  poda_castanheiro: {
    id: "poda_castanheiro",
    title: "Castanheiro (Souto) - Formação e Limpeza Sanitária",
    diagramType: "heavy_branch_3cut",
    cutAngle: "Corte limpo com inclinação suave sem ferir o colar de cicatrização",
    cutHeight: "No bordo do anel de casca do tronco",
    tools: ["Motosserra de poda", "Serrote de poda de dente japonês", "Mástique protetor"],
    goldenRule: "O cancro do castanheiro (Cryphonectria parasitica) entra por feridas abertas: desinfeta a lâmina entre cada corte e nunca lasques a casca!",
    steps: [
      {
        step: 1,
        title: "Remoção de Ramos Secos ou com Cancro",
        badge: "Sanidade Urgente",
        cut: "Ramos com casca avermelhada fendida, ramos secos do topo (pontas secas) e pernadas mortas.",
        keep: "Madeira viçosa e folhagem verde profunda.",
        description: "Corta 10 a 15 cm ABAIXO da zona infectada com cancro, onde a madeira já esteja perfeitamente sã.",
        proTip: "Queima imediatamente a madeira cortada com cancro; nunca a deites na compostagem nem a deixes no souto."
      },
      {
        step: 2,
        title: "Técnica dos 3 Cortes para Ramos Pesados",
        badge: "Segurança & Cicatrização",
        cut: "Ramos inferiores grossos que impeçam a passagem de máquinas ou a apanha da castanha.",
        keep: "O colar e o anel de cicatrização do tronco intactos.",
        description: "Passo 1: corte por baixo a 20 cm do tronco; Passo 2: corte por cima a 25 cm para tombar o ramo; Passo 3: corte final rente ao colar.",
        proTip: "Sem esta técnica, o peso do ramo a cair rasga a casca do tronco até ao chão, criando uma ferida incurável."
      },
      {
        step: 3,
        title: "Selagem Imediata de Feridas",
        badge: "Proteção",
        cut: "Todas as rebarbas de casca.",
        keep: "Superfície tratada e impermeabilizada.",
        description: "Pinta generosamente todos os cortes com pasta fúngica ou pasta cicatrizante enriquecida com fungicida cúprico.",
        proTip: "Poda nos meses frios de pleno repouso vegetativo (dezembro a janeiro) em dias secos."
      }
    ]
  },

  poda_figueira: {
    id: "poda_figueira",
    title: "Figueira - Poda de Arejamento e Desponte",
    diagramType: "fig",
    cutAngle: "Bisel suave sobre um gomo lateral",
    cutHeight: "1 cm acima do nó",
    tools: ["Tesoura de poda", "Serrote para pernadas velhas", "Luvas de borracha"],
    goldenRule: "Atenção ao látex branco da figueira: é muito irritante e queima a pele em contacto com a luz solar. Usa sempre luvas e mangas compridas!",
    steps: [
      {
        step: 1,
        title: "Preservação de Ramos para Figos Lampos",
        badge: "Conhecimento da Espécie",
        cut: "Ramos que já deram figos de vindima no final do verão.",
        keep: "A extremidade dos ramos de 1 ano que guardam os botões dos figos lampos (que amadurecem em junho/são joão).",
        description: "Se desfolhares ou cortares todas as pontas dos ramos, eliminas por completo a primeira colheita de figos lampos da temporada.",
        proTip: "Se a tua figueira for unífera (só dá figos de setembro), podes encurtar mais; se for bífera (dá lampos e vindimos), preserva as pontas do ano anterior."
      },
      {
        step: 2,
        title: "Abertura do Centro e Limpeza de Ladrões",
        badge: "Estrutura",
        cut: "Ladrões vigorosos que nasçam do centro da figueira e ramos secos.",
        keep: "Ramos laterais ondulados e abertos em taça larga.",
        description: "A figueira cresce com formato horizontal aberto. O centro deve ficar desimpedido para permitir a circulação do ar e secagem da humidade matinal.",
        proTip: "Figueiras abertas e baixas facilitam a colheita dos figos sem necessidade de escadas arriscadas."
      },
      {
        step: 3,
        title: "Corte e Cicatrização",
        badge: "Proteção",
        cut: "Ramos que toquem no solo ou se cruzem.",
        keep: "Cortes bem orientados.",
        description: "A madeira da figueira é porosa e mole, com miolo esponjoso. Aplica sempre pasta cicatrizante nos cortes mais grossos.",
        proTip: "Poda no final do inverno (fevereiro), antes do aparecimento das primeiras folhas."
      }
    ]
  },

  // --- PEQUENOS FRUTOS ---
  poda_framboesa: {
    id: "poda_framboesa",
    title: "Framboeseiro - Poda de Renovação de Canas",
    diagramType: "bush_berries",
    cutAngle: "Corte horizontal ou bisel suave",
    cutHeight: "Rente ao solo (0 cm) nas canas velhas; 1 m a 1,20 m no desponte de canas novas",
    tools: ["Tesoura de poda bem afiada", "Luvas grossas contra espinhos"],
    goldenRule: "A cana de framboesa só vive 2 anos: depois de dar fruto, seca e morre. Corta todas as canas castanhas secas rente ao chão!",
    steps: [
      {
        step: 1,
        title: "Identificação: Remontante vs Não Remontante",
        badge: "Tipo de Variedade",
        cut: "Variedade não remontante: todas as canas secas que deram fruto no verão.",
        keep: "As canas verdes vigorosas nascidas nesta primavera.",
        description: "Nas variedades remontantes (dão fruto no outono e no verão seguinte), corta a ponta superior que frutificou no outono e deixa a parte inferior para o verão.",
        proTip: "Se tens uma variedade remontante e queres colheita única gigante no outono, podes ceifar todas as canas rente ao chão no inverno."
      },
      {
        step: 2,
        title: "Corte das Canas Secas Rente ao Solo",
        badge: "Renovação",
        cut: "Todas as canas castanhas, duras, gretadas e secas que já produziram.",
        keep: "Corte rente à terra sem deixar tocos que atraiam brocas.",
        description: "Corta ao nível do solo com a tesoura. As canas mortas apenas servem de abrigo para aranhiço vermelho e fungos.",
        proTip: "Puxa as canas cortadas com cuidado de entre os arames de condução para não estragar as folhas das canas jovens."
      },
      {
        step: 3,
        title: "Seleção e Amarração das Canas Jovens",
        badge: "Condução",
        cut: "Canas verdes fracas, tortas ou muito juntas.",
        keep: "6 a 8 canas fortes e vigorosas por cada metro linear de sebe.",
        description: "Desponta a ponta das canas a cerca de 1,20 m a 1,50 m para estimular a emissão de ramos laterais floríferos e amarra aos arames com ráfia.",
        proTip: "Mulching generoso de caruma de pinheiro ou palha na base protege as raízes superficiais das framboesas."
      }
    ]
  },

  poda_mirtilo: {
    id: "poda_mirtilo",
    title: "Mirtileiro - Poda de Arejamento e Renovação de Varas",
    diagramType: "bush_berries",
    cutAngle: "Bisel suave",
    cutHeight: "Rente à base do tufo",
    tools: ["Tesoura de poda", "Tesoura de duas mãos para ramos velhos da base"],
    goldenRule: "O mirtilo precisa de muita luz no interior do arbusto: ramos com mais de 4 a 5 anos perdem vigor e devem ser retirados na base para dar lugar a rebentos novos.",
    steps: [
      {
        step: 1,
        title: "Eliminação da Madeira Velha (> 4 anos)",
        badge: "Renovação",
        cut: "1 a 2 das canas mais velhas e grossas do centro do arbusto (têm casca cinzenta e rugosa e poucos rebentos).",
        keep: "Canas jovens de cor avermelhada ou verde viva de 1 a 3 anos.",
        description: "Ao remover as canas mais velhas na base, estimulas a emissão de novos rebentos basais vigorosos, mantendo o arbusto sempre jovem e altamente produtivo.",
        proTip: "Um arbusto equilibrado de mirtilo deve ter 2 canas de 1 ano, 2 de 2 anos, 2 de 3 anos e 2 de 4 anos."
      },
      {
        step: 2,
        title: "Limpeza de Ramos Baixos e Galhos Finos",
        badge: "Sanidade",
        cut: "Ramos que arrastam no chão, galhos finos e emaranhados do interior que não sustentem gemas gordas.",
        keep: "Ramos laterais com botões florais volumosos avermelhados nas pontas.",
        description: "Os mirtilos que se formam nos ramos inferiores tocam na terra e são devorados por caracóis. Levanta a saia do arbusto cerca de 25 cm.",
        proTip: "Os botões florais do mirtilo são arredondados e concentram-se na ponta dos ramos; as gemas vegetativas de folha são pontiagudas e nascem ao longo do caule."
      },
      {
        step: 3,
        title: "Desponte e Equilíbrio",
        badge: "Produção",
        cut: "Extremidades secas ou danificadas pelo frio de inverno.",
        keep: "Arbusto bem equilibrado e iluminado.",
        description: "Poda no final do inverno (fevereiro), antes do início do crescimento ativo primaveril.",
        proTip: "Mantém o solo ácido com casca de pinheiro e rega com água sem calcário."
      }
    ]
  },

  // --- ORNAMENTAIS E ARBUSTOS ---
  poda_roseira: {
    id: "poda_roseira",
    title: "Roseira de Jardim - Poda de Vaso em Bisel",
    diagramType: "rose_bush",
    cutAngle: "Bisel perfeito a 45° inclinado para o lado oposto à gema",
    cutHeight: "5 mm acima de uma gema vigorosa virada para o exterior",
    tools: ["Tesoura de poda de precisão bem afiada", "Luvas de roseira de couro de cano longo"],
    goldenRule: "Corta sempre 5 mm acima de uma gema virada para FORA da roseira com corte em bisel: isso abre a roseira em cálice e impede a água de escorrer para a gema.",
    steps: [
      {
        step: 1,
        title: "Limpeza das 4 Classes Proibidas",
        badge: "Sanidade",
        cut: "1. Madeira morta/seca; 2. Ramos doentes ou com manchas pretas; 3. Ramos que se cruzam no centro; 4. Rebentos ladrões que nasçam abaixo do ponto de enxerto.",
        keep: "Apenas caules verdes, fortes e saudáveis.",
        description: "Elimina tudo o que não seja madeira jovem e vigorosa. Os ladrões do porta-enxerto (abaixo do nó de enxerto) têm folhas diferentes e roubam a força toda à flor.",
        proTip: "Corta a madeira morta até veres o centro do caule completamente branco e sem anel castanho fúngico."
      },
      {
        step: 2,
        title: "Seleção de 3 a 5 Varas Mestras",
        badge: "Estrutura em Taça",
        cut: "Varas finas da grossura de palitos e varas velhas de casca cinzenta rachada.",
        keep: "3 a 5 varas principais robustas, da grossura de um dedo, dispostas em círculo como uma taça aberta.",
        description: "O centro da roseira deve ficar totalmente aberto para permitir a entrada de ar fresco. O ar em circulação impede o míldio e a ferrugem.",
        proTip: "Nas roseiras de canteiro (chá), reduz as varas para 3 a 5 gemas (cerca de 15 a 25 cm do solo); nas arbustivas, corta apenas 1/3 do comprimento."
      },
      {
        step: 3,
        title: "Execução do Corte em Bisel a 45°",
        badge: "Corte Perfeito",
        cut: "Corte oblíquo a 45° com inclinação descendente contrária à gema.",
        keep: "Distância exata de 5 mm acima do gomo.",
        description: "Se cortares muito rente, danificas a gema; se deixares toco comprido, a ponta apodrece; se cortares invertido, a chuva cai sobre o gomo e apodrece a nova rosa.",
        proTip: "Poda no final do inverno (fevereiro), antes do desborre das novas folhas."
      }
    ]
  },

  poda_hortensia: {
    id: "poda_hortensia",
    title: "Hortênsia - Poda Seletiva de Flores Velhas",
    diagramType: "hydrangea",
    cutAngle: "Corte horizontal limpo",
    cutHeight: "1 a 2 cm acima do primeiro par de gemas grossas abaixo da flor velha",
    tools: ["Tesoura de poda de jardim"],
    goldenRule: "Cuidado! As hortênsias dão flor nos ramos que cresceram no ano anterior: se cortares os ramos tenros que não deram flor, estás a deitar fora as flores deste ano!",
    steps: [
      {
        step: 1,
        title: "Corte das Flores Secas Antigas",
        badge: "Flores Velhas",
        cut: "As cabeças de flores secas do ano anterior.",
        keep: "O primeiro par de gemas volumosas situadas logo abaixo da flor velha.",
        description: "Segue a haste da flor velha para baixo e corta logo acima do primeiro par de gemas duplas bem gordinhas. Dali nascerão novas inflorescências espetaculares.",
        proTip: "Mantém as flores secas durante o inverno: elas servem de guarda-chuva protetor das gemas terminais contra as geadas fortes."
      },
      {
        step: 2,
        title: "Preservação dos Ramos Jovens Sem Flor",
        badge: "Futuras Flores",
        cut: "Não cortar os rebentos verdes direitos que não deram flor no ano passado.",
        keep: "Todas as hastes jovens e vigorosas intactas com gema apical gorda.",
        description: "Estas hastes jovens acumularam nutrientes durante o outono e trazem a gema floral de primavera na sua ponta terminal. Não lhes toques!",
        proTip: "Se os cortares rente ao chão, a hortênsia só dará folhagem verde e nenhuma flor durante toda a temporada."
      },
      {
        step: 3,
        title: "Rejuvenescimento de Ramos Velhos na Base",
        badge: "Arejamento",
        cut: "1 a 2 ramos velhos, acinzentados e muito lenhosos na base do tufo.",
        keep: "O centro do tufo arejado e livre de madeira morta.",
        description: "Em hortênsias adultas muito densas, cortar algumas varas velhas ao nível do solo estimula a emissão de novas hastes jovens.",
        proTip: "Poda no final do inverno (fevereiro a início de março), quando as gemas começam a inchar."
      }
    ]
  },

  poda_lavanda: {
    id: "poda_lavanda",
    title: "Alfazema (Lavanda) - Poda em Cúpula Arredondada",
    diagramType: "lavender",
    cutAngle: "Aparo suave em arco de meia-lua",
    cutHeight: "1/3 da folhagem verde; 2 a 3 cm acima da madeira velha castanha",
    tools: ["Tesoura de sebes ou tesoura de poda de duas mãos"],
    goldenRule: "REGRA SAGRADA DA ALFAZEMA: Nunca cortes na madeira velha castanha e nua! A lavanda não tem gemas latentes na madeira velha; se cortares aí, o ramo seca e morre para sempre.",
    steps: [
      {
        step: 1,
        title: "Aparo Pós-Floração de Verão",
        badge: "Flores Secas",
        cut: "Todas as hastes florais secas e cerca de 2 cm da ponta da folhagem verde.",
        keep: "O tufo compacto e sem espigões secos feios.",
        description: "Logo após o fim da floração de verão (julho/agosto), corta as espigas florais secas. Evita que a planta gaste energia a produzir sementes.",
        proTip: "Colhe as espigas quando as flores estiverem a abrir para secar e perfumar gavetas e afastar traças."
      },
      {
        step: 2,
        title: "Poda Estrutural de Primavera (Fevereiro/Março)",
        badge: "Formação em Bola",
        cut: "Cerca de 1/3 do crescimento verde do ano anterior.",
        keep: "Pelo menos 2 a 3 pares de folhas verdes em cada haste acima da parte lenhosa.",
        description: "Apara o arbusto em forma de cúpula esférica ou almofada arredondada. Isso impede que o centro abra e fique oco e desengonçado com o tempo.",
        proTip: "Olha bem para a base de cada ramo: deves ver sempre folhas verdes vivas abaixo da linha do teu corte."
      },
      {
        step: 3,
        title: "Limpeza de Ramos Quebrados ou Secos",
        badge: "Sanidade",
        cut: "Ramos que tenham apodrecido com excesso de água no inverno.",
        keep: "Solo bem drenado e muito sol.",
        description: "A alfazema adora sol pleno e terra seca e pedregosa. Retira qualquer galho podre na base sem mexer nos ramos sãos vizinhos.",
        proTip: "Nunca adubes a lavanda com azoto nem ponhas rega gota-a-gota frequente: solo pobre dá flores muito mais perfumadas!"
      }
    ]
  }
};

export const MONDA_SCHEMAS = {
  // --- RAÍZES E TUBÉRCULOS ---
  monda_cenoura: {
    id: "monda_cenoura",
    title: "Cenoura - Desbaste de Linha & Espaçamento Radicular",
    diagramType: "root_thinning",
    spacingCm: "4 a 5 cm",
    sowingRuler: [
      { cm: 0, label: "0" },
      { cm: 5, label: "5 cm", plant: true },
      { cm: 10, label: "10 cm", plant: true },
      { cm: 15, label: "15 cm", plant: true },
      { cm: 20, label: "20 cm", plant: true }
    ],
    techniqueRule: "Corta as plântulas excedentárias com tesoura afiada ao nível do solo ou puxa com calma em terra molhada; nunca arranques de solavanco!",
    goldenRule: "Se arrancares a plântula de solavanco, quebras os pelos radiculares da cenoura vizinha e ela crescerá bifurcada ou torta!",
    edibleBabyGreens: "As folhinhas e cenourinhas retiradas são comestíveis e deliciosas em saladas ou caldos verdes.",
    steps: [
      {
        step: 1,
        title: "1ª Monda (Plântulas com 3 a 5 cm de altura)",
        badge: "Primeiro Desbaste",
        remove: "Plântulas atrofiadas, com caule muito fino ou coladas umas às outras.",
        preserve: "Uma plântula vigorosa a cada 2 a 3 cm de intervalo.",
        description: "As sementes minúsculas de cenoura germinam juntas em tufos. Faz o primeiro desbaste cerca de 3 a 4 semanas após a sementeira.",
        proTip: "Rega o canteiro 1 hora antes da monda para o solo ficar macio e reduzir o atrito sobre as raízes."
      },
      {
        step: 2,
        title: "2ª Monda e Espaçamento Final",
        badge: "Espaçamento Perfeito",
        remove: "Exemplares intermédios até garantir a distância final recomendada.",
        preserve: "As melhores cenouras espaçadas de 4 a 5 cm na linha.",
        description: "Quando tiverem cerca de 10 cm de folhagem, faz o desbaste definitivo. As cenourinhas que retiras nesta fase já têm a grossura de um dedo e são uma iguaria na cozinha.",
        proTip: "Trabalha ao final do dia para que as plantas fiquem a noite inteira a recuperar do stress térmico."
      },
      {
        step: 3,
        title: "Aconchego da Terra e Defesa Contra a Mosca",
        badge: "Proteção Radicular",
        remove: "Folhagem esmagada deixada no chão (o cheiro a cenoura atrai a mosca-da-cenoura).",
        preserve: "Ombros da cenoura cobertos de terra.",
        description: "Achega terra solta ao redor do colo de cada cenoura. Se a parte superior da raiz apanhar sol, ganha cor verde e sabor amargo.",
        proTip: "Rega suavemente logo a seguir com crivo fino para assentar a terra ao redor das raízes remanescentes."
      }
    ]
  },

  monda_rabanete: {
    id: "monda_rabanete",
    title: "Rabanete - Desbaste Rápido para Bolbo Redondo",
    diagramType: "root_thinning",
    spacingCm: "3 a 4 cm",
    techniqueRule: "Monda precoce nos primeiros 10 a 14 dias; sem monda o rabanete não engrossa a raiz e espiga.",
    goldenRule: "O rabanete tem ciclo relâmpago (25 a 30 dias): se atrasares a monda mais de 2 semanas, o bolbo fica fibroso e oco.",
    edibleBabyGreens: "As plântulas de rabanete têm sabor picante idêntico ao agrião e são ótimas em sanduíches.",
    steps: [
      {
        step: 1,
        title: "Monda Precoce aos 10 Dias",
        badge: "Rapidez",
        remove: "Plântulas que estejam a menos de 2 cm da sua vizinha.",
        preserve: "O exemplar mais aprumado e com folhas arredondadas sãs.",
        description: "Logo que apareçam as 2 primeiras folhas verdadeiras, desbasta os tufos deixando 3 a 4 cm livres entre cada pé.",
        proTip: "Puxa verticalmente com o indicador e o polegar juntos à superfície da terra."
      },
      {
        step: 2,
        title: "Manutenção de Humidade Constante",
        badge: "Qualidade",
        remove: "Ervas infestantes minúsculas na entrelinha.",
        preserve: "Solo húmido e fofo.",
        description: "Rabanetes com espaço e humidade constante crescem estaladiços, doces e sem picante agressivo.",
        proTip: "Rega diária ligeira evita que a casca grete e rache."
      }
    ]
  },

  monda_beterraba: {
    id: "monda_beterraba",
    title: "Beterraba de Mesa - Separação dos Glomérulos Multigerme",
    diagramType: "root_thinning",
    spacingCm: "8 a 10 cm",
    techniqueRule: "Cada 'semente' de beterraba é na verdade um cacho (glomérulo) que dá 2 a 4 plantas juntas: a monda é obrigatória!",
    goldenRule: "Nunca deixes 2 pés de beterraba a nascer da mesma semente: se ficarem juntos, enrolam-se e não formam bolbo!",
    edibleBabyGreens: "As folhinhas vermelhas de monda são ricas em ferro e têm sabor idêntico ao espinafre.",
    steps: [
      {
        step: 1,
        title: "Desbaste dos Grupos de Germinação",
        badge: "Separação",
        remove: "1 a 3 plântulas de cada tufo de beterraba que brotou da mesma semente.",
        preserve: "Apenas 1 única plântula central vigorosa com caule vermelho vivo.",
        description: "Corta os pés fracos com a tesourinha à rente do solo quando tiverem 4 a 6 cm de altura.",
        proTip: "Se tiveres muito cuidado, as plântulas retiradas com raiz intacta podem ser repicadas noutro canteiro."
      },
      {
        step: 2,
        title: "Espaçamento Final para Bolbo Graúdo",
        badge: "Espaçamento",
        remove: "Pés intermédios com crescimento lento.",
        preserve: "8 a 10 cm de distância entre beterrabas na linha.",
        description: "Garante espaço para o bolbo expandir até aos 7 a 10 cm de diâmetro sem compressão lateral.",
        proTip: "Aplica cobertura morta entre as plantas para manter a terra fresca e impedir o aparecimento de infestantes."
      }
    ]
  },

  monda_nabo: {
    id: "monda_nabo",
    title: "Nabo e Nabiças - Monda Dupla para Folha e Raiz",
    diagramType: "root_thinning",
    spacingCm: "10 a 12 cm para nabos; 5 cm para nabiças",
    techniqueRule: "Colheita de desbaste: o que retiras na monda serve diretamente para a panela das nabiças.",
    goldenRule: "Aproveita o desbaste como colheita culinária contínua para caldos e cozidos.",
    edibleBabyGreens: "As nabiças de monda são a base mais saborosa da gastronomia tradicional.",
    steps: [
      {
        step: 1,
        title: "1ª Monda: Colheita de Nabiça Tenra",
        badge: "Colheita Culinária",
        remove: "Plântulas muito densas quando atingirem 10 cm de altura.",
        preserve: "Um pé a cada 5 cm.",
        description: "Faz o primeiro raleio lavando e aproveitando toda a rama arrancada para uma sopa reconfortante.",
        proTip: "Arranca pela raiz puxando suavemente após a rega da manhã."
      },
      {
        step: 2,
        title: "2ª Monda: Espaço para o Nabo Engrossar",
        badge: "Engrossamento",
        remove: "Plantas alternadas até atingir 10 a 12 cm de distância.",
        preserve: "Os pés com colo mais grosso e folhagem escura.",
        description: "O nabo precisa de espaço para desenvolver a raiz bulbosa branca e carnuda sem ficar fibroso ou amargo.",
        proTip: "Achega terra à volta da base para a raiz não apanhar sol direto e manter a carne branca."
      }
    ]
  },

  // --- FOLHAS E SALADAS ---
  monda_alface: {
    id: "monda_alface",
    title: "Alface de Canteiro - Raleio e Repicagem",
    diagramType: "leaf_greens",
    spacingCm: "25 a 30 cm",
    techniqueRule: "Transplante com torrão ou corte das menores; alface precisa de ar à volta para não apodrecer com podridão cinzenta.",
    goldenRule: "Nunca enterres o colo ou o coração da alface: o ponto onde as folhas se unem deve ficar rigorosamente à superfície do solo!",
    edibleBabyGreens: "As folhinhas retiradas formam a melhor salada baby leaf do canteiro.",
    steps: [
      {
        step: 1,
        title: "Monda em Alfobre ou Linha Direta",
        badge: "Seleção",
        remove: "Plântulas que fiquem coladas umas às outras com menos de 4 folhas.",
        preserve: "Pés compactos com raiz aprumada e caule curto e rijo (evita os estiolados compridos).",
        description: "Quando as alfaces tiverem 4 folhas verdadeiras, desbasta deixando apenas as mais atarracadas.",
        proTip: "Alfaces estioladas (com caule comprido e magro) tombarão com a rega e nunca formarão coração repolhudo."
      },
      {
        step: 2,
        title: "Distância Final para Formação de Coração",
        badge: "Espaço Vital",
        remove: "Exemplares excedentes (repicando para novo canteiro ou para a saladeira).",
        preserve: "25 cm de distância para alfaces frisadas e 30 cm para alfaces romanas ou de fechar repolho.",
        description: "Uma alface adulta precisa de quase 30 cm de diâmetro para que o ar circule e o sol atinja toda a folhagem.",
        proTip: "Rega a terra sem molhar o miolo central das folhas para prevenir míldio."
      }
    ]
  },

  monda_espinafre: {
    id: "monda_espinafre",
    title: "Espinafre Verdadeiro - Desbaste contra Espigamento",
    diagramType: "leaf_greens",
    spacingCm: "15 a 20 cm",
    techniqueRule: "Monda gradual: primeiro a 8 cm e depois a 15-20 cm; espaço amplo evita o espigamento prematuro de flor com calor.",
    goldenRule: "Espinafres apertados espigam e produzem flor com o primeiro calor primaveril: dá-lhes espaço fresco e arejado.",
    edibleBabyGreens: "As folhas jovens cruas são suculentas e ricas em ácido fólico.",
    steps: [
      {
        step: 1,
        title: "Desbaste Inicial das Plântulas",
        badge: "Raleio",
        remove: "Pés débeis quando surgirem 3 a 4 folhas verdadeiras.",
        preserve: "Uma distância de cerca de 8 cm entre plantas.",
        description: "Usa tesoura rente ao chão para não perturbar as raízes sensíveis dos espinafres vizinhos.",
        proTip: "O espinafre tem raiz aprumada delicada que detesta ser remexida."
      },
      {
        step: 2,
        title: "Espaçamento para Folhas Gigantes",
        badge: "Produção",
        remove: "Plantas alternadas quando as folhas começarem a tocar-se.",
        preserve: "15 a 20 cm de afastamento final.",
        description: "Com este espaçamento, o espinafre forma rosetas fartas e folhas grossas de verde escuro nutritivo.",
        proTip: "Colhe sempre as folhas exteriores, deixando o coração central a rebentar novas folhas durante semanas."
      }
    ]
  },

  monda_rucula: {
    id: "monda_rucula",
    title: "Rúcula - Desbaste Contínuo de Sebe",
    diagramType: "leaf_greens",
    spacingCm: "8 a 10 cm",
    techniqueRule: "Semear em linhas cerradas e fazer colheita de monda precoce.",
    goldenRule: "Monda a rúcula aos poucos: consome os rebentos jovens enquanto deixas os pés fortes crescerem.",
    edibleBabyGreens: "Rebentos jovens de rúcula têm sabor a noz com picante suave muito apetecível.",
    steps: [
      {
        step: 1,
        title: "Desbaste Rápido das Linhas Densas",
        badge: "Arejamento",
        remove: "Tufos densos quando as plantinhas tiverem 5 cm de altura.",
        preserve: "Pés espaçados de 4 a 5 cm na primeira volta.",
        description: "Rúcula aglomerada atrai pulga-da-terra (altica) que fura as folhas todas. O arejamento afasta esta praga.",
        proTip: "Polvilha cinza de lenha ou terra de diatomáceas sobre o canteiro após a monda para repelir a pulga-da-terra."
      },
      {
        step: 2,
        title: "Espaçamento Final",
        badge: "Tamanho",
        remove: "Pés que mostrem tendência para criar espigão de flor.",
        preserve: "Plantas vigorosas espaçadas de 8 a 10 cm.",
        description: "Permite que a rúcula forme tufos arbustivos densos que podem ser cortados 3 a 4 vezes ao longo da época.",
        proTip: "Corta a flor logo que desponte para manter as folhas tenras e doces."
      }
    ]
  },

  monda_acelga: {
    id: "monda_acelga",
    title: "Acelga de Penacho - Espaçamento para Pencas Largas",
    diagramType: "leaf_greens",
    spacingCm: "30 a 40 cm",
    techniqueRule: "Tal como a beterraba, a semente da acelga é multigerme e emite várias plântulas.",
    goldenRule: "A acelga cresce como um repolho gigante com pencas largas: precisa de pelo menos 35 cm de raio livre!",
    edibleBabyGreens: "Folhas jovens de monda substituem o espinafre com grande suavidade.",
    steps: [
      {
        step: 1,
        title: "Desbaste dos Glomérulos",
        badge: "Separação",
        remove: "As plântulas secundárias que nascem da mesma semente.",
        preserve: "O pé mais robusto de cada cova aos 10 cm de altura.",
        description: "Corta com tesoura para não descolar a raiz principal da planta seleccionada.",
        proTip: "Podes repicar os pés excedentes para vasos ou bordaduras da horta."
      },
      {
        step: 2,
        title: "Espaçamento Amplo Final",
        badge: "Vigor",
        remove: "Pés que fiquem a menos de 30 cm de distância.",
        preserve: "30 a 40 cm entre plantas vigorosas.",
        description: "Uma acelga bem espaçada produz talos brancos ou vermelhos de 5 a 8 cm de largura durante mais de 8 meses seguidos.",
        proTip: "Colheita folha a folha pelo exterior prolonga a produção durante todo o ano."
      }
    ]
  },

  // --- ALLIUM ---
  monda_alho: {
    id: "monda_alho",
    title: "Alho - Eliminação de Rebentos Duplos & Corte do Espigão Floral",
    diagramType: "allium",
    spacingCm: "10 a 15 cm",
    techniqueRule: "Se um dente de alho lançar 2 caules, arranca o mais fino; no início do verão, corta o mangote (espigão floral).",
    goldenRule: "CORTA O ESPIGÃO FLORAL (mangote): se deixares o alho dar flor, a cabeça subterrânea perde até metade do peso e não engorda!",
    edibleBabyGreens: "O espigão floral tenro do alho é uma delícia salteado com azeite ou em ovos mexidos.",
    steps: [
      {
        step: 1,
        title: "Eliminação de Caules Duplos",
        badge: "Calibre do Bolbo",
        remove: "O rebento secundário se um dente de alho bifurcar na base.",
        preserve: "1 único caule grosso e vigoroso por planta.",
        description: "Se mantiveres dois caules, terás duas meias-cabeças de alho achatadas e miúdas.",
        proTip: "Arranca o caule mais fraco segurando a base com os dois dedos para não levantar o bolbo principal."
      },
      {
        step: 2,
        title: "Monda Rigorosa de Ervas Daninhas",
        badge: "Limpeza da Linha",
        remove: "Todas as ervas infestantes que cresçam entre os alhos.",
        preserve: "Solo limpo e solto ao redor das hastes.",
        description: "O alho tem folhas estreitas e raízes curtas: não suporta a concorrência de ervas daninhas por água e nutrientes.",
        proTip: "Monda as ervas superficialmente com sacho para não ferir as raízes dos alhos."
      },
      {
        step: 3,
        title: "Corte do Mangote (Espigão Floral)",
        badge: "Operação Crítica",
        remove: "A haste central cilíndrica de flor assim que ela comece a enrolar em curva.",
        preserve: "Todas as folhas laterais achatadas.",
        description: "Ao cortar o mangote, toda a seiva e energia que iria produzir sementes é canalizada para o enchimento dos dentes de alho.",
        proTip: "Corta num dia seco com tesourinha a cerca de 2 cm acima da última folha."
      }
    ]
  },

  monda_alho_porro: {
    id: "monda_alho_porro",
    title: "Alho-francês - Desbaste no Alfobre & Amontoa de Branqueamento",
    diagramType: "allium",
    spacingCm: "15 cm entre plantas; 30 cm entre linhas",
    techniqueRule: "Desbaste precoce no alfobre para atingir a grossura de um lápis antes do transplante definitivo.",
    goldenRule: "Planta fundo e faz amontoas sucessivas de terra ao longo do caule para obteres a parte branca comprida e tenra.",
    edibleBabyGreens: "Plântulas retiradas dão sabor subtil a cebolinho em sopas.",
    steps: [
      {
        step: 1,
        title: "Desbaste das Mudas em Alfobre",
        badge: "Grossura de Lápis",
        remove: "Mudas finas como fios de cabelo.",
        preserve: "Mudas espaçadas de 3 cm para engordarem o pé.",
        description: "Um alho-francês semeado muito denso fica fino e fraco. O desbaste garante mudas com diâmetro de lápis prontas a transplantar.",
        proTip: "Ao transplantar, apara 1/3 da raiz e 1/3 das folhas para estimular o rápido pegamento no terreno."
      },
      {
        step: 2,
        title: "Espaçamento e Amontoa na Linha",
        badge: "Branqueamento",
        remove: "Ervas infestantes da entrelinha.",
        preserve: "15 cm entre plantas na vala.",
        description: "À medida que o alho-francês cresce, vai puxando terra para o caule para o proteger da luz e torná-lo branco e doce.",
        proTip: "Não deixes entrar terra dentro da bainha das folhas durante a amontoa para não ficar areia na sopa."
      }
    ]
  },

  monda_cebola: {
    id: "monda_cebola",
    title: "Cebola - Raleio de Linha & Corte de Hastes Florais",
    diagramType: "allium",
    spacingCm: "10 a 12 cm para conserva/fresca; 15 cm para cebola de guardar",
    techniqueRule: "Monda precoce de pés germinados juntos e corte imediato de qualquer haste floral que desponte.",
    goldenRule: "Se a cebola espigar e florir, o centro da cebola fica lenhoso e duro e a cebola apodrece na arrecadação!",
    edibleBabyGreens: "Cebolinhas novas de monda com rama verde são o melhor tempero para saladas de tomate.",
    steps: [
      {
        step: 1,
        title: "Desbaste da Sementeira Direta",
        badge: "Espaçamento",
        remove: "Pés colados até garantir 10 a 15 cm de distância entre cebolas.",
        preserve: "O pé mais aprumado e forte.",
        description: "Se as cebolas ficarem encostadas, ficam pequenas e deformadas em formato de meia-lua.",
        proTip: "Aproveita os pés arrancados como cebolo fresco para consumo diário imediato."
      },
      {
        step: 2,
        title: "Descalçar o Bolbo (Fim de Primavera)",
        badge: "Maturação",
        remove: "A terra que tapa os ombros superiores da cebola.",
        preserve: "O bolbo a crescer à superfície sobre o solo.",
        description: "Ao contrário do alho-francês, a cebola NÃO gosta de terra tapada sobre o bulbo; deve apanhar sol direto para secar as túnicas exteriores.",
        proTip: "Quando 2/3 da rama secar e tombar para o chão (cebola 'dobrada'), suspende as regas para preparar a colheita."
      }
    ]
  },

  // --- SOLANÁCEAS ---
  monda_tomateiro: {
    id: "monda_tomateiro",
    title: "Tomateiro - Desladroamento de Axilas a 45° & Desfolha",
    diagramType: "solanaceae_sucker",
    techniqueRule: "Remove os rebentos axilares ('ladrões') quando tiverem entre 3 a 5 cm, dobrando com o polegar num dia ensolarado.",
    goldenRule: "Desladroa sempre em dias de sol e com a folhagem seca: a ferida cicatriza em poucas horas e não apanha míldio nem bactérias!",
    steps: [
      {
        step: 1,
        title: "Identificação Anatómica do Ladrão Axilar",
        badge: "Anatomia a 45°",
        remove: "O rebento que nasce no ângulo de 45° entre o caule principal vertical e o pecíolo da folha horizontal.",
        preserve: "O caule principal com os cachos de flor e a folha de suporte.",
        description: "O ladrão axilar parece um novo tomateiro a brotar da 'axila' da folha. Se o deixares crescer, rouba nutrientes e transforma o tomateiro num matagal sem tomates graúdos.",
        proTip: "Não deixes o ladrão passar dos 5 a 7 cm: quanto mais pequeno, mais limpa é a quebra e menor a ferida."
      },
      {
        step: 2,
        title: "Técnica de Torção Manual sem Ferramenta",
        badge: "Técnica do Polegar",
        remove: "Dobra o ladrão com o polegar e o indicador para a esquerda e para a direita até partir com um estalido seco.",
        preserve: "A casca do caule principal sem rasgão.",
        description: "Fazer o desladroamento à mão com dedos limpos transmite menos vírus e bactérias do que usar lâminas de tesoura contaminadas.",
        proTip: "Ladrões de 10 cm com folhas podem ser enraizados em copos de água e geram novos tomateiros clones em 7 dias!"
      },
      {
        step: 3,
        title: "Desfolha Sanitária Inferior",
        badge: "Arejamento e Prevenção",
        remove: "Todas as folhas inferiores que toquem no chão ou fiquem abaixo do primeiro cacho de tomates.",
        preserve: "A folhagem superior acima dos cachos em maturação.",
        description: "A terra salpicada pela rega nas folhas baixas é a via número um de contaminação por míldio e alternariose.",
        proTip: "Retira no máximo 2 a 3 folhas por semana para não provocar choque na planta."
      },
      {
        step: 4,
        title: "Desponta Apical no Final da Época",
        badge: "Maturação Final",
        remove: "O ápice do tomateiro acima do 5º ou 6º cacho de flores no final do verão.",
        preserve: "Os tomates já formados para amadurecerem antes do frio de outono.",
        description: "Flores tardias de setembro nunca chegarão a ser tomates maduros. Corta o topo para forçar os verdes a ficarem vermelhos.",
        proTip: "Deixa sempre 2 folhas acima do último cacho para manter a circulação de seiva."
      }
    ]
  },

  monda_pimenteiro: {
    id: "monda_pimenteiro",
    title: "Pimenteiro - Desbaste da Flor 'Rainha' & Ramos Baixos",
    diagramType: "solanaceae_sucker",
    techniqueRule: "Remove a primeira flor central (flor da coroa/rainha) e limpa os ramos abaixo da primeira bifurcação em 'Y'.",
    goldenRule: "Retira a primeira flor que nasce na primeira bifurcação em 'Y': isso dobra a produção futura de pimentos no resto da planta!",
    steps: [
      {
        step: 1,
        title: "Corte da Flor 'Rainha' Central",
        badge: "Dobrar Produção",
        remove: "A flor ou pequeno pimento solitário que desponta exatamente no centro da primeira bifurcação em 'V' ou 'Y'.",
        preserve: "As duas ramificações laterais que sobem a partir desse ponto.",
        description: "Se deixares a primeira flor dar fruto, o pimenteiro estagna o crescimento vegetativo e dá apenas 1 ou 2 pimentos. Retirando-a, a planta ramifica em força e dá mais de 10 pimentos.",
        proTip: "Remove a flor com as unhas logo que o botão esteja visível."
      },
      {
        step: 2,
        title: "Limpeza da Haste Abaixo do 'Y'",
        badge: "Levantamento da Saia",
        remove: "Folhas e rebentos ladrões que nasçam no caule principal abaixo da bifurcação em 'Y'.",
        preserve: "O tronco inferior perfeitamente limpo e arejado até 20 cm de altura.",
        description: "Mantém a base limpa para permitir que a luz solar e o ar sequem o solo ao redor do colo.",
        proTip: "Previne o ataque de caracóis e reduz o risco de murchidão bacteriana."
      },
      {
        step: 3,
        title: "Monda Seletiva de Frutos Deformados",
        badge: "Calibre",
        remove: "Pimentos com ponta necrosada (falta de cálcio/podridão apical) ou deformados.",
        preserve: "Frutos viçosos e perfeitos.",
        description: "Descarrega a planta de frutos imperfeitos para que ela envie água e cálcio para os pimentos sãos.",
        proTip: "Mantém regas regulares e consistentes para evitar o 'fundo preto' (podridão apical) nos pimentos."
      }
    ]
  },

  monda_beringela: {
    id: "monda_beringela",
    title: "Beringela - Condução a 2-3 Hastes & Raleio de Flores",
    diagramType: "solanaceae_sucker",
    techniqueRule: "Conduzir a planta com 2 a 3 hastes fortes e retirar folhas que façam sombra cerrada sobre as flores.",
    goldenRule: "Deixa no máximo 4 a 6 frutos grandes por planta de beringela para que atinjam calibre comercial sem quebrar as hastes.",
    steps: [
      {
        step: 1,
        title: "Condução e Remoção de Ladrões Baixos",
        badge: "Estrutura",
        remove: "Rebentos da base do tronco e ladrões secundários em excesso.",
        preserve: "2 a 3 hastes principais vigorosas que sobem da primeira bifurcação.",
        description: "A beringela tem caules pesados e quebradiços. Conduzir a 2 hastes amarradas a estacas evita que a planta tombe com o vento.",
        proTip: "Amarra as hastes principais a uma estaca forte com fitas largas que não estrangulem a casca."
      },
      {
        step: 2,
        title: "Monda de Flores nos Tufos",
        badge: "Seleção Floral",
        remove: "As flores menores e secundárias nos tufos onde nascem 2 ou 3 flores juntas.",
        preserve: "A flor principal grande com pedúnculo espesso.",
        description: "Garante que cada cacho floral produza apenas uma única beringela grande, perfeita e brilhante.",
        proTip: "Flores secundárias geram beringelas anãs que roubam força desnecessária à planta."
      },
      {
        step: 3,
        title: "Desfolha Suave de Luz",
        badge: "Cor e Brilho",
        remove: "Folhas gigantes que fiquem coladas diretamente sobre as beringelas em crescimento.",
        preserve: "A folhagem geral que faz a fotossíntese.",
        description: "A beringela precisa de calor e luz direta para desenvolver a casca roxa escura brilhante rica em antioxidantes.",
        proTip: "Usa tesoura limpa para cortar o pecíolo da folha a 1 cm do caule."
      }
    ]
  },

  // --- CUCURBITÁCEAS ---
  monda_curgete: {
    id: "monda_curgete",
    title: "Curgete - Remoção de Folhas Velhas & Frutos Abortados",
    diagramType: "cucurbit_trail",
    techniqueRule: "Corta as folhas inferiores doentes ou com oídio na base do pecíolo oco; retira frutos amarelecidos na ponta.",
    goldenRule: "Frutos de curgete que fiquem amarelos e moles na ponta sofreram de falta de polinização: corta-os logo para não apodrecerem na planta!",
    edibleBabyGreens: "As flores masculinas de curgete (em haste longa sem fruto na base) são uma iguaria recheadas ou fritas em polme.",
    steps: [
      {
        step: 1,
        title: "Corte das Folhas Baixas Velhas",
        badge: "Sanidade e Oídio",
        remove: "Folhas inferiores que toquem na terra, folhas com manchas brancas de oídio e folhas amarelecidas.",
        preserve: "A coroa superior de folhas viçosas com botões novos.",
        description: "O pecíolo da folha de curgete é comprido e oco. Corta a 3 cm do caule principal com tesoura limpa. Permite que o sol bata no caule e evita pragas.",
        proTip: "Retira 2 a 3 folhas velhas sempre que colheres uma curgete nova."
      },
      {
        step: 2,
        title: "Eliminação de Frutos Abortados",
        badge: "Prevenção de Podridão",
        remove: "Curgetes pequenas que comecem a afunilar, secar ou ficar amarelas na extremidade.",
        preserve: "Curgetes verdes brilhantes de crescimento diário vigoroso.",
        description: "Curgetes mal polinizadas pelas abelhas apodrecem a partir da flor. Remove-as imediatamente antes que o fungo atinja o caule principal.",
        proTip: "Colhe as curgetes jovens com 15 a 20 cm de comprimento; quanto mais colhes, mais a planta produz!"
      }
    ]
  },

  monda_abobora: {
    id: "monda_abobora",
    title: "Abóbora - Desponta da Rama Guia & Monda de Frutos",
    diagramType: "cucurbit_trail",
    techniqueRule: "Desponta a rama principal após a 4ª folha para criar ramos laterais; deixa 2 a 3 abóboras por planta.",
    goldenRule: "Corta a ponta da guia 2 folhas à frente da abóbora selecionada: isso fecha o circuito e força a seiva a engordar a abóbora!",
    steps: [
      {
        step: 1,
        title: "Desponta da Guia Principal",
        badge: "Ramificação Fértil",
        remove: "A ponta de crescimento apical da rama guia logo que ela atinja 4 a 5 folhas verdadeiras.",
        preserve: "Os ramos secundários que vão nascer das axilas das folhas.",
        description: "A rama principal das abóboras produz quase exclusivamente flores masculinas. Os ramos secundários e terciários é que trazem as flores femininas com abóbora na base.",
        proTip: "Corta a ponta com as unhas num dia quente e seco."
      },
      {
        step: 2,
        title: "Seleção dos Melhores Frutos",
        badge: "Calibre Gigante",
        remove: "Abóboras tardias, deformadas ou em excesso (deixa no máximo 2 a 3 abóboras por pé).",
        preserve: "As primeiras abóboras bem polinizadas e com pedúnculo forte.",
        description: "Se deixares 8 abóboras na mesma planta, nenhuma chegará a um tamanho decente. O raleio garante abóboras doces e de polpa grossa.",
        proTip: "Coloca uma tábua de madeira ou telha debaixo de cada abóbora para a isolar da terra húmida e evitar que apodreça por baixo."
      },
      {
        step: 3,
        title: "Desponta 2 Folhas Após o Fruto",
        badge: "Condução Final",
        remove: "O prolongamento da rama que segue além da abóbora.",
        preserve: "2 folhas adultas à frente da abóbora para puxarem a seiva.",
        description: "Impede que a rama continue a correr pelo quintal fora sem limites e concentra toda a produção no enchimento da fruta.",
        proTip: "Aterra alguns nós da rama com terra para formarem raízes adventícias secundárias que alimentam o fruto."
      }
    ]
  },

  monda_melao: {
    id: "monda_melao",
    title: "Melão e Melancia - Poda de Desponta em 3 Tempos & Monda de Frutos",
    diagramType: "cucurbit_trail",
    techniqueRule: "Poda clássica: desponta a haste principal na 3ª folha; desponta as 2 ramas secundárias na 4ª folha; deixa 2 a 4 melões por planta.",
    goldenRule: "O melão só floresce com flores femininas nas ramas de 3ª ordem: a desponta é indispensável para teres melões doces!",
    steps: [
      {
        step: 1,
        title: "1ª Desponta (Haste Principal)",
        badge: "1º Tempo",
        remove: "O olho apical da planta acima da 3ª ou 4ª folha verdadeira.",
        preserve: "As 3 a 4 folhas da base.",
        description: "Desta primeira poda nascem rapidamente duas ramas laterais vigorosas (ramas de 2ª ordem).",
        proTip: "Faz esta primeira desponta quando a plântula tiver cerca de 15 cm no canteiro."
      },
      {
        step: 2,
        title: "2ª Desponta (Ramas Secundárias)",
        badge: "2º Tempo",
        remove: "O olho apical de cada um dos ramos secundários após a 3ª folha.",
        preserve: "Os rebentos de 3ª ordem que despontam das axilas.",
        description: "É nestes ramos terciários que surgem as flores femininas com o pequeno melãozinho na base da flor amarela.",
        proTip: "Não podes com as mãos húmidas para não propagar bacteriose."
      },
      {
        step: 3,
        title: "Monda Seletiva de Melões",
        badge: "Doçura e Calibre",
        remove: "Melõezinhos em excesso que surjam no final da rama.",
        preserve: "Apenas 2 a 4 melões perfeitos por planta (1 por rama).",
        description: "Corta a rama 1 ou 2 folhas à frente do melão fixado. Garante açúcar concentrado e aroma espetacular no verão.",
        proTip: "Suspende a rega nos últimos 10 dias antes da colheita para o melão concentrar os açúcares e não estalar a casca."
      }
    ]
  },

  // --- CEREAIS E LEGUMINOSAS ---
  monda_milho: {
    id: "monda_milho",
    title: "Milho Doce e Grão - Desbaste a 1 Pé por Golpe & Eliminação de Afilhos",
    diagramType: "legume_cereal",
    spacingCm: "20 a 25 cm na linha; 70 cm entre linhas",
    techniqueRule: "Semear 2 a 3 sementes por golpe e deixar apenas 1 planta dominante; eliminar afilhos da base do colmo.",
    goldenRule: "Planta sempre em blocos de 3 a 4 linhas curtas paralelas (nunca em linha única comprida): o milho é polinizado pelo vento!",
    steps: [
      {
        step: 1,
        title: "Monda do Golpe (Desbaste Precoce)",
        badge: "1 Pé por Cova",
        remove: "As 1 ou 2 plântulas mais fracas de cada covinha de sementeira.",
        preserve: "O pé mais grosso, direito e com folhas verde-escuras aos 10 a 15 cm de altura.",
        description: "Se deixares 2 ou 3 pés de milho na mesma cova, competem por luz e água e dão maçarocas pequenas com falhas de grãos.",
        proTip: "Corta o pé descartado pela base em vez de arrancar para não desalojar as raízes adventícias do irmão."
      },
      {
        step: 2,
        title: "Eliminação de Afilhos ('Filhotes' da Base)",
        badge: "Concentração na Espiga",
        remove: "Rebentos laterais secundários que brotem rente ao solo na base do colmo principal.",
        preserve: "O colmo principal único que sustenta a bandeira (flor masculina no topo) e as barbas da espiga.",
        description: "Estes afilhos raramente dão espiga aproveitável e consomem azoto precioso.",
        proTip: "Achega terra à volta da base do milho (amontoa) quando tiver meio metro para fortalecer contra tombamento pelo vento."
      }
    ]
  },

  monda_favas: {
    id: "monda_favas",
    title: "Favas e Ervilhas - Monda de Ervas & Desponta Apical contra Pulgão",
    diagramType: "legume_cereal",
    spacingCm: "15 a 20 cm entre plantas; 40 a 50 cm entre linhas",
    techniqueRule: "Monda manual de ervas no inverno e corte dos 10 cm do topo da fava na primavera após 5-6 andares de flores.",
    goldenRule: "A DESPONTA DO TOPO DA FAVA É MILAGROSA: o pulgão-negro só ataca as folhas tenras da ponta; cortando o topo, erradicas a praga sem químicos!",
    edibleBabyGreens: "As pontas tenras despontadas das favas são um vegetal excecional salteadas com azeite e alho.",
    steps: [
      {
        step: 1,
        title: "Monda de Infestantes de Inverno",
        badge: "Limpeza Inicial",
        remove: "Ervas daninhas que sufocam o canteiro nascido no outono/inverno.",
        preserve: "Linhas de favas espaçadas de 15 a 20 cm.",
        description: "O inverno traz ervas rasteiras competitivas. Uma sachadela cuidadosa areja as raízes e melhora a fixação de azoto pelos nódulos de Rhizobium.",
        proTip: "Não sachas muito fundo para não cortar as raízes superficiais das favas."
      },
      {
        step: 2,
        title: "Desponta Apical da Primavera (Topping)",
        badge: "Guerra ao Pulgão",
        remove: "Os últimos 5 a 10 cm do cimo da planta quando tiver 5 a 6 andares de vagens formadas.",
        preserve: "Todos os andares inferiores com vagens em crescimento.",
        description: "O pulgão-negro (Aphis fabae) instala-se exclusivamente no ponteiro tenro do topo da fava. Ao cortar a ponta, eliminas o alimento da praga e a seiva vai toda para as vagens inferiores.",
        proTip: "As pontas de fava colhidas são deliciosas cozinhadas como espargos verdes!"
      }
    ]
  },

  // --- BRÁSSICAS ---
  monda_couve: {
    id: "monda_couve",
    title: "Couves e Repolhos - Seleção Rigorosa de Mudas & Amontoa",
    diagramType: "brassica",
    spacingCm: "40 a 50 cm para couve-galega/coração; 60 cm para repolhos grandes",
    techniqueRule: "Desbaste no alfobre eliminando pés compridos e estiolados; seleção de pés com pé grosso e sem nós na raiz.",
    goldenRule: "Nunca plantes couves de caule fino e comprido ('pernaltas'): tombarão com o vento e não fecham repolho nem toleram lagartas!",
    steps: [
      {
        step: 1,
        title: "Seleção no Alfobre (Descarte dos Pés Fracos)",
        badge: "Triagem de Ouro",
        remove: "Mudas compridas, finas, curvadas ou com nódulos suspeitos na raiz (hérnia da couve).",
        preserve: "Mudas atarracadas, com caule grosso, nó curto e 4 folhas verde-escuras impecáveis.",
        description: "A qualidade da couve adulta decide-se nos primeiros 30 dias de vida no alfobre. Rejeita sem piedade qualquer muda raquítica.",
        proTip: "Se a raiz tiver bolotas ou inchaços anormais, deita fora: é sinal de hérnia da couve que contamina o solo durante 10 anos."
      },
      {
        step: 2,
        title: "Transplante Fundo e Espaçamento Amplo",
        badge: "Fixação e Vigor",
        remove: "Ervas infestantes vizinhas.",
        preserve: "Pelo menos 50 cm de distância entre plantas.",
        description: "Enterra a muda de couve até ao nível das primeiras folhas. O caule enterrado emitirá novas raízes adicionais para sustentar o peso da couve.",
        proTip: "Faz uma amontoa de terra ao redor do pé 3 semanas após a plantação para dar ancoragem contra vendavais de outono."
      }
    ]
  },

  // --- ERVAS AROMÁTICAS ---
  monda_salsa: {
    id: "monda_salsa",
    title: "Salsa e Coentros - Desbaste de Tufos & Corte Contínuo",
    diagramType: "leaf_greens",
    spacingCm: "10 a 15 cm entre tufos",
    techniqueRule: "Desbaste manual dos pés em excesso aos 5 cm de altura; colheita pelas hastes exteriores sem ferir o centro.",
    goldenRule: "Nunca cortes a salsa cortando o tufo todo pela raiz: colhe haste a haste pelo exterior para rebentar o ano inteiro!",
    edibleBabyGreens: "Toda a salsa e coentros de monda tem sabor super aromático e deve ir logo para a sopa.",
    steps: [
      {
        step: 1,
        title: "Monda dos Tufos Aglomerados",
        badge: "Arejamento",
        remove: "Plântulas coladas em demasia quando atingirem 4 a 6 cm.",
        preserve: "Pequenos tufos vigorosos espaçados de 10 cm.",
        description: "A salsa demora quase 4 semanas a germinar e nasce em tapete fechado. O desbaste permite que cada pé desenvolva caules compridos e folhas fartas.",
        proTip: "Rega antes da monda para puxar os pezinhos suavemente pelas folhas sem partir as raízes dos vizinhos."
      },
      {
        step: 2,
        title: "Colheita Correta de Renovação",
        badge: "Corte Exterior",
        remove: "As hastes mais velhas e compridas da bordadura exterior do tufo.",
        preserve: "O coração central com as folhas novas minúsculas a brotar.",
        description: "A salsa renova-se a partir do centro. Se respeitares o coração, um canteiro de salsa produz folhagem fresca durante mais de 12 meses.",
        proTip: "Se a salsa começar a espigar para flor no segundo ano, corta o espigão central ou deixa dar flor para atrair abelhas e joaninhas benéficas."
      }
    ]
  },

  monda_manjericao: {
    id: "monda_manjericao",
    title: "Manjericão - Beliscão Apical ('Topping') & Corte de Botões Florais",
    diagramType: "herb_pinch",
    spacingCm: "20 a 25 cm",
    techniqueRule: "Fazer o beliscão (corte das pontas com os dedos) acima do 4º par de folhas; cortar qualquer botão floral imediatamente.",
    goldenRule: "O BELISCÃO DUPLICA O MANJERICÃO: cada vez que beliscas a ponta do ramo, nascem 2 ramos laterais novos, transformando a planta num arbusto denso e redondo!",
    edibleBabyGreens: "As pontas beliscadas têm o aroma mais concentrado e perfumado para fazer pesto.",
    steps: [
      {
        step: 1,
        title: "Desbaste de Mudas e Espaçamento",
        badge: "Espaço",
        remove: "Mudas débeis ou coladas a menos de 15 cm.",
        preserve: "Plantas fortes espaçadas de 20 a 25 cm.",
        description: "O manjericão sofre imenso com fungos foliares se estiver plantado apertado sem circulação de ar.",
        proTip: "Rega a terra junto ao solo sem molhar a folhagem para evitar manchas castanhas."
      },
      {
        step: 2,
        title: "O Beliscão Apical ('Topping')",
        badge: "Ramificação Arbustiva",
        remove: "A ponta terminal do caule principal, cortando logo acima do 4º par de folhas verdadeiras.",
        preserve: "As duas pequenas gemas que estão a espreitar na axila das folhas de baixo.",
        description: "Quebra a dominância apical. A seiva que ia para a ponta é forçada a entrar nas duas gemas laterais, que formam dois ramos novos vigorosos.",
        proTip: "Repete o beliscão nas pontas desses ramos secundários 3 semanas depois para quadruplicar a produção de folhas!"
      },
      {
        step: 3,
        title: "Guerra Imediata aos Botões de Flor",
        badge: "Conservação do Sabor",
        remove: "Qualquer espiga de flor que comece a formar pequenos botões no topo.",
        preserve: "Folhas tenras e aromáticas.",
        description: "Assim que o manjericão floresce, as folhas ficam rijas, amargas e perdem os óleos essenciais. Corta as flores mal as vejas!",
        proTip: "Usa as unhas para beliscar os botões florais num segundo."
      }
    ]
  }
};
