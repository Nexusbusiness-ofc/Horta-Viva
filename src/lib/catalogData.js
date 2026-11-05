// Catálogo completo enriquecido de Animais, Cogumelos, Podas e Mondas
// Todas as imagens apontam para fotografias locais fiáveis em /images/...

export const DEFAULT_ANIMALS = [
  // --- AVES ---
  {
    id: "animal_galinhas",
    name: "Galinhas Poedeiras",
    scientific_name: "Gallus gallus domesticus",
    emoji: "🐔",
    color: "#c2410c",
    image_url: "./images/animals/galinha.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "0.5 m² no galinheiro por ave e 2 a 4 m² em parque exterior vedado.",
    daily_effort: "Baixo",
    where_to_keep: "Galinheiro seco e ventilado, com poleiros altos, ninhos confortáveis e proteção contra raposas e doninhas.",
    how_to_keep: "Recolha diária de ovos, água limpa sempre fresca e reposição periódica de palha ou serradura seca na cama.",
    care: "Desparasitação regular externa e interna, controlo de piolho vermelho e arejamento sem correntes de ar frias.",
    feeding: "Ração de postura equilibrada, milho partido, sobras de hortaliça e casca de ostra moída para cálcio.",
    feed_items: "Milho partido, ração de postura, folhas de couve, casca de ostra triturada, restos de horta",
    treatment: "Vacinação em jovens, suplementos vitamínicos na muda da pena e acesso a terra ou cinza para banhos de pó.",
    what_they_do: "Produzem ovos frescos todos os dias, fornecem estrume rico em azoto (galinhaça) para composto e limpam restos de culturas.",
    special_info: "Uma galinha saudável põe em média 250 a 300 ovos por ano em condições ideais de luz e alimentação."
  },
  {
    id: "animal_galo",
    name: "Galo Reprodutor",
    scientific_name: "Gallus gallus domesticus",
    emoji: "🐓",
    color: "#ea580c",
    image_url: "./images/animals/galo.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "Mesmo espaço do galinheiro; 1 galo para cada 8 a 12 galinhas.",
    daily_effort: "Baixo",
    where_to_keep: "Junto do bando de galinhas no galinheiro principal com poleiro dominante.",
    how_to_keep: "Evitar manter mais de um galo no mesmo espaço para evitar disputas territoriais agressivas.",
    care: "Aparar esporões se ficarem demasiado compridos para não ferir as galinhas durante a cobrição.",
    feeding: "Mesma alimentação das galinhas, com reforço de sementes e cereais energéticos.",
    feed_items: "Mistura de cereais (trigo, cevada e milho), verduras frescas e suplemento mineral",
    treatment: "Inspeção de esporões e desparasitação idêntica à do galinheiro.",
    what_they_do: "Protege e alerta o bando contra predadores, fertiliza os ovos para incubação e mantém a harmonia hierárquica do bando.",
    special_info: "O canto do galo serve para marcar território e tranquilizar as fêmeas logo ao amanhecer."
  },
  {
    id: "animal_patos",
    name: "Patos Domésticos",
    scientific_name: "Anas platyrhynchos domesticus",
    emoji: "🦆",
    color: "#0284c7",
    image_url: "./images/animals/pato.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "Parque amplo com tanque, bacia grande ou charco de água rasa.",
    daily_effort: "Médio",
    where_to_keep: "Abrigo térreo bem fechado à noite e terreno com relva e água durante o dia.",
    how_to_keep: "Obrigatório ter água funda o suficiente para mergulharem o bico e limparem as narinas e olhos.",
    care: "Excelente resistência natural a doenças; necessitam de chão sempre seco no ninho para dormir.",
    feeding: "Cereais (trigo e milho moído), forragem verde, e pequenos invertebrados da horta.",
    feed_items: "Milho triturado, trigo em grão, verduras frescas, caracóis e lesmas",
    treatment: "Acesso a água limpa permanente para prevenção de infeções oculares.",
    what_they_do: "Excelente controlo biológico de pragas (comem caracóis e lesmas vorazmente sem estragar as raízes como as galinhas).",
    special_info: "Os ovos de pata são mais ricos em gorduras e proteínas, sendo muito apreciados para pastelaria e pão-de-ló tradicional."
  },
  {
    id: "animal_gansos",
    name: "Gansos de Guarda",
    scientific_name: "Anser anser domesticus",
    emoji: "🪿",
    color: "#059669",
    image_url: "./images/animals/ganso.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "Parque exterior com boa cobertura vegetal e acesso a ponto de água.",
    daily_effort: "Baixo",
    where_to_keep: "Cercado amplo com erva abundante; abrigo simples coberto para a noite.",
    how_to_keep: "Gostam de viver em casais ou pequenos grupos; territoriais e muito vigilantes.",
    care: "Aves rústicas que raramente adoecem. Apenas exigem pasto limpo e água fresca.",
    feeding: "Essencialmente herbívoros: pastam relva fresca, trevo, dente-de-leão e cereais suplementares no inverno.",
    feed_items: "Pasto verde fresco, trigo, aveia, milho no inverno",
    treatment: "Desparasitação anual e proteção contra humidade excessiva nos ninhos.",
    what_they_do: "São excelentes cães de guarda naturais da quinta (fazem alarme sonoro a qualquer intruso) e cortadores de relva ecológicos.",
    special_info: "Os romanos usavam gansos sagrados para guardar o Capitólio devido ao seu sono leve e alarme ruidoso."
  },
  {
    id: "animal_perus",
    name: "Perus de Campo",
    scientific_name: "Meleagris gallopavo",
    emoji: "🦃",
    color: "#854d0e",
    image_url: "./images/animals/peru.jpg",
    category: "Aves",
    difficulty: "Média",
    space_needed: "Área aberta de pelo menos 6 m² por ave e poleiros robustos.",
    daily_effort: "Médio",
    where_to_keep: "Pavilhão seco, ventilado e sem correntes de ar frias.",
    how_to_keep: "Comedouros suspensos limpos; solo seco forrado a palha grossa.",
    care: "Muito sensíveis à humidade nas primeiras 8 semanas de vida; manter longe de galinhas para evitar a 'cabeça negra' (histomoníase).",
    feeding: "Ração de alto teor proteico nos jovens, grãos de milho, aveia e verduras na fase adulta.",
    feed_items: "Ração de engorda, milho partido, aveia, luzerna e couves",
    treatment: "Controlo de coccidiose em pintos e desparasitação periódica.",
    what_they_do: "Produção de carne magra de alta qualidade e limpeza de lagartas e gafanhotos em pomares e soutos.",
    special_info: "Têm audição apurada e vocalizam em coro a qualquer barulho súbito."
  },
  {
    id: "animal_codornizes",
    name: "Codornizes",
    scientific_name: "Coturnix japonica",
    emoji: "🐦",
    color: "#a16207",
    image_url: "./images/animals/codorniz.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "Gaiolas ou módulos com 0.15 a 0.2 m² por ave (ideais para quintas com pouco espaço).",
    daily_effort: "Baixo",
    where_to_keep: "Módulos de rede elevados protegidos da chuva, ratos e correntes de ar.",
    how_to_keep: "Piso ligeiramente inclinado para rolamento suave dos ovos e recolha fácil.",
    care: "Manter temperatura amena e luminosidade de 14h/dia para postura constante.",
    feeding: "Ração própria de codorniz poedeira rica em proteína (20-22%) e cálcio fino.",
    feed_items: "Ração específica para codorniz, sementes finas de painço, verduras picadas",
    treatment: "Higiene rigorosa do tabuleiro de dejetos a cada 2 dias.",
    what_they_do: "Iniciam a postura logo às 6 semanas de vida; ovos densos em nutrientes, ferro e vitaminas.",
    special_info: "Cinco ovos de codorniz equivalem em peso a um ovo de galinha, mas têm significativamente mais fósforo e vitaminas B."
  },
  {
    id: "animal_pintadas",
    name: "Galinhas-d'angola (Pintadas)",
    scientific_name: "Numida meleagris",
    emoji: "🪶",
    color: "#475569",
    image_url: "./images/animals/pintada.jpg",
    category: "Aves",
    difficulty: "Média",
    space_needed: "Terreno amplo e arborizado; gostam de liberdade de movimentos.",
    daily_effort: "Baixo",
    where_to_keep: "Empoleiram-se em árvores altas ou em telheiros bem elevados à noite.",
    how_to_keep: "São aves semi-selvagens que preferem forragear sozinhas pelos olivais e campos.",
    care: "Rústicas e imunes à maioria das maleitas normais de galinheiro.",
    feeding: "Milho, sementes silvestres e enorme quantidade de carraças, formigas e insetos.",
    feed_items: "Milho, trigo, insetos apanhados no campo, verduras",
    treatment: "Apenas abrigo seco em dias de tempestade forte no inverno.",
    what_they_do: "Inimigas número um das carraças no campo; caçam cobras pequenas e avisam com gritos estridentes a presença de intrusos.",
    special_info: "Em zonas rurais de Portugal são tradição como 'sentinelas' de propriedades contra répteis e parasitas."
  },

  // --- COELHOS ---
  {
    id: "animal_coelhos",
    name: "Coelhos da Quinta",
    scientific_name: "Oryctolagus cuniculus",
    emoji: "🐰",
    color: "#78716c",
    image_url: "./images/animals/coelho.jpg",
    category: "Coelhos",
    difficulty: "Fácil",
    space_needed: "Coelheiras individuais ou parques de chão de 1 a 2 m² por exemplar.",
    daily_effort: "Baixo",
    where_to_keep: "Coelheira abrigada do calor direto no verão, da humidade e de predadores.",
    how_to_keep: "Feno de prado sempre disponível no comedouro para digestão e desgaste dos dentes incisivos.",
    care: "Limpeza regular de estrumeiras e bebedouros de pipeta automáticos com água fresca.",
    feeding: "80% feno de qualidade, 15% ração granulada e 5% verduras fibrosas (folhas de cenoura, chicória, salsa).",
    feed_items: "Feno de montanha, ração em pellets, folhas de cenoura, raminhos de oliveira ou macieira",
    treatment: "Vacina anual contra Mixomatose e Doença Hemorrágica Viral (DHV).",
    what_they_do: "Produzem o famoso 'estrume frio' de coelho, o melhor adubo biológico direto para hortaliças e flores (não queima as raízes).",
    special_info: "O estrume de coelho não precisa de meses de fermentação: pode ser misturado imediatamente na terra dos canteiros."
  },
  {
    id: "animal_coelho_flandres",
    name: "Coelho Gigante de Flandres",
    scientific_name: "Oryctolagus cuniculus domesticus",
    emoji: "🐇",
    color: "#57534e",
    image_url: "./images/animals/coelho_flandres.jpg",
    category: "Coelhos",
    difficulty: "Média",
    space_needed: "Coelheira extragrande (mínimo 2 a 3 m²) com piso suave para proteger as patas traseiras.",
    daily_effort: "Médio",
    where_to_keep: "Piso plano e forrado a palha grossa para evitar pododermatite (chagas nas patas).",
    how_to_keep: "Animal muito dócil e calmo; tolera muito bem a interação humana e crianças.",
    care: "Atenção ao excesso de peso e ao calor no pico do verão (muito sensíveis a golpes de calor).",
    feeding: "Grandes quantidades de feno fresco, forragem verde e ração rica em fibras.",
    feed_items: "Feno de prado em abundância, alfafa, cenoura com ramas, ração de coelho",
    treatment: "Vacinação anual e controlo de peso.",
    what_they_do: "Excelente animal para pequenas explorações familiares de carne ou quinta pedagógica pelo porte impressionante.",
    special_info: "Podem atingir entre 7 a 10 kg de peso e mais de 80 cm de comprimento total."
  },
  {
    id: "animal_coelho_anao",
    name: "Coelho Anão",
    scientific_name: "Oryctolagus cuniculus",
    emoji: "🐇",
    color: "#a8a29e",
    image_url: "./images/animals/coelho_anao.jpg",
    category: "Coelhos",
    difficulty: "Fácil",
    space_needed: "Gaiola espaçosa de pelo menos 100 x 50 cm ou cercadinho de interior/jardim.",
    daily_effort: "Baixo",
    where_to_keep: "Local calmo, protegido de ventos fortes e calor excessivo.",
    how_to_keep: "Enriquecimento com túneis e blocos de madeira natural não tratada para roer.",
    care: "Escovagem semanal na muda do pelo para evitar bolas de pelo no estômago.",
    feeding: "Feno de capim de alta qualidade, pequenas porções de verduras frescas e pellets sem cereais.",
    feed_items: "Feno aromático de montanha, folhas de dente-de-leão, salsa, hortelã, pellets próprios",
    treatment: "Vacinação contra DHV-1 e DHV-2.",
    what_they_do: "Ideal para quintas familiares pedagógicas, lazer e companhia dócil.",
    special_info: "Um coelho anão adulto pesa habitualmente entre 1 a 1.5 kg."
  },

  // --- CAPRINOS ---
  {
    id: "animal_cabras_leite",
    name: "Cabras Serranas e Leiteiras",
    scientific_name: "Capra hircus",
    emoji: "🐐",
    color: "#b45309",
    image_url: "./images/animals/cabra.jpg",
    category: "Caprinos",
    difficulty: "Média",
    space_needed: "Cercado exterior com rede forte (mínimo 1.30 m) e estábulo seco de 2 m² por cabeça.",
    daily_effort: "Médio",
    where_to_keep: "Aprisco bem arejado com solo seco e cama de palha limpa; odeiam pisos húmidos e chuva.",
    how_to_keep: "Cercas robustas porque são curiosas e sobem a qualquer sítio; colocar troncos ou pedras para treparem.",
    care: "Aparar cascos trimestralmente e manter desparasitação interna e externa em dia.",
    feeding: "Arbustos, tojos, giestas, silvas, feno de luzerna e cevada ou milho na ordenha.",
    feed_items: "Mato mediterrânico, feno de luzerna, palha de cevada, milho triturado, pedra de sal com minerais",
    treatment: "Vacina contra enterotoxémia e desparasitante pós-parto.",
    what_they_do: "Produzem leite de excelente qualidade para queijos tradicionais e limpam mato com extrema eficácia contra incêndios.",
    special_info: "As cabras conseguem digerir plantas espinhosas e silvas que outros animais recusam comer."
  },
  {
    id: "animal_cabras_anas",
    name: "Cabras Anãs",
    scientific_name: "Capra hircus",
    emoji: "🐐",
    color: "#d97706",
    image_url: "./images/animals/cabra_ana.jpg",
    category: "Caprinos",
    difficulty: "Fácil",
    space_needed: "Pequeno cercado de 50 a 100 m² para 2 a 3 animais e abrigo coberto.",
    daily_effort: "Baixo",
    where_to_keep: "Casinha de madeira elevada do chão com rampa de acesso e cercadinho seguro.",
    how_to_keep: "Devem ser mantidas em pares (são animais muito gregários que entram em depressão sozinhos).",
    care: "Corte de cascos regular e abrigo 100% seco.",
    feeding: "Feno de boa qualidade, folhas de oliveira, ramos de árvores de fruto e suplemento de cereais.",
    feed_items: "Feno de prado, raminhos de poda de oliveira, cenouras, maçãs em pedaços, sal mineral",
    treatment: "Desparasitação semestral.",
    what_they_do: "Excelentes para limpeza de quintas e pomares pequenos, animais de companhia excecionais e atração pedagógica.",
    special_info: "Muito brincalhonas e afeitas ao dono, reconhecem o nome e adoram carinho."
  },

  // --- OVINOS ---
  {
    id: "animal_ovelhas",
    name: "Ovelhas de Pasto (Churra)",
    scientific_name: "Ovis aries",
    emoji: "🐑",
    color: "#65a30d",
    image_url: "./images/animals/ovelha.jpg",
    category: "Ovinos",
    difficulty: "Fácil",
    space_needed: "Pastagem natural de 500 a 1000 m² por cabeça e aprisco para as noites frias.",
    daily_effort: "Médio",
    where_to_keep: "Aprisco seco com manjedouras limpas e acesso diário a pasto cercado.",
    how_to_keep: "Maneio em rebanho rotacional para permitir a regeneração da erva dos cercados.",
    care: "Tosquia anual na primavera (maio/junho), corte de unhas e desparasitação contra ténias e fascíola.",
    feeding: "Erva de pasto, feno de trevo e luzerna no outono/inverno e cereais na fase final de gestação.",
    feed_items: "Erva fresca de prado, feno de azevém, farelo de trigo, cevada e bloco de sal mineral",
    treatment: "Vacinação contra basculho (enterotoxémia) e banhos desparasitantes contra sarna.",
    what_they_do: "Produzem lã natural, leite para queijo de ovelha curado, mantêm os prados podados e fertilizam o solo uniformemente.",
    special_info: "A saliva das ovelhas contém enzimas que estimulam o crescimento radicular das gramíneas quando pastam."
  },
  {
    id: "animal_carneiro",
    name: "Carneiro Reprodutor",
    scientific_name: "Ovis aries",
    emoji: "🐏",
    color: "#4d7c0f",
    image_url: "./images/animals/carneiro.jpg",
    category: "Ovinos",
    difficulty: "Média",
    space_needed: "Mesma área do rebanho; proporção de 1 carneiro para cada 25 a 35 ovelhas.",
    daily_effort: "Médio",
    where_to_keep: "Junto do rebanho na época de cobrição e em cercado próprio se for necessário separar.",
    how_to_keep: "Maneio calmo e seguro; atenção à força dos cornos e investidas na época de cio das fêmeas.",
    care: "Inspeção dos cascos e verificação periódica da condição corporal antes da época reprodutiva.",
    feeding: "Reforço proteico e vitamínico semanas antes da cobrição para garantir máxima fertilidade.",
    feed_items: "Feno de primeira qualidade, grãos de aveia, cevada e minerais ricos em fósforo",
    treatment: "Desparasitação antes de juntar às fêmeas.",
    what_they_do: "Garante a renovação genética e nascimentos anuais de borregos com vigor e rusticidade.",
    special_info: "Possui olfato apurado que deteta a fertilidade das ovelhas a dezenas de metros de distância."
  },

  // --- SUÍNOS ---
  {
    id: "animal_porco_alentejano",
    name: "Porco Alentejano / Ibérico",
    scientific_name: "Sus scrofa domesticus",
    emoji: "🐖",
    color: "#a16207",
    image_url: "./images/animals/porco_alentejano.jpg",
    category: "Suínos",
    difficulty: "Média",
    space_needed: "Parque exterior extenso de montado com azinheiras e sobreiros ou terreno cercado reforçado.",
    daily_effort: "Médio",
    where_to_keep: "Malhada ou pocilga com zona coberta para dormir e amplo parque de terra para focinhar.",
    how_to_keep: "Cerca elétrica ou rede grossa rente ao chão (os porcos têm enorme força no focinho e levantam redes soltas).",
    care: "Zona de lama no verão para banhos (não transpiram e precisam de lama para regular a temperatura e proteger a pele de parasitas).",
    feeding: "Bolotas de azinho e sobro no outono (montanheira), cereais moídos, favas, abóboras e pasto verde.",
    feed_items: "Bolota, milho moído, farelo de trigo, couves, maçãs caídas, abóboras",
    treatment: "Vacinação oficial obrigatória contra doença de Aujeszky e desparasitação.",
    what_they_do: "Transformam sobras vegetais em carne e enchidos da mais alta qualidade gastronómica e preparam a terra fofando o solo.",
    special_info: "A carne de porco de montanheira tem gordura infiltrada rica em ácido oleico, saudável como o azeite virgem."
  },
  {
    id: "animal_porco_bisaro",
    name: "Porco Bísaro e Leitões",
    scientific_name: "Sus scrofa domesticus",
    emoji: "🐖",
    color: "#c2410c",
    image_url: "./images/animals/porco_bisaro.jpg",
    category: "Suínos",
    difficulty: "Média",
    space_needed: "Pocilga com maternidade de 8 m² e parque exterior de exercício.",
    daily_effort: "Médio",
    where_to_keep: "Instalação com barras de proteção nos cantos da maternidade para não esmagar os leitões ao deitar.",
    how_to_keep: "Cama abundante de palha seca e limpa, renovada diariamente para os leitões recém-nascidos.",
    care: "Lâmpada de calor infravermelha nas duas primeiras semanas de vida dos leitões.",
    feeding: "Ração de porca lactante, beterraba forrageira, castanhas no norte do país e abóboras.",
    feed_items: "Castanhas, batata cozida, abóbora amarela, farinhas de cereais e forragem verde",
    treatment: "Suplemento de ferro injectável nos leitões ao terceiro dia de vida.",
    what_they_do: "Raça autóctone portuguesa dócil de orelhas descaídas, ideal para produção familiar de leitão e fumeiro regional.",
    special_info: "O porco Bísaro é uma das raças mais antigas da Península Ibérica, típica de Trás-os-Montes e Minho."
  },

  // --- BOVINOS ---
  {
    id: "animal_vacas_leite",
    name: "Vacas Leiteiras (Frísia / Holstein)",
    scientific_name: "Bos taurus",
    emoji: "🐄",
    color: "#1e293b",
    image_url: "./images/animals/vaca_leiteira.jpg",
    category: "Bovinos",
    difficulty: "Difícil",
    space_needed: "Pasto de 2000 a 4000 m² por animal e estábulo com cubículo individual confortável.",
    daily_effort: "Alto",
    where_to_keep: "Estábulo com boa ventilação, piso anti-derrapante e bebedouros de nível constante.",
    how_to_keep: "Horários de ordenha rigorosos duas vezes por dia com higiene absoluta de tetinas e canecas.",
    care: "Desinfeção pós-ordenha (selagem de tetos) para prevenir mastites e corte de unhas regular.",
    feeding: "Silagem de milho, feno de azevém de primeiro corte e ração balanceada conforme a produção leiteira diária.",
    feed_items: "Silagem de milho, feno de azevém, luzerna em rama, farinha de soja e milho, pedra de sal mineral",
    treatment: "Desparasitantes na secagem e controlo reprodutivo por veterinário.",
    what_they_do: "Produzem entre 25 a 40 litros de leite fresco por dia e produzem grande volume de estrume para biogás e adubo.",
    special_info: "Uma vaca leiteira de alta produção bebe entre 100 a 150 litros de água fresca diariamente."
  },
  {
    id: "animal_vacas_carne",
    name: "Vacas Autóctones (Barrosã / Maronesa)",
    scientific_name: "Bos taurus",
    emoji: "🐂",
    color: "#78350f",
    image_url: "./images/animals/vaca_barrosa.jpg",
    category: "Bovinos",
    difficulty: "Média",
    space_needed: "Pastagens de montanha ou soutos amplos em regime semi-extensivo.",
    daily_effort: "Médio",
    where_to_keep: "Abrigo rústico de pedra ou madeira para os meses rigorosos de neve e chuva.",
    how_to_keep: "Aproveitamento direto de pastagens de serra e ladeiras íngremes inacessíveis a máquinas.",
    care: "Vacas extraordinariamente rústicas, de parto fácil sem necessidade de auxílio humano.",
    feeding: "Erva de lameiro, feno de prado de montanha, palha e folhas de carvalho e castanheiro.",
    feed_items: "Pasto de lameiro, feno de montanha, farinha de milho regional na engorda",
    treatment: "Profilaxia oficial e vacinações obrigatórias da DGAV.",
    what_they_do: "Preservação da paisagem contra mato inflamável, carne com denominação de origem protegida (DOP) de excelência.",
    special_info: "A raça Barrosã tem cornos majestosos em forma de lira e uma força de tração histórica incomparável."
  },

  // --- EQUÍDEOS ---
  {
    id: "animal_burro_miranda",
    name: "Burro de Miranda (Burro Mirandês)",
    scientific_name: "Equus asinus",
    emoji: "🫏",
    color: "#52525b",
    image_url: "./images/animals/burro.jpg",
    category: "Equídeos",
    difficulty: "Fácil",
    space_needed: "Paddock ou pasto de 1000 m² por animal e estrebaria seca e arejada.",
    daily_effort: "Baixo",
    where_to_keep: "Estrebaria com solo forrado a palha grossa; não toleram humidade permanente nos cascos.",
    how_to_keep: "Escovagem frequente para limpar o pelo comprido e lanoso característico da raça mirandesa.",
    care: "Aparar cascos a cada 6 a 8 semanas com ferrador experiente; nunca deixar cascos compridos demais.",
    feeding: "Dieta rica em fibra e pobre em açúcares: palha de cevada, feno de prado e pouco cereal para não causar laminite.",
    feed_items: "Palha limpa de cevada, feno seco de montanha, raminhos de amoreira e bloco mineral",
    treatment: "Vacinação anual contra tétano e gripe equina; desparasitação oral em pasta.",
    what_they_do: "Trabalho agrícola ligeiro na horta, tração em charrua tradicional, asnoterapia e excelente companhia dócil.",
    special_info: "O Burro de Miranda é uma raça autóctone portuguesa protegida, famosa pela sua docilidade extrema com crianças."
  },
  {
    id: "animal_cavalo_lusitano",
    name: "Cavalo Lusitano",
    scientific_name: "Equus caballus",
    emoji: "🐎",
    color: "#3f3f46",
    image_url: "./images/animals/cavalo.jpg",
    category: "Equídeos",
    difficulty: "Difícil",
    space_needed: "Boxe individual de 3.5 x 3.5 m e picadeiro ou campo cercado para exercício diário.",
    daily_effort: "Alto",
    where_to_keep: "Cocheira limpa diariamente, com boa ventilação e sem poeiras irritantes para as vias respiratórias.",
    how_to_keep: "Exercício físico diário indispensável para a saúde articular, muscular e mental do cavalo.",
    care: "Limpeza diária de cascos antes e depois do trabalho, ferragem mensal e escovagem de crina e cauda.",
    feeding: "Feno de excelente qualidade distribuído 3 vezes por dia, aveia ou ração equilibrada e água limpa e fresca.",
    feed_items: "Feno de prado de primeiro corte, aveia laminada, cenouras, farelo molhado e sal",
    treatment: "Vacinação contra tétano, gripe equina, desparasitação programada e controlo dentário anual.",
    what_they_do: "O cavalo de sela mais antigo do mundo, extraordinário para maneio de gado no campo, equitação e trabalho de tração.",
    special_info: "O Puro Sangue Lusitano é mundialmente aclamado pela sua coragem, nobreza de caráter e lealdade ao cavaleiro."
  },
  {
    id: "animal_garrano",
    name: "Pónei / Cavalo Garrano",
    scientific_name: "Equus caballus",
    emoji: "🐴",
    color: "#713f12",
    image_url: "./images/animals/garrano.jpg",
    category: "Equídeos",
    difficulty: "Média",
    space_needed: "Pasto de montanha ou cercado natural com abrigo rústico.",
    daily_effort: "Médio",
    where_to_keep: "Pasto amplo de encosta; são muito ágeis a subir e descer terrenos acidentados do Gerês.",
    how_to_keep: "Vivem bem em liberdade parcial ou no quintal familiar com espaço aberto.",
    care: "Cascos riquíssimos e resistentes que raramente precisam de ferraduras.",
    feeding: "Alimentação simples à base de pasto natural, feno e tojos jovens.",
    feed_items: "Erva de montanha, feno seco, maçãs e palha",
    treatment: "Desparasitação regular e chipagem obrigatória.",
    what_they_do: "Pequenos trabalhos de tração na horta, sela para jovens e preservação ecológica dos baldios florestais.",
    special_info: "O Garrano sobreviveu desde o Paleolítico no norte de Portugal e é resistente aos predadores selvagens como o lobo."
  },

  // --- APICULTURA ---
  {
    id: "animal_abelhas",
    name: "Abelhas Melíferas (Apis mellifera)",
    scientific_name: "Apis mellifera iberiensis",
    emoji: "🐝",
    color: "#ca8a04",
    image_url: "./images/animals/abelha.jpg",
    category: "Apicultura",
    difficulty: "Média",
    space_needed: "Colmeia modelo Langstroth ou Reversible instalada a mais de 50 metros de caminhos públicos.",
    daily_effort: "Baixo",
    where_to_keep: "Apiário virado a nascente/sul, protegido dos ventos frios do norte e com boa exposição solar.",
    how_to_keep: "Visitas de maneio quinzenais na primavera para evitar enxameação e colocar alças melíferas.",
    care: "Uso obrigatório de fato completo de apicultor com máscara e fumigador para acalmar as abelhas nas inspeções.",
    feeding: "Autossuficientes: recolhem néctar e pólen das flores num raio de 3 km. Fornecer xarope de açúcar no inverno se escassear mel.",
    feed_items: "Flores da horta e pomar (alecrim, tomilho, rosmaninho, laranjeira, trevo), xarope estimulante 1:1 na pré-primavera",
    treatment: "Tratamento outonal rigoroso contra o ácaro Varroa destructor homologado pela DGAV.",
    what_they_do: "Polinizam mais de 75% das plantas da horta e árvores do pomar, multiplicando a colheita de fruta, além de produzirem mel e própolis.",
    special_info: "Para produzir 1 kg de mel puro, as abelhas de uma colmeia visitam cerca de 4 a 5 milhões de flores."
  },
  {
    id: "animal_colmeia",
    name: "Colmeia e Apiário",
    scientific_name: "Apis mellifera",
    emoji: "🍯",
    color: "#eab308",
    image_url: "./images/animals/colmeia.jpg",
    category: "Apicultura",
    difficulty: "Média",
    space_needed: "Espaço para 2 a 5 colmeias dispostas em linha com suporte elevado do solo a 30-40 cm.",
    daily_effort: "Baixo",
    where_to_keep: "Terreno abrigado com ponto de água limpa por perto para as abelhas beberem.",
    how_to_keep: "Revisão regular de quadros de criação da rainha e colocação de cera moldada limpa.",
    care: "Prevenção da vespa asiática (velutina) com armadilhas seletivas e grelhas de entrada estreitas.",
    feeding: "Pasta proteica de candi no fim do inverno para arranque forte da postura da rainha.",
    feed_items: "Candi proteico, cera de abelha pura esterilizada, água limpa com flutuadores",
    treatment: "Desinfeção com maçarico das caixas e quadros vazios entre temporadas.",
    what_they_do: "Gera mel puro centrifugado, cera de abelha para velas e pomadas ecológicas, própolis e pólen apícola fresco.",
    special_info: "Uma colmeia saudável e forte alberga entre 50.000 a 80.000 abelhas operárias no auge da primavera."
  },

  // --- GUARDA E COMPANHIA / PASTOS ---
  {
    id: "animal_cao_guarda",
    name: "Cão de Guarda de Gado / Pastor",
    scientific_name: "Canis lupus familiaris",
    emoji: "🐕",
    color: "#b45309",
    image_url: "./images/animals/cao_guarda.jpg",
    category: "Guarda & Pastoreio",
    difficulty: "Média",
    space_needed: "Área ampla de quinta ou cercado de pasto com casota térmica e protegida da chuva e do vento.",
    daily_effort: "Médio",
    where_to_keep: "Junto ao rebanho, galinheiro ou perímetro da quinta; raças autóctones como Cão de Gado Transmontano, Rafeiro do Alentejo ou Pastor da Serra da Estrela.",
    how_to_keep: "Socialização precoce com as ovelhas, cabras e aves para criar instinto de proteção natural e afeto pelos animais da quinta.",
    care: "Escovagem periódica de pelo, inspeção de carrapatos e pulgas após passagens por mato e silvados, e banho quando necessário.",
    feeding: "Ração de alta energia e qualidade para cães de porte grande ou trabalho de campo, complementada com caldos de carne e osso carnudo.",
    feed_items: "Ração seca equilibrada de alta energia, carne cozida/crua fresca, ossos recreativos grandes, água limpa em abundância",
    treatment: "Vacinação antirrábica e polivalente em dia, desparasitação interna trimestral e desparasitação externa contínua.",
    what_they_do: "Guardião incorruptível contra predadores (raposas, javalis, doninhas e lobos), patrulha noturna e proteção leal da família e rebanho.",
    special_info: "As raças portuguesas de gado têm um instinto protetor ancestral: não atacam o rebanho, mas formam uma barreira inexpugnável perante ameaças."
  },
  {
    id: "animal_gato_quinta",
    name: "Gato da Quinta (Caçador de Roedores)",
    scientific_name: "Felis catus",
    emoji: "🐈",
    color: "#ea580c",
    image_url: "./images/animals/gato_quinta.jpg",
    category: "Guarda & Pastoreio",
    difficulty: "Fácil",
    space_needed: "Acesso livre a palheiros, celeiros, espigueiros, garagens e arrecadações de cereais.",
    daily_effort: "Baixo",
    where_to_keep: "Abrigo seco e quente no palheiro ou alpendre, com caixa de areia ou acesso livre ao exterior.",
    how_to_keep: "Esterilização fundamental para evitar sobrepopulação descontrolada e mantê-los saudáveis e focados na caça territorial.",
    care: "Desparasitação preventiva essencial, pois consomem pequenas presas no campo que transmitem parasitas internos.",
    feeding: "Ração seca sempre disponível para manter vigor físico (um gato bem alimentado caça melhor por puro instinto predatório).",
    feed_items: "Ração de manutenção para gatos, água fresca diária e sobras de peixe ou carne cozida ocasional",
    treatment: "Vacinação anual contra panleucopenia e coriza, desparasitação interna regular a cada 2 meses e coleira desparasitante.",
    what_they_do: "Controlo biológico implacável de ratos, ratazanas e toupeiras nos armazéns de grão, evitando estragos em colheitas e cabos elétricos.",
    special_info: "A presença e o odor de um gato na quinta é suficiente para afugentar a maioria dos roedores das áreas de armazenamento de sementes."
  },
  {
    id: "animal_alpaca",
    name: "Alpaca da Quinta (Lã e Guarda)",
    scientific_name: "Vicugna pacos",
    emoji: "🦙",
    color: "#a16207",
    image_url: "./images/animals/alpaca.jpg",
    category: "Guarda & Pastoreio",
    difficulty: "Média",
    space_needed: "Pasto verde vedado de pelo menos 1000 m² para duas alpacas (são animais gregários que nunca devem viver isolados).",
    daily_effort: "Médio",
    where_to_keep: "Prado com abrigo rústico de três paredes para proteção contra sol forte e geadas de inverno.",
    how_to_keep: "São animais muito pacíficos e dóceis; pastam sem arrancar a raiz da relva graças aos seus lábios almofadados.",
    care: "Tosquia anual na primavera para recolher a fibra valiosa e corte regular das unhas das patas.",
    feeding: "Pasto de boa qualidade, feno de prado de montanha e suplemento vitamínico com selénio e zinco para camelídeos.",
    feed_items: "Feno de erva de primeira colheita, pasto fresco, maçãs em fatias e bloco de sal mineral com zinco",
    treatment: "Vacinação anual contra clostridiose e desparasitação orientada por análise coprológica.",
    what_they_do: "Guardiãs naturais fantásticas de rebanhos de ovelhas contra raposas e cães errantes, e produtoras de uma das lãs mais finas, leves e hipoalergénicas do mundo.",
    special_info: "O estrume de alpaca é 'frio', rico em potássio e pode ser aplicado diretamente nas plantas da horta sem queimar as raízes!"
  },

  // --- AVES COMPLEMENTARES ---
  {
    id: "animal_pombos",
    name: "Pombos de Pombal / Pombo Correio",
    scientific_name: "Columba livia domestica",
    emoji: "🕊️",
    color: "#64748b",
    image_url: "./images/animals/pombo.jpg",
    category: "Aves",
    difficulty: "Fácil",
    space_needed: "Pombal tradicional de alvenaria ou madeira elevado do chão, com poleiros individuais e ninhos duplos.",
    daily_effort: "Baixo",
    where_to_keep: "Pombal bem arejado, seco e orientado a sul/sudeste para apanhar sol matinal.",
    how_to_keep: "Liberdade de voo diária no exterior após período inicial de aclimatação; regressam sempre ao pombal de origem.",
    care: "Limpeza quinzenal do pombal e recolha da pombina (estrume riquíssimo); banheira com água limpa para banho semanal das penas.",
    feeding: "Mistura de sementes e grãos: milho miúdo, ervilha forrageira, trigo, cevada, cártamo e sementes de girassol.",
    feed_items: "Mistura de grãos para pombos (trigo, milho partido, ervilhas secas, cevada) e grit mineral com pedrinhas para a moela",
    treatment: "Vacinação contra paramixovírus, desparasitação anual e colocação de vinagre de sidra natural na água de beber.",
    what_they_do: "Produção de pombina (um dos estrumes mais ricos em azoto e fósforo para compostagem), carne delicada e orientação/recreio rural.",
    special_info: "Os pombais tradicionais transmontanos são construções históricas icónicas concebidas para enriquecer as terras agrícolas há séculos."
  },
  {
    id: "animal_pavao",
    name: "Pavão Real da Quinta",
    scientific_name: "Pavo cristatus",
    emoji: "🦚",
    color: "#0284c7",
    image_url: "./images/animals/pavao.jpg",
    category: "Aves",
    difficulty: "Média",
    space_needed: "Parque amplo ou quintal aberto com árvores altas e robustas para empoleirarem à noite.",
    daily_effort: "Baixo",
    where_to_keep: "Área espaçosa com chão de relva ou terra batida e abrigo alto contra chuva intensa e ventos frios.",
    how_to_keep: "Podem circular livremente pela quinta se o espaço for vedado; têm hábito de dormir nas copas dos pinheiros e carvalhos.",
    care: "Atenção às penas da cauda do macho no período de muda (fim do verão); proteções contra humidade excessiva no solo.",
    feeding: "Alimentação variada omnívora: grãos de cereais, ração para aves, rebentos verdes da horta e abundância de insetos.",
    feed_items: "Milho, sementes de girassol, trigo, verduras frescas, gafanhotos, caracóis e ração de manutenção",
    treatment: "Desparasitação duas vezes por ano e vigilância de coccidiose em aves jovens no primeiro inverno.",
    what_they_do: "Guardiões sonoros da quinta (o seu grito agudo alerta para estranhos, raposas ou serpentes), caçadores natos de cobras e pragas, e beleza ornamental deslumbrante.",
    special_info: "O leque espetacular do macho tem mais de 200 penas ornamentais com ocelos irisados e é exibido na corte nupcial de primavera."
  },
  {
    id: "animal_faisao",
    name: "Faisão Comum da Quinta",
    scientific_name: "Phasianus colchicus",
    emoji: "🪶",
    color: "#b45309",
    image_url: "./images/animals/faisao.jpg",
    category: "Aves",
    difficulty: "Média",
    space_needed: "Gaiolão ou aviário exterior coberto com rede superior de pelo menos 15 a 20 m² para um trio reprodutor.",
    daily_effort: "Baixo",
    where_to_keep: "Aviário plantado com arbustos baixos e gramíneas onde as fêmeas se possam esconder e nidificar pacificamente.",
    how_to_keep: "Obrigatório ter teto de rede macia (anti-choque), pois quando se assustam voam na vertical com tremenda impulsão.",
    care: "Proporcionar cantos tranquilos e ninhos forrados a caruma e feno seco longe do movimento diário da quinta.",
    feeding: "Ração rica em proteína bruta para galináceos silvestres, mistura de sementes miúdas, bagas e forragem verde.",
    feed_items: "Milho triturado, alpista, sementes de linho, verduras picadas, amoras e insetos secos",
    treatment: "Prevenção de parasitas respiratórios e banhos de cinza e areia para manutenção impecável da plumagem.",
    what_they_do: "Criação de aves nobres para embelezamento da propriedade rural, ovos gourmet e carne requintada de elevado valor gastronómico.",
    special_info: "O macho apresenta cores vermelhas e esmeralda brilhantes com um anel branco distintivo no pescoço, enquanto a fêmea é camuflada para chocar em segurança."
  },
  {
    id: "animal_perdiz",
    name: "Perdiz Vermelha Portuguesa",
    scientific_name: "Alectoris rufa",
    emoji: "🐦",
    color: "#dc2626",
    image_url: "./images/animals/perdiz.jpg",
    category: "Aves",
    difficulty: "Média",
    space_needed: "Viveiro espaçoso elevado do solo ou parque com piso de cascalho/areia fina drenada.",
    daily_effort: "Baixo",
    where_to_keep: "Parque ensolarado e abrigado de correntes de ar frias, com vegetação rasteira (tojo, alecrim) para refúgio.",
    how_to_keep: "Manter em pares monogâmicos na época de acasalamento para prevenir brigas territoriais entre machos.",
    care: "Manter comedouros e bebedouros suspensos e protegidos de dejetos; adoram banhos de terra seca ao sol da manhã.",
    feeding: "Mistura de sementes nobres (alpista, milho-painço, trigo), bagas silvestres, folhas tenras e ração inicial para perdizes.",
    feed_items: "Milho miúdo, alpista, trigo, folhas de dente-de-leão, insetos e grit de concha moída",
    treatment: "Controlo preventivo de enterites e coccidiose com probióticos naturais na água de beber.",
    what_they_do: "Ave cinegética emblemática de Portugal; excelente produtora de ovos salpicados muito nutritivos e preservação da fauna autóctone.",
    special_info: "A perdiz vermelha é conhecida pelo seu canto melodioso característico no campo em dias quentes de primavera."
  },

  // --- SOLO & AUXILIARES ---
  {
    id: "animal_minhocas",
    name: "Minhoca Vermelha da Califórnia (Minhocário)",
    scientific_name: "Eisenia foetida",
    emoji: "🪱",
    color: "#991b1b",
    image_url: "./images/animals/minhocas.jpg",
    category: "Solo & Auxiliares",
    difficulty: "Fácil",
    space_needed: "Caixa de vermicompostagem de 50 a 100 litros ou leito térreo com sombra e boa drenagem.",
    daily_effort: "Baixo",
    where_to_keep: "Local fresco e à sombra (15 °C a 25 °C), protegido da chuva direta e do sol tórrido de verão.",
    how_to_keep: "Manter a humidade constante (cerca de 70-80%, como esponja espremida) e cobrir com cartão húmido ou palha para manter a escuridão.",
    care: "Nunca deixar secar nem encharcar; evitar adicionar citrinos em excesso, cebola, alho ou carne para não acidificar o leito.",
    feeding: "Restos vegetais crus da cozinha e horta, borras de café, cascas de banana, folhas caídas e estrume curtido de vaca ou coelho.",
    feed_items: "Restos de legumes e fruta, borras de café com filtro, folhas secas, cartão picado não tratado e palha fina",
    treatment: "Adição de cascas de ovo finamente moídas para regular o pH e fornecer cálcio essencial à reprodução das minhocas.",
    what_they_do: "Transformam resíduos orgânicos no mais rico e potente adubo natural do planeta (húmus de minhoca e biofertilizante líquido concentrado).",
    special_info: "Uma colónia de Eisenia foetida pode consumir diariamente metade do seu próprio peso corporal em matéria orgânica e duplicar a população a cada 60-90 dias."
  },
  {
    id: "animal_caracol",
    name: "Caracóis de Criação (Helicicultura)",
    scientific_name: "Cornu aspersum",
    emoji: "🐌",
    color: "#854d0e",
    image_url: "./images/animals/caracol.jpg",
    category: "Solo & Auxiliares",
    difficulty: "Média",
    space_needed: "Parque exterior vedado com rede helicícola antifuga (cerca anti-evasão) e plantas forrageiras (couves, trevo e acelgas).",
    daily_effort: "Baixo",
    where_to_keep: "Parque sombreado com aspersores de nevoeiro (nebulização) para manter humidade alta ao final da tarde e noite.",
    how_to_keep: "Regas curtas diárias ao crepúsculo para despertar os caracóis para alimentação e reprodução noturna.",
    care: "Controlo apertado de predadores rastejantes (besouros carnívoros, ratos, pássaros e centopeias); vigilância das redes antifuga.",
    feeding: "Ração farinada equilibrada rica em cálcio e forragem verde fresca (folhas largas de couve galega, rabanetes e trevo branco).",
    feed_items: "Ração moída para helicicultura (cereais + 15% carbonato de cálcio), folhas de couve, acelga e fatias de courgette",
    treatment: "Desinfeção do terreno com cal viva antes da sementeira do parque e purga alimentar antes da apanha para consumo.",
    what_they_do: "Produzem caracóis carnosos e saborosos muito procurados na gastronomia tradicional portuguesa e cosmética natural (baba de caracol).",
    special_info: "O caracol é hermafrodita incompleto: cada indivíduo tem ambos os sexos e põe entre 80 a 120 ovos brancos por postura na terra fofa."
  },

  // --- AQUACULTURA & REGA ---
  {
    id: "animal_carpa",
    name: "Carpa de Tanque de Rega / Aquaponia",
    scientific_name: "Cyprinus carpio",
    emoji: "🐟",
    color: "#0891b2",
    image_url: "./images/animals/carpa.jpg",
    category: "Aquacultura",
    difficulty: "Fácil",
    space_needed: "Tanque de rega, represa rústica ou charca com pelo menos 80 a 100 cm de profundidade para termorregulação.",
    daily_effort: "Baixo",
    where_to_keep: "Tanque de rega da quinta com plantas aquáticas (lírios de água, juncos) que oxigenem a água e façam sombra.",
    how_to_keep: "Água sempre renovada pelas entradas normais de rega da mina, poço ou furo da quinta.",
    care: "Não sobrealimentar no inverno (o metabolismo reduz com frio abaixo de 10 °C); manter rede sobre o tanque se houver garças na região.",
    feeding: "Ração flutuante granulada para peixes de lago, folhas tenras de alface picada, lentilhas-de-água e larvas de insetos.",
    feed_items: "Granulado flutuante proteico para carpas/peixes de tanque, sobras de couve picada, minhocas e larvas de mosquito",
    treatment: "Manter água limpa e arejada; a introdução de plantas aquáticas filtra naturalmente nitratos e previne doenças.",
    what_they_do: "Limpam o tanque comendo algas filamentosas e larvas de mosquito da quinta, enquanto produzem água de rega extraordinariamente fertilizada (aquaponia natural).",
    special_info: "A água retirada do tanque de carpas é riquíssima em biofertilizantes naturais solúveis, acelerando o crescimento de hortaliças sem químicos!"
  }
];

