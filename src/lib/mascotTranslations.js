const rows = `
mascot.navTitle|Mascote & Armazém|Mascote e Armazém|Pet & Warehouse|Mascota y almacén
mascot.navDesc|Cuida da tua companhia e guarda as colheitas|Cuide da sua companhia e guarde as colheitas|Care for your companion and store your harvests|Cuida a tu compañía y guarda tus cosechas
mascot.title|Um pequeno amigo, uma horta viva.|Um pequeno amigo, uma horta viva.|A little friend. A thriving garden.|Un pequeño amigo, un huerto lleno de vida.
mascot.subtitle|O cuidado da tua horta também faz crescer esta amizade.|O cuidado da sua horta também faz crescer esta amizade.|Every act of garden care helps this friendship grow.|Cada cuidado de tu huerto hace crecer esta amistad.
mascot.yourCompanion|A tua companhia da horta|Sua companhia da horta|Your garden companion|Tu compañía del huerto
mascot.defaultName|Brotinho|Brotinho|Sprig|Brote
mascot.goMascot|Visitar mascote|Visitar mascote|Visit pet|Visitar mascota
mascot.warehouse|Armazém|Armazém|Warehouse|Almacén
mascot.backFarm|Minha Quinta|Minha Fazenda|My Farm|Mi finca
mascot.tasks|Tarefas de hoje|Tarefas de hoje|Today's tasks|Tareas de hoy
mascot.settings|Personalizar|Personalizar|Customize|Personalizar
mascot.level|Nível {level}|Nível {level}|Level {level}|Nivel {level}
mascot.xpNext|{xp} XP para o próximo nível|{xp} XP para o próximo nível|{xp} XP to the next level|{xp} XP para el siguiente nivel
mascot.nextEvolution|Nova evolução no nível {level}|Nova evolução no nível {level}|Next evolution at level {level}|Nueva evolución en el nivel {level}
mascot.evolution|A tua mascote evoluiu!|Sua mascote evoluiu!|Your pet has evolved!|¡Tu mascota ha evolucionado!
mascot.levelUp|Novo nível!|Novo nível!|Level up!|¡Nuevo nivel!
mascot.fullness|Saciedade|Saciedade|Fullness|Saciedad
mascot.hydration|Hidratação|Hidratação|Hydration|Hidratación
mascot.fullnessHint|Começa a 100 e perde 20 pontos por dia. Alimenta-a com as tuas colheitas.|Começa em 100 e perde 20 pontos por dia. Alimente-a com suas colheitas.|Starts at 100 and loses 20 points each day. Feed it with your harvests.|Empieza en 100 y pierde 20 puntos al día. Aliméntala con tus cosechas.
mascot.hydrationHint|Acompanha os cuidados de rega da tua quinta.|Acompanha os cuidados de rega da sua fazenda.|Follows your farm's watering care.|Sigue los cuidados de riego de tu finca.
mascot.rainNow|Chuva estimada agora|Chuva estimada agora|Estimated rain now|Lluvia estimada ahora
mascot.rainHint|A mascote aproveita a chuva; confirma a humidade das plantações protegidas.|A mascote aproveita a chuva; confira a umidade dos plantios protegidos.|Your pet enjoys the rain; check the moisture of sheltered crops.|Tu mascota aprovecha la lluvia; comprueba la humedad de los cultivos protegidos.
mascot.noCrops|Adiciona uma plantação ativa para acompanhar a hidratação.|Adicione um plantio ativo para acompanhar a hidratação.|Add an active planting to track hydration.|Añade un cultivo activo para seguir la hidratación.
mascot.waterCare|{cared} de {total} plantações com cuidados em dia|{cared} de {total} plantios com os cuidados em dia|{cared} of {total} plantings up to date with watering care|{cared} de {total} cultivos con los cuidados al día
mascot.happy|Hoje sabe bem estar na horta.|Hoje é bom estar na horta.|A lovely day to be in the garden.|Qué bien se está hoy en el huerto.
mascot.hungry|Uma colheita deliciosa vinha mesmo a calhar!|Uma colheita deliciosa seria uma boa!|A delicious harvest would be lovely!|¡Me vendría genial una cosecha deliciosa!
mascot.thirsty|Vamos ver como está a rega da horta?|Vamos ver como está a rega da horta?|Shall we check the garden's watering?|¿Vemos cómo va el riego del huerto?
mascot.full|Estou de barriguinha cheia!|Estou de barriguinha cheia!|My tummy is full!|¡Tengo la barriguita llena!
mascot.yum|Que delícia! +{gained} saciedade · +{xp} XP|Que delícia! +{gained} saciedade · +{xp} XP|Yummy! +{gained} fullness · +{xp} XP|¡Qué rico! +{gained} saciedad · +{xp} XP
mascot.feed|Lançar alimento|Lançar alimento|Throw food|Lanzar alimento
mascot.feedHint|Arrasta o alimento em direção à mascote e solta. Também podes usar o botão.|Arraste o alimento em direção à mascote e solte. Você também pode usar o botão.|Drag the food towards your pet and release. You can also use the button.|Arrastra el alimento hacia tu mascota y suéltalo. También puedes usar el botón.
mascot.feedHandle|Arrastar {food} em direção à mascote|Arrastar {food} em direção à mascote|Drag {food} towards your pet|Arrastrar {food} hacia tu mascota
mascot.chooseFood|Escolhe um alimento no armazém|Escolha um alimento no armazém|Choose food from the warehouse|Elige un alimento del almacén
mascot.selectedFood|Pronto para lançar|Pronto para lançar|Ready to throw|Listo para lanzar
mascot.throwAgain|Lança em direção à mascote ou usa o botão.|Lance em direção à mascote ou use o botão.|Throw towards your pet or use the button.|Lanza hacia tu mascota o usa el botón.
mascot.stock|{quantity} unidades|{quantity} unidades|{quantity} units|{quantity} unidades
mascot.nutrition|+{nutrition} saciedade por unidade|+{nutrition} saciedade por unidade|+{nutrition} fullness per unit|+{nutrition} saciedad por unidad
mascot.inventoryTitle|Da tua horta para o teu amigo|Da sua horta para seu amigo|From your garden to your friend|De tu huerto a tu amigo
mascot.inventoryHint|As colheitas que registas na Minha Quinta ficam aqui. Cada lançamento usa uma unidade.|As colheitas que você registra na Minha Fazenda ficam aqui. Cada lançamento usa uma unidade.|Harvests you record in My Farm appear here. Each throw uses one unit.|Las cosechas que registras en Mi finca aparecen aquí. Cada lanzamiento usa una unidad.
mascot.emptyTitle|O armazém está à espera da primeira colheita.|O armazém está esperando a primeira colheita.|Your warehouse is waiting for its first harvest.|Tu almacén espera la primera cosecha.
mascot.emptyHint|Regista uma colheita na tua quinta para guardar alimentos e alimentar a mascote.|Registre uma colheita na sua fazenda para guardar alimentos e alimentar a mascote.|Record a harvest on your farm to store food and feed your pet.|Registra una cosecha en tu finca para guardar alimentos y alimentar a tu mascota.
mascot.feedEmpty|Este alimento já não está disponível.|Este alimento não está mais disponível.|This food is no longer available.|Este alimento ya no está disponible.
mascot.feedError|Não foi possível guardar a alimentação. Tenta novamente.|Não foi possível salvar a alimentação. Tente novamente.|Could not save this feeding. Try again.|No se pudo guardar la alimentación. Inténtalo de nuevo.
mascot.loadError|Não foi possível carregar todos os dados. Os cuidados da mascote não foram alterados.|Não foi possível carregar todos os dados. Os cuidados da mascote não foram alterados.|Some data could not be loaded. Your pet's care has not been changed.|No se pudieron cargar todos los datos. Los cuidados de tu mascota no han cambiado.
mascot.storageError|Não foi possível guardar neste dispositivo. Verifica o armazenamento do navegador e tenta novamente.|Não foi possível salvar neste dispositivo. Confira o armazenamento do navegador e tente novamente.|Could not save on this device. Check your browser storage and try again.|No se pudo guardar en este dispositivo. Comprueba el almacenamiento del navegador e inténtalo de nuevo.
mascot.retry|Tentar novamente|Tentar novamente|Try again|Intentar de nuevo
mascot.loading|A preparar o teu jardim…|Preparando seu jardim…|Preparing your garden…|Preparando tu jardín…
mascot.disabledTitle|A tua mascote está em pausa.|Sua mascote está em pausa.|Your pet is paused.|Tu mascota está en pausa.
mascot.disabledHint|Ativa-a nas definições quando quiseres. As tuas colheitas continuam guardadas no armazém.|Ative-a nas configurações quando quiser. Suas colheitas continuam guardadas no armazém.|Enable it in settings whenever you like. Your harvests remain in the warehouse.|Actívala en ajustes cuando quieras. Tus cosechas siguen guardadas en el almacén.
mascot.reward|Receber recompensa de rega|Receber recompensa de rega|Claim watering reward|Recibir recompensa de riego
mascot.rewardHint|Os cuidados de rega dão 40 XP automaticamente, uma vez por dia.|Os cuidados de rega dão 40 XP automaticamente, uma vez por dia.|Watering care earns 40 XP automatically, once a day.|Los cuidados de riego dan 40 XP automáticamente, una vez al día.
mascot.rewardClaimed|Recompensa de hoje recebida|Recompensa de hoje recebida|Today's reward claimed|Recompensa de hoy recibida
mascot.rewardSuccess|Cuidados reconhecidos! +{xp} XP|Cuidados reconhecidos! +{xp} XP|Care rewarded! +{xp} XP|¡Cuidados recompensados! +{xp} XP
mascot.rewardNotReady|Ainda há cuidados de rega para confirmar.|Ainda há cuidados de rega para confirmar.|There is still watering care to check.|Aún quedan cuidados de riego por comprobar.
mascot.settings.title|Uma companhia à tua maneira|Uma companhia do seu jeito|A companion your way|Una compañía a tu manera
mascot.settings.subtitle|Escolhe quem vai acompanhar o crescimento da tua horta.|Escolha quem vai acompanhar o crescimento da sua horta.|Choose who will join you as your garden grows.|Elige quién acompañará el crecimiento de tu huerto.
mascot.settings.name|Nome da mascote|Nome da mascote|Pet's name|Nombre de la mascota
mascot.settings.namePlaceholder|Como se vai chamar?|Como vai se chamar?|What shall we call them?|¿Cómo se llamará?
mascot.settings.species|Escolher mascote|Escolher mascote|Choose a pet|Elegir mascota
mascot.settings.accessory|Um toque especial|Um toque especial|A special touch|Un toque especial
mascot.settings.enabled|Mostrar a minha mascote|Mostrar minha mascote|Show my pet|Mostrar mi mascota
mascot.settings.progressHint|Alimentar e cuidar da rega dá XP. A mascote evolui ao subir de nível; trocar o aspeto mantém o teu progresso.|Alimentar e cuidar da rega dá XP. A mascote evolui ao subir de nível; trocar a aparência mantém seu progresso.|Feeding and watering care earn XP. Your pet evolves as it levels up; changing its look keeps your progress.|Alimentar y cuidar el riego da XP. Tu mascota evoluciona al subir de nivel; cambiar su aspecto conserva tu progreso.
mascot.species.sprout|Brotinho|Brotinho|Sprout|Brote
mascot.species.fox|Raposinha|Raposinha|Little fox|Zorrito
mascot.species.bunny|Coelhinho|Coelhinho|Little bunny|Conejito
mascot.accessory.none|Ao natural|Ao natural|Natural|Al natural
mascot.accessory.flower|Flor|Flor|Flower|Flor
mascot.accessory.hat|Chapéu de palha|Chapéu de palha|Straw hat|Sombrero de paja
mascot.accessory.bow|Laço|Laço|Bow|Lazo
mascot.accessory.leaf|Folha|Folha|Leaf|Hoja
mascot.percent|{value} de 100|{value} de 100|{value} out of 100|{value} de 100
`;

export const MASCOT_TRANSLATIONS = { 'pt-PT': {}, 'pt-BR': {}, en: {}, es: {} };
for (const row of rows.trim().split('\n')) {
  const [key, pt, br, en, es] = row.split('|');
  MASCOT_TRANSLATIONS['pt-PT'][key] = pt;
  MASCOT_TRANSLATIONS['pt-BR'][key] = br;
  MASCOT_TRANSLATIONS.en[key] = en;
  MASCOT_TRANSLATIONS.es[key] = es;
}