export const DEFAULT_MUSHROOMS = [
  {
    id: "mush_tortulho",
    name: "Tortulho / Frade",
    scientific_name: "Macrolepiota procera",
    emoji: "🍄",
    color: "#16a34a",
    image_url: "./images/mushrooms/tortulho.jpg",
    edibility: "Comestível",
    common_names: "Frade, Púcaro, Gasalho",
    habitat: "Prados, clareiras de floresta, pinhais e montados de sobro",
    season_months: [9, 10, 11, 12],
    cap_description: "Chapéu em forma de guarda-sol de grandes dimensões (10 a 30 cm) com escamas castanhas sobre fundo esbranquiçado.",
    lookalikes: "Pode ser confundido com a perigosa Lepiota cristata (mas esta última é muito pequena, menos de 4 cm).",
    preparation: "Consome-se apenas o chapéu (o pé é fibroso demais); delicioso grelhado inteiro na brasa com azeite, alho e sal grosso.",
    tips: "O anel do pé é móvel — se conseguir correr o anel pelo pé acima e abaixo com facilidade, é sinal clássico de identificação."
  },
  {
    id: "mush_sancha",
    name: "Sancha / Níscaro",
    scientific_name: "Lactarius deliciosus",
    emoji: "🍄",
    color: "#16a34a",
    image_url: "./images/mushrooms/sancha.jpg",
    edibility: "Comestível",
    common_names: "Níscaro, Sancha, Pinheira",
    habitat: "Sob pinhais mansos e bravos em solos ácidos",
    season_months: [10, 11, 12, 1],
    cap_description: "Chapéu alaranjado com zonas concêntricas avermelhadas e manchas esverdeadas com o toque e envelhecimento.",
    lookalikes: "Lactarius chrysorrheus (deita látex branco que se torna amarelo rápido e é picante / não comestível).",
    preparation: "Excelente assado na frigideira com alho e toucinho, ou estufado em arroz de cogumelos aromático.",
    tips: "Ao cortar o pé ou as lâminas, liberta um látex de cor de cenoura vivo inconfundível."
  },
  {
    id: "mush_boletus",
    name: "Boleto Edulis / Cepa",
    scientific_name: "Boletus edulis",
    emoji: "🍄",
    color: "#16a34a",
    image_url: "./images/mushrooms/boletus.jpg",
    edibility: "Comestível",
    common_names: "Porcino, Cepa, Tortulho dos carvalhos",
    habitat: "Florestas de castanheiros, carvalhais e pinhais húmidos",
    season_months: [9, 10, 11],
    cap_description: "Chapéu castanho-claro aveludado, pé robusto e bojudo com um retículo esbranquiçado fino perto do chapéu.",
    lookalikes: "Tylopilus felleus (tem sabor extremamente amargo que arruina qualquer prato) e Boletus satanas (tóxico, com poros vermelhos).",
    preparation: "Um dos cogumelos mais valorizados na gastronomia mundial: fatiado em risottos, massas, salteado ou desidratado em lascas.",
    tips: "Ao contrário da maioria dos cogumelos com lâminas, a parte inferior do chapéu tem esponja (tubos) branca que fica amarelada com a idade."
  },
  {
    id: "mush_cantarela",
    name: "Cantarela / Rapa-marotos",
    scientific_name: "Cantharellus cibarius",
    emoji: "🍄",
    color: "#16a34a",
    image_url: "./images/mushrooms/cantarela.jpg",
    edibility: "Comestível",
    common_names: "Canário, Rapazinhos, Chanterelle",
    habitat: "Bosques de carvalhos, castanheiros e pinhais com musgo",
    season_months: [5, 6, 9, 10, 11],
    cap_description: "Amarelo-gema a dourado brilhante, em forma de funil ou trombeta, com pregas grossas ramificadas em vez de lâminas verdadeiras.",
    lookalikes: "Omphalotus olearius (falso chanterelle das oliveiras, muito tóxico — cresce em tufos de madeira e tem lâminas verdadeiras).",
    preparation: "Sabor delicado e frutado a alperce; salteado simples em manteiga ou azeite com salsa fresca.",
    tips: "Quase nunca é atacado por larvas ou bichos devido a compostos naturais protetores."
  },
  {
    id: "mush_morchella",
    name: "Morquela / Cogumelo-de-favo",
    scientific_name: "Morchella esculenta",
    emoji: "🍄",
    color: "#d97706",
    image_url: "./images/mushrooms/morchella.jpg",
    edibility: "Comestível com precaução",
    common_names: "Morchela, Favo-de-mel, Cogumelo-da-primavera",
    habitat: "Solos calcários, junto a freixos, pomares de macieiras e zonas de antigas queimas",
    season_months: [3, 4, 5],
    cap_description: "Chapéu oco com formato cónico e cavidades profundas irregulares parecidas com favos de abelha.",
    lookalikes: "Gyromitra esculenta (altamente tóxica e perigosa, com formato que lembra um cérebro convoluto em vez de alvéolos).",
    preparation: "NUNCA COMER CRU. Contém toxinas hemolíticas voláteis que se destroem totalmente com a cozedura prolongada (mínimo 20 minutos) ou após secagem.",
    tips: "Ao abrir longitudinalmente, o cogumelo e o pé devem formar uma única cavidade oca contínua da base ao topo."
  },
  {
    id: "mush_miscaro",
    name: "Míscaro-amarelo",
    scientific_name: "Tricholoma equestre",
    emoji: "🍄",
    color: "#ea580c",
    image_url: "./images/mushrooms/miscaro.jpg",
    edibility: "Tóxico",
    common_names: "Cogumelo dos cavaleiros, Míscaro da serra",
    habitat: "Pinhais em solos arenosos da Beira Alta e Litoral",
    season_months: [10, 11, 12],
    cap_description: "Amarelo-esverdeado viscoso ao centro com lâminas amarelas de enxofre vivas.",
    lookalikes: "Tradicionalmente muito colhido na Beira Alta, mas hoje proibido para venda na UE.",
    preparation: "NÃO CONSUMIR. O consumo repetido em doses sucessivas provoca rabdomiólise (destruição severa do tecido muscular esquelético e miocárdio).",
    tips: "Embora outrora considerado comestível tradicional, estudos toxicológicos modernos provaram que pode ser mortal por acumulação."
  },
  {
    id: "mush_amanita_muscaria",
    name: "Amanita Matamoscas",
    scientific_name: "Amanita muscaria",
    emoji: "🍄",
    color: "#ea580c",
    image_url: "./images/mushrooms/amanita_muscaria.jpg",
    edibility: "Tóxico",
    common_names: "Falso tortulho, Cogumelo dos contos de fadas",
    habitat: "Sob bétulas, pinheiros e castanheiros",
    season_months: [9, 10, 11, 12],
    cap_description: "Vermelho vivo a alaranjado, coberto de verrugas piramidais brancas que se podem soltar com a chuva forte.",
    lookalikes: "Amanita caesarea (esta última tem lâminas e pé amarelos e chapéu liso sem verrugas e é comestível de luxo).",
    preparation: "TÓXICO GRAVE. Contém ácido iboténico e muscimol. Provoca alucinações severas, delírios, vómitos, tremores e convulsões.",
    tips: "É o cogumelo mais famoso e ilustrado dos livros infantis, mas deve ser apreciado apenas visualmente na floresta."
  },
  {
    id: "mush_amanita_phalloides",
    name: "Amanita Cicuta Verde",
    scientific_name: "Amanita phalloides",
    emoji: "☠️",
    color: "#dc2626",
    image_url: "./images/mushrooms/amanita_phalloides.jpg",
    edibility: "Mortal",
    common_names: "Cicuta-verde, Chapéu-da-morte",
    habitat: "Carvalhais, sobreirais, castinçais e pinhais",
    season_months: [9, 10, 11],
    cap_description: "Verde-oliva a verde-amarelado pálido com fibrilhas radiais, lâminas brancas que NUNCA escurecem e volva em saco na base do pé.",
    lookalikes: "Pode ser tragicamente confundido com tortulhos jovens em botão ou com cogumelos comestíveis do género Russula virescens.",
    preparation: "MORTAL. Uma única amostra de 30 gramas é suficiente para matar um adulto por necrose hepática fulminante e falência renal.",
    tips: "Apresenta 'falsa melhora clínica' após os primeiros vómitos, o que atrasa a ida ao hospital. A volva em saco na base do pé enterrado na terra é a marca mortal."
  }
];

export const DEFAULT_PODAS = [
  // --- VINHA ---
  {
    id: "poda_vinha_inverno",
    name: "Videira - Poda de Inverno",
    emoji: "🍇",
    color: "#7c3aed",
    image_url: "./images/podas/vinha.jpg",
    category: "Vinha",
    when_months: [12, 1, 2, 3],
    formation_months: [1, 2, 5, 6],
    production_months: [12, 1, 2, 3],
    cleaning_months: [12, 1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Inverno (Jan–Fev) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Cepa Jovem)",
        summary: "Selecionar a vara mais forte e direita para formar o tronco vertical no tutor e conduzir os 2 braços principais no arame."
      },
      production: {
        season: "Repouso de Inverno (Dezembro a Março)",
        stage: "Anual em cepas adultas",
        summary: "Cortar as varas que já produziram, deixando talões curtos de 2 a 3 gomos (Royat) ou vara longa e talão de reserva (Guyot) antes do choro."
      },
      cleaning: {
        season: "Inverno (Dez–Fev) e Verão (Jun–Jul)",
        stage: "Manutenção e cepas velhas",
        summary: "Retirar madeira morta, braços com fungos (escoriose/eutipiose), ladrões no tronco velho e renovar braços compridos pelo talão de retorno."
      }
    },
    when_info: "Durante o repouso vegetativo de inverno profundo, antes do choro da videira (dezembro a início de março), complementada com orientação em verde.",
    pruning_types: "Poda de formação (condução no arame), poda em seco de produção (sistemas Royat ou Guyot) e poda de limpeza/rejuvenescimento de braços.",
    how: "Corte das varas que já produziram. Deixar varas com 2 a 3 gomos produtivos bem formados e eliminar varas fracas ou mal posicionadas. Manter o equilíbrio entre o crescimento vegetativo e a carga de uva.",
    tools: "Tesoura de poda de uma mão bem afiada, serrote pequeno para ramos velhos e solução alcoólica para desinfeção entre cepas.",
    tips: "O corte deve ser sempre inclinado (em bisel) no sentido oposto ao gomo mais alto para evitar que a água da chuva e as lágrimas de seiva escorram sobre a gema fértil.",
    difficulty: "Média"
  },
  {
    id: "poda_vinha_verde",
    name: "Videira - Poda em Verde",
    emoji: "🌿",
    color: "#16a34a",
    image_url: "./images/podas/vinha_verde.jpg",
    category: "Vinha",
    when_months: [4, 5, 6, 7, 8],
    formation_months: [4, 5, 6],
    production_months: [5, 6, 7, 8],
    cleaning_months: [4, 5, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Primavera (Abril a Junho)",
        stage: "Videiras jovens em condução",
        summary: "Escolher os pâmpanos mais bem posicionados para formar a estrutura nos arames e suprimir brotos baixos ao longo do tronco."
      },
      production: {
        season: "Fim da Primavera ao Verão (Maio a Agosto)",
        stage: "Floração ao Pintor dos bagos",
        summary: "Despontar extremidades vigorosas, mondar cachos em excesso e abrir janelas de luz na folhagem para maturação e doçura das uvas."
      },
      cleaning: {
        season: "Primavera e Início de Verão (Abril a Julho)",
        stage: "Arejamento sanitário anual",
        summary: "Esladroar rebentos que nascem na madeira velha, remover netos emaranhados e retirar folhas basais envelhecidas junto aos cachos."
      }
    },
    when_info: "Da primavera ao verão (abril a agosto), durante o crescimento ativo dos pâmpanos, vingamento e maturação das uvas.",
    pruning_types: "Desponta, esladroamento, orientação de pâmpanos, desfolha pontual na zona dos cachos e monda de cachos.",
    how: "Eliminar rebentos ladrões que brotam da madeira velha. Despontar as extremidades dos ramos longos para travar o crescimento e concentrar nutrientes nos cachos. Retirar algumas folhas velhas à volta dos cachos para arejamento.",
    tools: "Tesoura de poda pequena ou desbaste manual dos rebentos tenros com os dedos.",
    tips: "Arejar os cachos previne o oídio e o míldio, permitindo que a luz solar direta melhore a maturação dos bagos e a concentração de açúcares.",
    difficulty: "Fácil"
  },

  // --- FRUTEIRAS DE PEPITA ---
  {
    id: "poda_macieira",
    name: "Macieira",
    emoji: "🍎",
    color: "#dc2626",
    image_url: "./images/podas/macieira.jpg",
    category: "Fruteiras de pepita",
    when_months: [11, 12, 1, 2, 3, 6, 7],
    formation_months: [12, 1, 2, 6, 7],
    production_months: [12, 1, 2, 3],
    cleaning_months: [11, 12, 1, 2, 7, 8],
    pruning_calendar: {
      formation: {
        season: "Inverno (Dez–Fev) e Verão (Jun–Jul)",
        stage: "1.º ao 4.º ano (Árvore Jovem)",
        summary: "Definir eixo central ou taça aberta com 3 a 4 pernadas no inverno e arquear ramos laterais no verão para induzir botões florais."
      },
      production: {
        season: "Dormência Invernal (Dezembro a Março)",
        stage: "Anual em árvores adultas",
        summary: "Conservar dardos, bolsas e lamburdas floríferas, encurtar ramos mistos longos e equilibrar a carga para evitar anos sem maçãs."
      },
      cleaning: {
        season: "Inverno (Nov–Fev) e Poda Verde (Jul–Ago)",
        stage: "Manutenção e árvores velhas",
        summary: "Suprimir ladrões verticais no verão, cortar ramos secos, cruzados ou com cancro e abrir o centro da copa para entrada de sol."
      }
    },
    when_info: "Poda principal no repouso de inverno (dezembro a início de março) e intervenção complementar em verde no verão (junho a agosto).",
    pruning_types: "Poda de formação nos primeiros anos (taça ou eixo central); poda anual de frutificação/produção e poda de limpeza e rejuvenescimento.",
    how: "Eliminar ramos cruzados, ramos secos ou doentes e os ladrões verticais que roubam vigor. Clarear o centro da árvore para criar uma copa aberta que receba luz solar em todas as maçãs interiores.",
    tools: "Tesourão de poda de dois braços, tesoura de poda afiada e serrote curvo para pernadas mais grossas.",
    tips: "Preservar os lambiques e dardos curtos (órgãos florais onde nascem as maçãs). Evitar cortar pontas frutíferas saudáveis sem necessidade.",
    difficulty: "Fácil"
  },
  {
    id: "poda_pereira",
    name: "Pereira (Pêra Rocha)",
    emoji: "🍐",
    color: "#84cc16",
    image_url: "./images/podas/pereira.jpg",
    category: "Fruteiras de pepita",
    when_months: [11, 12, 1, 2, 6, 7],
    formation_months: [12, 1, 2, 5, 6],
    production_months: [12, 1, 2],
    cleaning_months: [11, 12, 1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Inverno (Dez–Fev) e Primavera (Mai–Jun)",
        stage: "1.º ao 4.º ano (Árvore Jovem)",
        summary: "Estruturar em eixo central ou pirâmide e arquear suavemente os ramos muito verticais na primavera (45°–60°) para travar o vigor."
      },
      production: {
        season: "Pleno Inverno (Dezembro a Fevereiro)",
        stage: "Anual antes do inchamento dos gomos",
        summary: "Selecionar esporões e bolsas florais próximas do eixo principal e encurtar ramos compridos para melhorar o calibre da pêra."
      },
      cleaning: {
        season: "Inverno (Nov–Fev) e Verão (Jun–Jul)",
        stage: "Limpeza e rejuvenescimento",
        summary: "Retirar ladrões verticais vigorosos no início do verão, eliminar madeira seca ou com pedrado e renovar esporões envelhecidos."
      }
    },
    when_info: "Meses frios de dezembro a fevereiro antes do inchamento dos gomos florais, com desladroamento e arqueamento em maio–julho.",
    pruning_types: "Poda de formação (pirâmide ou eixo), poda de produção em esporões e poda de limpeza/rejuvenescimento.",
    how: "Suprimir ladrões muito verticais, encurtar os ramos mistos muito compridos e selecionar os esporões e bolsas com botões de flor mais compactos e perto do eixo principal.",
    tools: "Tesoura de poda de corte deslizante bem afiada e desinfetada.",
    tips: "As pereiras têm forte tendência para o crescimento vertical erecto. Arquear suavemente alguns ramos laterais ajuda a antecipar a produção de fruta.",
    difficulty: "Fácil"
  },
  {
    id: "poda_marmeleiro",
    name: "Marmeleiro",
    emoji: "🍈",
    color: "#eab308",
    image_url: "./images/podas/marmeleiro.jpg",
    category: "Fruteiras de pepita",
    when_months: [11, 12, 1, 2, 6, 7],
    formation_months: [12, 1, 2],
    production_months: [1, 2],
    cleaning_months: [11, 12, 1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Repouso de Inverno (Dezembro a Fevereiro)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Formar copa baixa em taça aberta com 3 a 4 pernadas bem distribuídas a partir de 60–80 cm do solo."
      },
      production: {
        season: "Inverno Profundo (Janeiro e Fevereiro)",
        stage: "Anual ligeira em árvores adultas",
        summary: "Clarear ramos em excesso sem despontar as pontas jovens exteriores, pois o marmeleiro floresce e frutifica nas extremidades."
      },
      cleaning: {
        season: "Inverno (Nov–Fev) e Verão (Jun–Jul)",
        stage: "Sanitária e rejuvenescimento",
        summary: "Arrancar rebentos ladrões que brotam na base da raiz no verão e eliminar ramos secos, cruzados ou pendentes no interior."
      }
    },
    when_info: "Durante o repouso vegetativo invernal (novembro a fevereiro), com limpeza de rebentos basais no verão (junho e julho).",
    pruning_types: "Poda de formação em taça, poda ligeira de produção e poda de limpeza/desbaste interior.",
    how: "Eliminar ramos cruzados no interior da copa, retirar madeira seca e eliminar os rebentos que nascem no colo da raiz. O marmeleiro frutifica na extremidade dos raminhos formados no próprio ano.",
    tools: "Tesoura de poda e serrote de podar pequeno.",
    tips: "Não desponte excessivamente as pontas dos ramos exteriores, pois é aí que surgirão os botões florais na primavera.",
    difficulty: "Fácil"
  },

  // --- FRUTEIRAS DE CAROÇO ---
  {
    id: "poda_pessegueiro",
    name: "Pessegueiro e Nectarina",
    emoji: "🍑",
    color: "#f97316",
    image_url: "./images/podas/pessegueiro.jpg",
    category: "Fruteiras de caroço",
    when_months: [1, 2, 3, 5, 6, 8, 9],
    formation_months: [2, 3, 5, 6],
    production_months: [1, 2, 3],
    cleaning_months: [5, 6, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Fev–Mar) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Abrir a copa em taça baixa com 3 a 4 braços principais sem eixo central e orientar os lançamentos novos na primavera."
      },
      production: {
        season: "Fim de Inverno com gomos a inchar (Jan–Mar)",
        stage: "Anual rigorosa (frutifica em ramo de 1 ano)",
        summary: "Renovar 50 a 70% da ramagem: cortar ramos que já deram fruto e selecionar ramos mistos vigorosos com gomos triplos."
      },
      cleaning: {
        season: "Primavera (Mai–Jun) e Pós-colheita (Ago–Set)",
        stage: "Poda em verde e limpeza sanitária",
        summary: "Retirar ladrões interiores que tapam o sol aos frutos na primavera e eliminar ramos secos, partidos ou com gomose após a colheita."
      }
    },
    when_info: "Fim do inverno (janeiro a março) quando os botões começam a inchar, complementada por poda em verde (maio–junho) e limpeza pós-colheita (agosto–setembro).",
    pruning_types: "Poda de formação em taça aberta, poda rigorosa de produção anual em madeira de 1 ano e poda em verde de limpeza.",
    how: "Remover ramos que já frutificaram e ficaram exaustos. Desbastar os ramos mistos, mantendo os ramos vigorosos com gomos triplos (dois gomos florais com um gomo de madeira ao meio). Encurtar ramos compridos em 30%.",
    tools: "Tesoura de poda muito bem afiada e mastique cicatrizante para selar cortes grossos.",
    tips: "Muito suscetível à lepra do pessegueiro e cancro bacteriano: aplicar calda bordalesa imediatamente após a conclusão da poda.",
    difficulty: "Média"
  },
  {
    id: "poda_cerejeira",
    name: "Cerejeira",
    emoji: "🍒",
    color: "#be123c",
    image_url: "./images/podas/cerejeira.jpg",
    category: "Fruteiras de caroço",
    when_months: [3, 5, 6, 7, 8, 9],
    formation_months: [3, 5, 6, 8],
    production_months: [7, 8, 9],
    cleaning_months: [6, 7, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Abrolhamento (Março) e Verão (Mai–Ago)",
        stage: "1.º ao 4.º ano (Árvore Jovem)",
        summary: "Conduzir em taça aberta ou vaso retardado através de despontas em verde na primavera/verão, evitando cortes no inverno frio."
      },
      production: {
        season: "Verão logo após a colheita (Julho a Setembro)",
        stage: "Manutenção frutífera anual",
        summary: "Controlar a altura das pernadas e abrir entrada de sol para os 'buquês de maio', aproveitando o calor para cicatrização rápida."
      },
      cleaning: {
        season: "Verão Seco Pós-colheita (Junho a Setembro)",
        stage: "Sanitária e rejuvenescimento suave",
        summary: "Remover ramos partidos na apanha, ladrões interiores e ramos secos em dias secos e quentes para impedir a formação de gomose."
      }
    },
    when_info: "Final da primavera e verão (junho a setembro), imediatamente após a colheita das cerejas, ou formação suave no abrolhamento (março).",
    pruning_types: "Poda de formação em verde, poda de produção pós-colheita e poda de limpeza; NUNCA podar no inverno profundo para evitar gomose.",
    how: "Remover ramos doentes, partidos pelo peso da colheita ou entrecruzados. Manter a copa aberta e arejada. Reduzir a altura das copas que subiram em demasia.",
    tools: "Serrote de dente fino japonês, tesoura de podar afiada e pasta cicatrizante.",
    tips: "A cerejeira cicatriza muito mal em tempo húmido e frio, segregando goma pegajosa. Podar com tempo quente e seco garante cicatrização instantânea.",
    difficulty: "Média"
  },
  {
    id: "poda_ameixeira",
    name: "Ameixeira",
    emoji: "🫐",
    color: "#6b21a8",
    image_url: "./images/podas/ameixeira.jpg",
    category: "Fruteiras de caroço",
    when_months: [1, 2, 3, 6, 7, 8, 9],
    formation_months: [1, 2, 5, 6],
    production_months: [1, 2, 3],
    cleaning_months: [6, 7, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Jan–Fev) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Formar taça aberta livre com 3 a 4 pernadas bem inseridas e despontar lançamentos excessivamente compridos em maio/junho."
      },
      production: {
        season: "Fim do Inverno antes da brotação (Jan–Mar)",
        stage: "Anual em árvores adultas",
        summary: "Equilibrar ramos mistos e conservar os dardos curtos ('buquês de maio') para estabilizar a produção e o tamanho das ameixas."
      },
      cleaning: {
        season: "Verão e Pós-colheita (Junho a Setembro)",
        stage: "Limpeza de ladrões e rejuvenescimento",
        summary: "Cortar ladrões verticais e rebentos da raiz no verão e eliminar ramos partidos, secos ou sombreados logo após a colheita."
      }
    },
    when_info: "Fim do inverno (janeiro a março) pouco antes da brotação, com limpeza em verde e rejuvenescimento no verão (junho a setembro).",
    pruning_types: "Poda de formação em taça, poda de produção/frutificação e poda de limpeza e rejuvenescimento de ramos velhos.",
    how: "Clarear o centro da copa retirando os ramos vigorosos verticais e encurtar ligeiramente os ramos pendentes. Conservar os buquês de maio e ramos curtos com botões florais.",
    tools: "Tesoura de poda de duas mãos e tesoura de corte bypass.",
    tips: "As ameixeiras tendem a ter colheitas alternadas ('safra e contra-safra'). Uma poda equilibrada atenua essa alternância e melhora o calibre das ameixas.",
    difficulty: "Fácil"
  },
  {
    id: "poda_damasqueiro",
    name: "Damasqueiro (Alperceiro)",
    emoji: "🍊",
    color: "#ea580c",
    image_url: "./images/podas/damasqueiro.jpg",
    category: "Fruteiras de caroço",
    when_months: [2, 3, 5, 6, 7, 8],
    formation_months: [2, 3, 5, 6],
    production_months: [2, 3],
    cleaning_months: [6, 7, 8],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Fev–Mar) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Abrir a copa em taça luminosa e beliscar rebentos vigorosos em maio/junho para promover ramificações secundárias floríferas."
      },
      production: {
        season: "Fevereiro a início de Março (Botões visíveis)",
        stage: "Anual antes da floração",
        summary: "Renovar brindilos e esporões produtivos em dias secos, mantendo ramos curtos bem expostos ao sol da manhã."
      },
      cleaning: {
        season: "Verão após a colheita (Junho a Agosto)",
        stage: "Sanitária e rejuvenescimento em verde",
        summary: "Remover ladrões vigorosos, madeira seca e ramos cruzados no verão seco, quando a árvore cicatriza rápido sem risco de cancro."
      }
    },
    when_info: "Fevereiro a início de março para produção, e de maio a agosto para desponta em verde e limpeza pós-colheita.",
    pruning_types: "Poda de formação em taça, poda de frutificação moderada e poda sanitária de verão.",
    how: "Eliminar ramos cruzados ou sombreados no centro da árvore. Despontar os ramos mistos fracos e manter os esporões curtos de produção.",
    tools: "Tesoura afiada e pasta cicatrizante de cobre para proteção imediata das feridas.",
    tips: "Árvore de floração muito precoce: proteja os rebentos abertos de geadas tardias de primavera.",
    difficulty: "Média"
  },

  // --- CITRINOS ---
  {
    id: "poda_laranjeira",
    name: "Laranjeira",
    emoji: "🍊",
    color: "#f97316",
    image_url: "./images/podas/laranjeira.jpg",
    category: "Citrinos",
    when_months: [3, 4, 5, 6, 8, 9],
    formation_months: [3, 4, 5, 6],
    production_months: [3, 4, 5],
    cleaning_months: [3, 4, 5, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Primavera sem geadas (Março a Junho)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Limpar o tronco até 50–60 cm do solo e selecionar 3 a 4 pernadas principais bem distribuídas para formar copa arredondada."
      },
      production: {
        season: "Primavera pós-colheita (Março a Maio)",
        stage: "Anual ligeira em árvores adultas",
        summary: "Abrir entradas de luz e ar no topo e interior da copa sem despir a ramagem exterior onde nascem as flores de laranjeira."
      },
      cleaning: {
        season: "Primavera (Mar–Mai) e Fim de Verão (Ago–Set)",
        stage: "Desladroamento e limpeza sanitária",
        summary: "Cortar 'chupones' verticais espinhosos, levantar ramos da saia que tocam na terra e retirar raminhos secos interiores."
      }
    },
    when_info: "Primavera (março a maio), após a apanha das laranjas e passado o perigo de geadas, com repasse de ladrões no fim do verão (agosto–setembro).",
    pruning_types: "Poda de formação da copa, poda de produção/arejamento e poda de limpeza e rejuvenescimento suave.",
    how: "Remover ramos secos, partidos ou que toquem no chão. Eliminar os 'chupones' ou ladrões vigorosos do interior da copa que roubam seiva. Manter a copa equilibrada em forma arredondada sem despir o tronco.",
    tools: "Tesoura de poda ergonómica e luvas grossas para proteger dos espinhos.",
    tips: "Os citrinos não toleram podas drásticas. Desbastar apenas o suficiente para que a luz e o ar circulem, prevenindo cochonilhas e fumagina.",
    difficulty: "Fácil"
  },
  {
    id: "poda_limoeiro",
    name: "Limoeiro 4 Estações",
    emoji: "🍋",
    color: "#eab308",
    image_url: "./images/podas/limoeiro.jpg",
    category: "Citrinos",
    when_months: [3, 4, 5, 6, 7, 9, 10],
    formation_months: [3, 4, 5],
    production_months: [3, 4, 5, 9],
    cleaning_months: [3, 4, 6, 7, 9, 10],
    pruning_calendar: {
      formation: {
        season: "Primavera (Março a Maio)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Definir 3 a 4 braços estruturais abertos e despontar lançamentos longos para criar uma copa firme e resistente ao vento."
      },
      production: {
        season: "Primavera (Mar–Mai) e Outono (Setembro)",
        stage: "Equilíbrio das várias florações",
        summary: "Encurtar varas vigorosas improdutivas nas pontas e iluminar o interior, preservando os raminhos laterais com botões e frutos."
      },
      cleaning: {
        season: "Primavera ao Outono (Mar–Abr, Jun–Jul, Set–Out)",
        stage: "Desbaste contínuo de ladrões",
        summary: "Eliminar os ladrões verticais com espinhos que surgem no centro da árvore, remover madeira seca e manter a saia a 50 cm do solo."
      }
    },
    when_info: "Principalmente na primavera (março a maio) após a colheita de inverno, com limpeza de ladrões no verão e repasse em setembro–outubro.",
    pruning_types: "Poda de formação, poda de produção/equilíbrio e desbaste interior contínuo de limpeza.",
    how: "Eliminar os ladrões verticais que brotam com força no meio da árvore sem flores. Manter a saia da árvore a cerca de 50 cm do solo para evitar podridões com a chuva e terra.",
    tools: "Tesourão de podar e tesoura de uma mão desinfetada.",
    tips: "O limoeiro produz várias florações por ano; evite cortar ramos carregados de botões florais pequenos.",
    difficulty: "Fácil"
  },
  {
    id: "poda_clementineira",
    name: "Tangerineira e Clementina",
    emoji: "🍊",
    color: "#d97706",
    image_url: "./images/podas/clementineira.jpg",
    category: "Citrinos",
    when_months: [2, 3, 4, 5, 8, 9],
    formation_months: [3, 4, 5],
    production_months: [2, 3, 4],
    cleaning_months: [3, 4, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Primavera (Março a Maio)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Formar copa arredondada sobre 3 pernadas fortes bem espaçadas, evitando forquilhas fechadas que rasgam com o peso da fruta."
      },
      production: {
        season: "Pós-colheita (Fevereiro a Abril)",
        stage: "Anual em árvores em produção",
        summary: "Renovar raminhos finos esgotados pela colheita anterior e abrir luz no centro para aumentar o calibre e a doçura dos gomos."
      },
      cleaning: {
        season: "Primavera (Mar–Abr) e Fim de Verão (Ago–Set)",
        stage: "Limpeza interior e rejuvenescimento",
        summary: "Retirar raminhos secos emaranhados no miolo da copa, suprimir 'chupones' verticais e aliviar ramos baixos vergados."
      }
    },
    when_info: "Logo após a colheita dos frutos (fevereiro a abril), com formação na primavera e remoção de ladrões em agosto–setembro.",
    pruning_types: "Poda de formação globosa, poda de produção pós-colheita e poda de limpeza interior.",
    how: "Limpar o centro da copa, remover ramos débeis e encurtar ramos finos que verguem demasiado sob o peso da fruta.",
    tools: "Tesoura de poda e luvas de proteção.",
    tips: "Clementinas produzem em ramos finos e ramificados; preservar a copa frondosa mas sem emaranhados.",
    difficulty: "Fácil"
  },

  // --- OLIVEIRA ---
  {
    id: "poda_oliveira",
    name: "Oliveira - Poda de Produção",
    emoji: "🫒",
    color: "#65a30d",
    image_url: "./images/podas/oliveira.jpg",
    category: "Oliveira",
    when_months: [1, 2, 3, 4, 6, 7, 8, 11, 12],
    formation_months: [2, 3, 4, 6, 7],
    production_months: [1, 2, 3, 4],
    cleaning_months: [2, 3, 6, 7, 8, 11, 12],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Fev–Abr) e Verão (Jun–Jul)",
        stage: "1.º ao 4.º ano (Oliveira Jovem)",
        summary: "Manter tronco único limpo até 1,0–1,2 m de altura e abrir 3 a 4 pernadas mestras em taça livre, retirando rebentos do fuste."
      },
      production: {
        season: "Pós-apanha da azeitona (Janeiro a Abril)",
        stage: "Anual ou bienal em árvores adultas",
        summary: "Abrir o centro da copa ('deixar passar o pássaro'), renovar ramos que já produziram e preservar as saias pendulares de 1 ano."
      },
      cleaning: {
        season: "Inverno (Nov–Mar) e Verão (Jun–Ago)",
        stage: "Limpeza de varejões e rejuvenescimento",
        summary: "Cortar ladrões e varejões verticais no verão, remover ramos com tuberculose e rebaixar pernadas velhas para rejuvenescer a copa."
      }
    },
    when_info: "Poda principal logo após a apanha da azeitona (janeiro a abril) e desladroamento de limpeza no verão (junho a agosto).",
    pruning_types: "Poda de formação em vaso livre, poda de produção em taça aberta e poda de limpeza/rejuvenescimento de pernadas.",
    how: "Remover os ramos velhos que já frutificaram no ano anterior e desbastar ramos verticais que sobem ao céu. Deixar a árvore com 3 a 4 ramos mestres bem distribuídos.",
    tools: "Serrote de poda de corte em tração, tesourão telescópico e motosserra de poda ligeira para ramos grossos.",
    tips: "A sabedoria popular diz que uma oliveira bem podada deve permitir a um pássaro voar através da copa sem esbarrar nas folhas.",
    difficulty: "Média"
  },
  {
    id: "poda_oliveira_desladroamento",
    name: "Oliveira - Desladroamento",
    emoji: "🌳",
    color: "#4d7c0f",
    image_url: "./images/podas/oliveira_desladroamento.jpg",
    category: "Oliveira",
    when_months: [2, 3, 5, 6, 7, 8, 9],
    formation_months: [3, 5, 6, 7],
    production_months: [6, 7, 8],
    cleaning_months: [2, 3, 6, 7, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Primavera e Início de Verão (Mar e Mai–Jul)",
        stage: "Oliveiras jovens em formação",
        summary: "Retirar rebentos tenros ao longo do tronco jovem para canalizar toda a seiva para o crescimento dos ramos mestres da copa."
      },
      production: {
        season: "Verão Quente (Junho a Agosto)",
        stage: "Proteção da carga de azeitona",
        summary: "Suprimir os varejões verticais no dorso das pernadas que roubam água e nutrientes essenciais ao enchimento da azeitona."
      },
      cleaning: {
        season: "Inverno (Fev–Mar) e Verão (Jun–Set)",
        stage: "Limpeza da cepa e colo da raiz",
        summary: "Cortar rente à casca todos os ladrões que rebentam no pé da oliveira e limpar ramos interiores secos para travar a cochonilha."
      }
    },
    when_info: "Verão (junho a setembro) com tempo quente e seco para eliminar varejões, complementado na revisão de inverno/primavera.",
    pruning_types: "Desladroamento de formação do fuste, desbaste de varejões nas pernadas e limpeza da base do tronco.",
    how: "Cortar rente ao cepo todos os rebentos vigorosos ('ladrões' ou varejões) que brotam da base do tronco ou do chão e que roubam água e nutrientes à copa produtiva.",
    tools: "Sacho afiado, podão ou tesoura de poda bem encostada à casca do tronco.",
    tips: "Quanto mais cedo os ladrões forem removidos no início do verão, menor será a perda de vigor para a maturação da azeitona.",
    difficulty: "Fácil"
  },

  // --- FRUTOS SECOS E OUTRAS ---
  {
    id: "poda_amendoeira",
    name: "Amendoeira",
    emoji: "🥜",
    color: "#a16207",
    image_url: "./images/podas/amendoeira.jpg",
    category: "Frutos secos",
    when_months: [11, 12, 1, 5, 6, 9, 10],
    formation_months: [11, 12, 1, 5, 6],
    production_months: [11, 12, 1],
    cleaning_months: [9, 10, 11, 12, 1],
    pruning_calendar: {
      formation: {
        season: "Inverno (Nov–Jan) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Árvore Jovem)",
        summary: "Formar copa em taça aberta com 3 a 4 pernadas bem espaçadas e despontar lançamentos vigorosos mal orientados na primavera."
      },
      production: {
        season: "Outono tardio a Janeiro (Novembro a Janeiro)",
        stage: "Anual antes da floração precoce",
        summary: "Clarear ramos de 2 anos e preservar os esporões frutíferos (produtivos até 5 anos) antes da abertura das flores em fevereiro."
      },
      cleaning: {
        season: "Pós-colheita (Set–Out) e Inverno (Nov–Jan)",
        stage: "Limpeza sanitária e rejuvenescimento",
        summary: "Remover ramos partidos na apanha, madeira seca ou com gomose e renovar pernadas envelhecidas para entrada de luz."
      }
    },
    when_info: "Início do inverno (novembro a janeiro) antes da floração precoce de fevereiro, com limpeza pós-colheita em setembro–outubro.",
    pruning_types: "Poda de formação em taça, poda de produção/manutenção de esporões e poda de limpeza pós-colheita.",
    how: "Remover ramos partidos, secos e os ramos que se cruzam no interior. As amêndoas formam-se em ramos de 2 anos e esporões persistentes que duram até 5 anos.",
    tools: "Tesoura de poda e serrote higienizado.",
    tips: "A amendoeira floresce muito cedo em Portugal; realizar a poda antes de abrir a flor para não prejudicar a polinização pelas abelhas.",
    difficulty: "Fácil"
  },
  {
    id: "poda_castanheiro",
    name: "Castanheiro (Souto)",
    emoji: "🌰",
    color: "#78350f",
    image_url: "./images/podas/castanheiro.jpg",
    category: "Frutos secos",
    when_months: [11, 12, 1, 2, 6, 7],
    formation_months: [12, 1, 2, 6],
    production_months: [12, 1, 2],
    cleaning_months: [11, 12, 1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Inverno (Dez–Fev) e Pós-enxertia (Junho)",
        stage: "1.º ao 5.º ano (Castanheiro Jovem)",
        summary: "Guiar tronco direito até 2 m, abrir 3 a 4 braços principais equilibrados e suprimir rebentos bravos abaixo do enxerto no verão."
      },
      production: {
        season: "Dormência Profunda (Dezembro a Fevereiro)",
        stage: "Soutos em plena produção",
        summary: "Clarear a copa para que o sol atinja toda a periferia onde nascem os ouriços, mantendo madeira jovem e produtiva."
      },
      cleaning: {
        season: "Inverno (Nov–Fev) e Verão (Jun–Jul)",
        stage: "Sanitária e rejuvenescimento de soutos",
        summary: "Eliminar ramos secos ou com cancro do castanheiro (selando com pasta cúprica), limpar ladrões na base e rejuvenescer copas velhas."
      }
    },
    when_info: "Pleno inverno em dormência absoluta (novembro a fevereiro) e limpeza de rebentos bravos do porta-enxerto em junho–julho.",
    pruning_types: "Poda de formação nos jovens, poda de produção/clareio e poda sanitária e de rejuvenescimento em soutos adultos.",
    how: "Eliminar ramos afetados por cancro do castanheiro ou ramos secos. Clarear copas densas para permitir a entrada de luz e facilitar o desenvolvimento dos ouriços.",
    tools: "Serrote de poda de cabo longo, tesoura de duas mãos e pasta cicatrizante com fungicida cúprico.",
    tips: "Desinfetar cuidadosamente todas as lâminas entre árvores para travar a propagação do fungo do cancro (Cryphonectria parasitica).",
    difficulty: "Média"
  },
  {
    id: "poda_figueira",
    name: "Figueira",
    emoji: "🪴",
    color: "#15803d",
    image_url: "./images/podas/figueira.jpg",
    category: "Fruteiras de folha caduca",
    when_months: [12, 1, 2, 5, 6, 7],
    formation_months: [1, 2, 5, 6],
    production_months: [12, 1, 2],
    cleaning_months: [1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Inverno (Jan–Fev) e Primavera (Mai–Jun)",
        stage: "1.º ao 3.º ano (Figueira Jovem)",
        summary: "Formar tronco curto com 3 a 4 pernadas abertas em taça baixa para permitir colher os figos facilmente a partir do chão."
      },
      production: {
        season: "Repouso de Inverno (Dezembro a Fevereiro)",
        stage: "Anual em árvores adultas",
        summary: "Arejar a copa preservando as pontas dos ramos de 1 ano (onde nascem os figos lampos) e estimular rebentos para figos vindimos."
      },
      cleaning: {
        season: "Inverno (Jan–Fev) e Verão (Jun–Jul)",
        stage: "Limpeza de rebentos e rejuvenescimento",
        summary: "Cortar os rebentos que nascem no pé da figueira no verão, remover ramos secos ou rasteiros e rebaixar pernadas demasiado altas."
      }
    },
    when_info: "Durante o repouso invernal após a queda das folhas (dezembro a fevereiro) e limpeza de rebentos da base em maio–julho.",
    pruning_types: "Poda de formação em taça baixa, poda de produção (figos lampos e vindimos) e poda de limpeza/rejuvenescimento.",
    how: "Cortar ramos secos, ramos baixos que dificultem a passagem e ramos cruzados. Para figos lampos (primeira colheita em junho), preservar as pontas dos ramos do ano anterior onde já se encontram os botões.",
    tools: "Serrote de poda e tesourão.",
    tips: "A madeira da figueira é macia e oca no centro; não corte rente ao tronco principal sem necessidade para evitar cavidades onde a água da chuva se acumule.",
    difficulty: "Fácil"
  },

  // --- PEQUENOS FRUTOS ---
  {
    id: "poda_framboesa",
    name: "Framboeseiro",
    emoji: "🍓",
    color: "#e11d48",
    image_url: "./images/podas/framboesa.jpg",
    category: "Pequenos frutos",
    when_months: [11, 12, 1, 2, 7, 8, 9],
    formation_months: [1, 2, 5, 6],
    production_months: [11, 12, 1, 2],
    cleaning_months: [7, 8, 9, 12, 1, 2],
    pruning_calendar: {
      formation: {
        season: "Inverno (Jan–Fev) e Primavera (Mai–Jun)",
        stage: "1.º ano e condução na espaldeira",
        summary: "Rebaixar varas recém-plantadas a 25 cm e selecionar 6 a 8 lançamentos novos fortes por metro linear, atando-os aos arames."
      },
      production: {
        season: "Repouso Invernal (Novembro a Fevereiro)",
        stage: "Poda anual de frutificação",
        summary: "Nas remontantes, aparar a ponta que deu fruto no outono (para 2 colheitas) ou rebaixar tudo para colheita única abundante."
      },
      cleaning: {
        season: "Pós-colheita (Jul–Set) e Inverno (Dez–Fev)",
        stage: "Renovação de canas exaustas",
        summary: "Cortar rente ao solo todas as canas castanhas e secas que já frutificaram no verão e arrancar rebentos fracos fora da linha."
      }
    },
    when_info: "Inverno profundo (novembro a fevereiro) para poda de produção, e fim do verão (julho a setembro) para cortar varas que já deram fruto.",
    pruning_types: "Poda de formação/condução, poda de produção (remontantes e não-remontantes) e poda de limpeza de canas velhas.",
    how: "Nas não-remontantes: cortar rente ao solo todas as varas velhas que deram fruto no verão anterior e atar as varas novas jovens ao arame. Nas remontantes: podar a ponta que deu fruta no outono ou cortar tudo rente ao solo para colheita única abundante de fim de verão.",
    tools: "Tesoura de podar de mão pequena e luvas de proteção contra espinhos.",
    tips: "Uma boa seleção de varas (deixar cerca de 6 a 8 varas fortes por metro linear) garante frutos de grande calibre e doçura.",
    difficulty: "Fácil"
  },
  {
    id: "poda_mirtilo",
    name: "Mirtileiro",
    emoji: "🫐",
    color: "#1d4ed8",
    image_url: "./images/podas/mirtilo.jpg",
    category: "Pequenos frutos",
    when_months: [12, 1, 2, 3, 6, 7],
    formation_months: [1, 2, 5, 6],
    production_months: [12, 1, 2, 3],
    cleaning_months: [12, 1, 2, 6, 7],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Jan–Fev) e Primavera (Mai–Jun)",
        stage: "1.º e 2.º ano (Arbusto Jovem)",
        summary: "Retirar os botões florais no 1.º ano para engrossar as raízes e selecionar 5 a 7 hastes eretas vigorosas vindas da coroa."
      },
      production: {
        season: "Inverno antes do abrolhamento (Dez–Mar)",
        stage: "Anual em arbustos adultos",
        summary: "Privilegiar varas jovens de 1 a 3 anos (casca avermelhada) e desbastar raminhos finos nas pontas para obter mirtilos graúdos."
      },
      cleaning: {
        season: "Inverno (Dez–Fev) e Pós-colheita (Jun–Jul)",
        stage: "Rejuvenescimento de canas velhas",
        summary: "Cortar junto à base 1 a 2 hastes envelhecidas (> 4 anos, casca cinzenta rugosa) e remover ramos baixos rasteiros ou secos."
      }
    },
    when_info: "Inverno até início de março antes do abrolhamento dos botões, com limpeza ligeira após a colheita em junho–julho.",
    pruning_types: "Poda de formação da touceira, poda de produção em varas jovens e poda de rejuvenescimento na base.",
    how: "Remover os ramos com mais de 4 anos (madeira acinzentada e rugosa) cortando junto à base. Deixar varas jovens de cor avermelhada ou esverdeada que produzem as melhores bagas.",
    tools: "Tesoura de poda bypass afiada.",
    tips: "O mirtilo prefere solos ácidos; após a poda, renove a cobertura morta com casca de pinheiro e caruma.",
    difficulty: "Fácil"
  },

  // --- ORNAMENTAIS E ARBUSTOS ---
  {
    id: "poda_roseira",
    name: "Roseira de Jardim",
    emoji: "🌹",
    color: "#be123c",
    image_url: "./images/podas/roseira.jpg",
    category: "Ornamentais e Arbustos",
    when_months: [1, 2, 3, 5, 6, 7, 8, 9, 10],
    formation_months: [2, 3, 5],
    production_months: [1, 2, 3, 6, 7, 8, 9],
    cleaning_months: [1, 2, 3, 5, 6, 7, 8, 10],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Fev–Mar) e Maio",
        stage: "1.º e 2.º ano (Roseira Jovem)",
        summary: "Selecionar 3 a 5 hastes principais abertas em taça a partir da base, cortando em bisel 5 mm acima de uma gema voltada para fora."
      },
      production: {
        season: "Inverno (Jan–Mar) e Verão (Jun–Set)",
        stage: "Floração principal e refloração",
        summary: "Rebaixar hastes a 3–4 gemas no fim do inverno para rosas grandes e aparar flores murchas no verão para novas vagas de rosas."
      },
      cleaning: {
        season: "Inverno (Jan–Mar) e Primavera/Outono",
        stage: "Sanitária e rejuvenescimento",
        summary: "Arrancar ladrões bravos abaixo do enxerto, cortar madeira seca/escura ou ramos cruzados no centro e renovar hastes lenhosas."
      }
    },
    when_info: "Poda principal no fim do inverno (janeiro a março) e poda contínua de limpeza e refloração da primavera ao outono (maio a outubro).",
    pruning_types: "Poda de formação em taça aberta, poda de floração/produção de rosas e poda de limpeza/rejuvenescimento.",
    how: "Retirar toda a madeira morta, doente e os raminhos fracos. Deixar 3 a 5 hastes fortes e saudáveis cortadas a 3 ou 4 gemas do chão. Corte a 45 graus, 5 mm acima de uma gema apontada para fora.",
    tools: "Tesoura de poda afiada com lâminas desinfetadas e luvas de cabedal compridas anti-espinhos.",
    tips: "Corte sempre no sentido exterior para que os novos ramos cresçam em forma de taça aberta, permitindo sol no centro e evitando fungos.",
    difficulty: "Fácil"
  },
  {
    id: "poda_hortensia",
    name: "Hortênsia",
    emoji: "🪻",
    color: "#2563eb",
    image_url: "./images/podas/hortensia.jpg",
    category: "Ornamentais e Arbustos",
    when_months: [2, 3, 7, 8, 9],
    formation_months: [2, 3, 5],
    production_months: [2, 3],
    cleaning_months: [2, 3, 7, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Fim de Inverno (Fev–Mar) e Primavera (Mai)",
        stage: "1.º e 2.º ano (Arbusto Jovem)",
        summary: "Equilibrar a touceira escolhendo hastes basais bem distribuídas, preservando os gomos terminais que darão as primeiras flores."
      },
      production: {
        season: "Final do Inverno (Fevereiro e Março)",
        stage: "Anual para máxima floração",
        summary: "Cortar apenas as hastes que deram flor no ano anterior logo acima do 1.º par de gomos grossos, sem cortar os ramos novos intactos."
      },
      cleaning: {
        season: "Fim de Inverno (Fev–Mar) e Verão (Jul–Set)",
        stage: "Rejuvenescimento de hastes velhas",
        summary: "Cortar rente à base 1/3 das canas lenhosas mais velhas (> 3 anos) no fim do inverno e retirar inflorescências queimadas no verão."
      }
    },
    when_info: "Final do inverno (fevereiro e março) quando passa o risco de geadas fortes, e limpeza de flores murchas de julho a setembro.",
    pruning_types: "Poda de formação da touceira, poda de floração/produção e poda de limpeza e rejuvenescimento na base.",
    how: "Cortar as hastes com flores secas do ano anterior logo acima do primeiro par de gomos grossos e sadios. Remover ramos muito velhos ou entrelaçados na base para estimular novos rebentos vigorosos.",
    tools: "Tesoura de poda de mão.",
    tips: "Não corte ramos novos que não deram flor no ano anterior: é precisamente nesses ramos que surgirão as maiores flores deste ano.",
    difficulty: "Fácil"
  },
  {
    id: "poda_lavanda",
    name: "Alfazema (Lavanda)",
    emoji: "💜",
    color: "#8b5cf6",
    image_url: "./images/podas/lavanda.jpg",
    category: "Ornamentais e Arbustos",
    when_months: [3, 4, 7, 8, 9],
    formation_months: [3, 4, 5, 8],
    production_months: [7, 8, 9],
    cleaning_months: [3, 4, 8, 9],
    pruning_calendar: {
      formation: {
        season: "Primavera (Mar–Mai) e Fim de Verão (Ago)",
        stage: "1.º e 2.º ano (Planta Jovem)",
        summary: "Despontar as pontas verdes na primavera para forçar ramificação compacta desde a base, evitando que fique pernuda e lenhosa."
      },
      production: {
        season: "Verão / Pós-floração (Julho a Setembro)",
        stage: "Anual após a colheita das espigas",
        summary: "Cortar as hastes florais e aparar 2 a 3 cm da folhagem verde em meia-esfera para estimular densa floração no ano seguinte."
      },
      cleaning: {
        season: "Início da Primavera (Mar–Abr) e Fim de Verão (Ago–Set)",
        stage: "Manutenção sanitária sem tocar no lenho velho",
        summary: "Retirar espigas secas e raminhos partidos pelo frio, cortando sempre na zona com folhas verdes (nunca cortar na madeira velha nua)."
      }
    },
    when_info: "Final do verão (julho a setembro) logo após a floração secar, e retoque de formação/limpeza no início da primavera (março–abril).",
    pruning_types: "Poda de formação compacta, poda de produção/floração em almofada e poda de limpeza superficial.",
    how: "Aparar os caules florais secos e cerca de 2 a 3 cm do crescimento verde superior do arbusto, dando formato de meia-esfera.",
    tools: "Tesoura de poda ou tesoura de sebes bem afiada.",
    tips: "NUNCA corte fundo na madeira velha e lenhosa desprovida de folhas, pois a alfazema raramente volta a brotar de madeira velha e pode secar.",
    difficulty: "Fácil"
  }
];

export const DEFAULT_MONDAS = [
  // --- RAÍZES E TUBÉRCULOS ---
  {
    id: "monda_cenoura",
    name: "Cenoura",
    emoji: "🥕",
    color: "#ea580c",
    image_url: "./images/mondas/cenoura.jpg",
    category: "Raízes e Tubérculos",
    when_months: [3, 4, 5, 6, 9, 10],
    when_stage: "Quando as pequenas plântulas atingirem 3 a 5 cm de altura e apresentarem 2 a 3 folhas verdadeiras recortadas.",
    spacing: "Espaçamento final de 5 a 7 cm entre cenouras para raízes grossas e direitas sem deformações.",
    how: "Regar o canteiro 1 hora antes para soltar a terra. Puxar as plântulas excedentárias na vertical suavemente, segurando o solo com a outra mão para não abalar as vizinhas.",
    tips: "A monda liberta óleo essencial aromático que atrai a mosca-da-cenoura: realize a monda ao fim da tarde em dias frescos e comprima ligeiramente o solo à volta das plantas que ficam."
  },
  {
    id: "monda_rabanete",
    name: "Rabanete",
    emoji: "🌱",
    color: "#e11d48",
    image_url: "./images/mondas/rabanete.jpg",
    category: "Raízes e Tubérculos",
    when_months: [3, 4, 5, 6, 9, 10],
    when_stage: "Cerca de 10 a 14 dias após a germinação rápida da sementeira.",
    spacing: "3 a 5 cm de distância entre rabanetes na linha.",
    how: "Desbastar os rebentos mais fracos e amontoados; manter os de folhagem mais baixa e caule mais aprumado.",
    tips: "Se não forem mondados a tempo, os rabanetes espigam prematuramente e as raízes ficam finas, duras e amargas."
  },
  {
    id: "monda_beterraba",
    name: "Beterraba de Mesa",
    emoji: "🟣",
    color: "#9d174d",
    image_url: "./images/mondas/beterraba.jpg",
    category: "Raízes e Tubérculos",
    when_months: [3, 4, 5, 6, 7],
    when_stage: "Quando as folhas atingirem cerca de 5 a 8 cm de altura.",
    spacing: "10 a 12 cm de distância entre raízes para formação de bolbos redondos e generosos.",
    how: "Cada semente de beterraba é na verdade um 'glomérulo' com 2 a 4 sementes: desbaste obrigatório deixando apenas a plântula mais vigorosa de cada grupo.",
    tips: "As folhas jovens avermelhadas retiradas durante o desbaste são extremamente ricas em ferro e deliciosas cruas em saladas ou cozinhadas como espinafre."
  },
  {
    id: "monda_nabo",
    name: "Nabo e Nabiças",
    emoji: "🥬",
    color: "#65a30d",
    image_url: "./images/mondas/nabo.jpg",
    category: "Raízes e Tubérculos",
    when_months: [8, 9, 10, 11],
    when_stage: "3 semanas após a sementeira a lanço típica do outono.",
    spacing: "10 a 15 cm de distância para colheita de nabos grossos (ou 5 cm para colheita contínua de nabiças e grelos).",
    how: "Desbaste manual seletivo arrancando tufos densos.",
    tips: "Os rebentos retirados da monda são as autênticas nabiças tenras tradicionais para o caldo verde e sopas portuguesas."
  },

  // --- FOLHAS E SALADAS ---
  {
    id: "monda_alface",
    name: "Alface de Canteiro",
    emoji: "🥬",
    color: "#16a34a",
    image_url: "./images/mondas/alface.jpg",
    category: "Folhas e Saladas",
    when_months: [2, 3, 4, 5, 6, 9, 10],
    when_stage: "Quando as plântulas começarem a sobrepor as primeiras folhinhas no canteiro.",
    spacing: "25 a 30 cm de compasso final para alfaces de repolho e 15 cm para alfaces de cortar.",
    how: "Desbastar as mais débeis ou estioladas. As plantas sadias arrancadas com raiz intacta podem ser imediatamente transplantadas (repicadas) para outro canteiro húmido.",
    tips: "Nunca deixe as alfaces apertadas: o excesso de humidade entre folhas compactas favorece o míldio e o ataque de caracóis e lesmas."
  },
  {
    id: "monda_espinafre",
    name: "Espinafre Verdadeiro",
    emoji: "🍃",
    color: "#15803d",
    image_url: "./images/mondas/espinafre.jpg",
    category: "Folhas e Saladas",
    when_months: [2, 3, 4, 9, 10],
    when_stage: "Quando as mudas tiverem 4 folhas verdadeiras formadas.",
    spacing: "15 a 20 cm entre plantas na linha.",
    how: "Desbastar mantendo as plantas com rosetas basais mais largas e verdes.",
    tips: "O espinafre não suporta calor forte nem falta de espaço, tendendo a espigar. A monda atempada atrasa a subida a flor e prolonga a colheita de folhas tenras."
  },
  {
    id: "monda_rucula",
    name: "Rúcula",
    emoji: "🥗",
    color: "#16a34a",
    image_url: "./images/mondas/rucula.jpg",
    category: "Folhas e Saladas",
    when_months: [3, 4, 5, 9, 10],
    when_stage: "10 a 15 dias após a sementeira.",
    spacing: "8 a 10 cm entre pés para formar touças folhosas.",
    how: "Arranque cuidadoso com as pontas dos dedos das plantas excessivas.",
    tips: "Aproveite a monda como microvegetais (microgreens) gourmet picantes para temperar queijos, tostas e saladas."
  },
  {
    id: "monda_acelga",
    name: "Acelga de Penacho",
    emoji: "🌱",
    color: "#b91c1c",
    image_url: "./images/mondas/acelga.jpg",
    category: "Folhas e Saladas",
    when_months: [3, 4, 5, 6],
    when_stage: "Quando as mudas medirem cerca de 6 a 8 cm de altura.",
    spacing: "25 a 35 cm entre plantas para permitir o desenvolvimento de grandes pencas e talos carnudos.",
    how: "Eliminar pés fracos e deixar os exemplares com talos mais grossos e eretos.",
    tips: "As acelgas produzem folhas continuamente durante meses se for colhendo as folhas exteriores à medida que crescem."
  },

  // --- ALLIUM ---
  {
    id: "monda_alho",
    name: "Alho",
    emoji: "🧄",
    color: "#a16207",
    image_url: "./images/mondas/alho.jpg",
    category: "Allium",
    when_months: [1, 2, 3, 4, 11, 12],
    when_stage: "Logo no início do surgimento de infestantes após a brotação dos dentes de alho.",
    spacing: "10 a 15 cm entre dentes na linha e 25 cm entre linhas.",
    how: "Monda manual constante com sacho fino e leve. As raízes do alho são superficiais e fracas competidoras contra ervas espontâneas.",
    tips: "Mantenha o canteiro 100% limpo de ervas daninhas nos primeiros 3 meses para garantir cabeças de alho grandes e densas."
  },
  {
    id: "monda_alho_porro",
    name: "Alho-francês (Alho-porro)",
    emoji: "🥢",
    color: "#059669",
    image_url: "./images/mondas/alho_porro.jpg",
    category: "Allium",
    when_months: [3, 4, 5, 6],
    when_stage: "Em alfobre (quando as mudas tiverem a grossura de uma agulha) ou após o transplante.",
    spacing: "15 cm entre plantas na linha e 30 cm entre linhas.",
    how: "Desbastar mudas frágeis. No transplante para o local definitivo, aparar ligeiramente as raízes e as pontas das folhas para estimular o enraizamento.",
    tips: "Faça amontoa gradual (aconchegar terra ao pé do talo) para branquear a haste e torná-la tenra e doce."
  },
  {
    id: "monda_cebola",
    name: "Cebola",
    emoji: "🧅",
    color: "#d97706",
    image_url: "./images/mondas/cebola.jpg",
    category: "Allium",
    when_months: [1, 2, 3, 4],
    when_stage: "Quando os caules tiverem 10 a 12 cm de altura em alfobre antes do transplante ou sementeira direta.",
    spacing: "12 a 15 cm entre bolbos para permitir o engrossamento uniforme da cebola.",
    how: "Remover pés finos e amontoados. Não enterrar demasiado o bolbo no solo; o bolbo deve desenvolver-se praticamente à superfície.",
    tips: "Evite adubos ricos em azoto após a formação do bolbo para não apodrecer a cebola na cura."
  },

  // --- SOLANÁCEAS ---
  {
    id: "monda_tomateiro",
    name: "Tomateiro (Desladroamento e Monda)",
    emoji: "🍅",
    color: "#dc2626",
    image_url: "./images/mondas/tomateiro.jpg",
    category: "Solanáceas",
    when_months: [5, 6, 7, 8],
    when_stage: "Durante todo o crescimento ativo do tomateiro tutorado (todas as semanas).",
    spacing: "Manter apenas 1 haste principal (ou 2 no máximo) por tutor ou estaca.",
    how: "Retirar com os dedos os rebentos axilares ('ladrões') que nascem na junção das folhas com o caule principal logo que atinjam 2 a 4 cm. Mais tarde, fazer a monda de frutos retirando tomates minúsculos mal formados no cacho.",
    tips: "Faça o desladroamento em dias quentes e ensolarados para que a pequena ferida cicatrize em minutos, impedindo a entrada de esporos de míldio."
  },
  {
    id: "monda_pimenteiro",
    name: "Pimenteiro (Pimentos e Malaguetas)",
    emoji: "🫑",
    color: "#16a34a",
    image_url: "./images/mondas/pimenteiro.jpg",
    category: "Solanáceas",
    when_months: [5, 6, 7],
    when_stage: "Logo no início da ramificação em 'Y' da planta.",
    spacing: "40 a 50 cm de distância entre plantas na horta.",
    how: "Retirar a 'flor-rei' (a primeira flor solitária que nasce no meio da primeira bifurcação em Y) para a planta crescer com mais vigor e produzir dezenas de pimentos laterais em vez de apenas um fruto inicial gigante.",
    tips: "Desbastar os rebentos baixos abaixo da primeira ramificação para arejar a base e evitar podridão das folhas."
  },
  {
    id: "monda_beringela",
    name: "Beringela",
    emoji: "🍆",
    color: "#7c2d12",
    image_url: "./images/mondas/beringela.jpg",
    category: "Solanáceas",
    when_months: [5, 6, 7],
    when_stage: "Durante o vingamento das primeiras flores e frutos.",
    spacing: "50 a 60 cm entre plantas.",
    how: "Limpar rebentos axilares baixos. Deixar 4 a 6 frutos bem formados por planta e retirar os frutos excedentes tardios para garantir beringelas grandes e brilhantes.",
    tips: "A beringela necessita de muito sol e calor constante no pé; cubra o solo com palha para reter calor e humidade."
  },

  // --- CUCURBITÁCEAS ---
  {
    id: "monda_curgete",
    name: "Curgete",
    emoji: "🥒",
    color: "#15803d",
    image_url: "./images/mondas/curgete.jpg",
    category: "Cucurbitáceas",
    when_months: [4, 5, 6],
    when_stage: "Sementeira em cova: quando germinarem 3 a 4 plantinhas com as primeiras folhas.",
    spacing: "Deixar apenas 1 planta (a mais robusta) por cova, com 80 a 100 cm de distância entre covas.",
    how: "Cortar com tesoura rente ao chão as plantas excedentes em vez de arrancar pelas raízes, pois as cucurbitáceas têm raízes frágeis que se danificam facilmente.",
    tips: "Colher as curgetes com 15 a 20 cm: quanto mais curgetes colher, mais flores fêmeas a planta continuará a produzir sem descanso."
  },
  {
    id: "monda_abobora",
    name: "Abóbora",
    emoji: "🎃",
    color: "#f59e0b",
    image_url: "./images/mondas/abobora.jpg",
    category: "Cucurbitáceas",
    when_months: [4, 5, 6],
    when_stage: "Após o nascimento das plântulas na cova e mais tarde durante o vingamento dos frutos.",
    spacing: "Deixar 1 a 2 plantas por cova (espaçadas de 1.5 a 2 metros).",
    how: "Na fase inicial, desbaste de plantas. Na fase adulta (monda de frutos), desponte as guias após 2 a 3 abóboras vingadas para que a planta canalize todo o açúcar para esses frutos.",
    tips: "Coloque uma telha, tábua ou palha seca debaixo de cada fruto no chão para que a humidade da terra não apodreça a casca."
  },
  {
    id: "monda_melao",
    name: "Melão e Melancia",
    emoji: "🍈",
    color: "#ca8a04",
    image_url: "./images/mondas/melao.jpg",
    category: "Cucurbitáceas",
    when_months: [4, 5, 6],
    when_stage: "Quando as guias começarem a ramificar e formarem os primeiros frutos do tamanho de uma noz.",
    spacing: "Deixar apenas 2 a 3 melões por planta.",
    how: "Despontar a guia principal acima da 4ª ou 5ª folha para forçar ramos laterais floríferos. Fazer a monda de frutos eliminando os mais pequenos ou disformes.",
    tips: "Menos frutos por planta significa frutos muito mais doces, aromáticos e sumarentos."
  },

  // --- CEREAIS E LEGUMINOSAS ---
  {
    id: "monda_milho",
    name: "Milho Doce e Grão",
    emoji: "🌽",
    color: "#eab308",
    image_url: "./images/mondas/milho.jpg",
    category: "Cereais",
    when_months: [4, 5, 6],
    when_stage: "Quando o milho atingir cerca de 10 a 15 cm de altura (o tamanho de um palmo).",
    spacing: "20 a 25 cm entre plantas na linha e 70 a 80 cm entre linhas.",
    how: "Deixar apenas 1 pé forte por golpe. Eliminar afilhos ou ladrões secundários na base do colmo para concentrar energia na espiga principal.",
    tips: "O milho é polinizado pelo vento: plante sempre em blocos de 3 a 4 linhas paralelas curtas em vez de uma única linha comprida para garantir espigas cheias de grãos."
  },
  {
    id: "monda_favas",
    name: "Favas e Ervilhas",
    emoji: "🫛",
    color: "#15803d",
    image_url: "./images/mondas/favas.jpg",
    category: "Leguminosas",
    when_months: [10, 11, 12, 1],
    when_stage: "Quando as favas tiverem cerca de 10 cm de altura e mais tarde na desponta de primavera.",
    spacing: "15 a 20 cm entre plantas e 40 a 50 cm entre linhas.",
    how: "Monda manual das ervas daninhas de inverno. Na primavera, despontar o topo apical da fava (remover os últimos 5 a 10 cm) após o aparecimento de 5 a 6 andares de vagens.",
    tips: "Despontar o topo da fava elimina o poiso preferido do piolho-negro (pulgão) e concentra a seiva nas vagens inferiores, que engordam rapidamente."
  },

  // --- BRÁSSICAS ---
  {
    id: "monda_couve",
    name: "Couves e Repolhos",
    emoji: "🥦",
    color: "#047857",
    image_url: "./images/mondas/couve.jpg",
    category: "Brássicas",
    when_months: [6, 7, 8, 9, 10],
    when_stage: "Em alfobre (desbaste para não estiolarem) e na horta após o enraizamento.",
    spacing: "40 a 60 cm de distância no transplante final.",
    how: "Selecionar no alfobre apenas as mudas de pé grosso, caule firme e sem nós na raiz. Na horta, sachar o canteiro eliminando infestantes.",
    tips: "Faça amontoa aconchegando terra húmida ao redor do caule principal para dar estabilidade contra ventos fortes de outono e estimular novas raízes adventícias."
  },

  // --- ERVAS AROMÁTICAS ---
  {
    id: "monda_salsa",
    name: "Salsa e Coentros",
    emoji: "🌿",
    color: "#10b981",
    image_url: "./images/mondas/salsa.jpg",
    category: "Ervas Aromáticas",
    when_months: [3, 4, 5, 6, 9, 10],
    when_stage: "Quando as sementeiras densas formarem pequenos tufos de 4 a 6 cm de altura.",
    spacing: "10 a 15 cm entre tufos.",
    how: "Arranque manual com cuidado dos pés em excesso.",
    tips: "Os pés retirados já têm aroma concentrado e devem ser usados imediatamente na cozinha para temperar peixes, caldeiradas ou saladas."
  },
  {
    id: "monda_manjericao",
    name: "Manjericão",
    emoji: "🌱",
    color: "#059669",
    image_url: "./images/mondas/manjericao.jpg",
    category: "Ervas Aromáticas",
    when_months: [4, 5, 6, 7],
    when_stage: "Quando o manjericão tiver 4 a 5 pares de folhas verdadeiras.",
    spacing: "20 a 25 cm entre plantas para permitir o desenvolvimento de um arbusto denso.",
    how: "Desbaste de mudas fracas. Fazer o beliscão (desponta do topo central) para quebrar a dominância apical e forçar o crescimento de ramos laterais.",
    tips: "Corte imediatamente qualquer botão floral que comece a despontar: a floração torna as folhas de manjericão amargas e interrompe o crescimento de folhagem nova."
  }
];
