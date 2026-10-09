# Mascote e armazém virtual

O módulo `src/lib/mascot.js` guarda definições e um histórico em `hortaviva_mascot_v1`. A fome começa em100 e diminui20 por dia civil no fuso escolhido, limitada a0–100. A mascote nunca morre. Mudar nome, espécie ou acessório não reinicia o histórico; desativar a opção impede alimentação/recompensas, sem bloquear a quinta.

## Colheita e alimentação

`harvestPlanting(idOrPlanting, quantityData, options)` procura a plantação realmente guardada. Exige uma data de plantação válida, já chegada, e quantidade inteira positiva: `rows × columns` no modo `grid` ou `plant_count` no modo `count`. Não interpreta a quantidade textual antiga, área, previsão de rendimento ou uma ficha de catálogo como stock. Cada planta registada corresponde a uma unidade **virtual**, não a uma estimativa de quilos ou frutos reais.

Apenas a ação explícita de colheita cria o evento `harvest:<plantingId>`. A mudança automática de estado nunca cria alimentos. Uma plantação antiga já marcada Colhida pode ser registada explicitamente com quantidade confirmada. Repetir a ação, importar cópias antigas ou mudar o estado não duplica essa colheita; uma nova cultura deve ter um novo registo.

O evento é a fonte do stock e do estado Colhida. A lista da quinta é uma projeção recuperável: se a escrita secundária dessa lista falhar, `LocalEntityStore.list` e a exportação continuam a mostrar o estado definido no histórico. Se a escrita principal falhar, nenhuma colheita é creditada.

`feedMascot(foodKey, options)` consome uma unidade identificada da colheita. Não consome quando a fome já está em100 ou não há stock. Fava vale3, feijão5; os restantes valores são pontos de jogo, sem significado nutricional nem recomendação de alimentação animal. O ganho é limitado pelo espaço até100. Cada ponto realmente reposto vale5XP.

As cópias são fundidas por união dos eventos. A mesma unidade só pode contar uma vez; conflitos entre dispositivos usam ordem por data e identificador. Alimentações já presentes não desaparecem quando chega uma cópia mais antiga. O histórico é local e editável pelo proprietário; não constitui um sistema de recompensas protegido por servidor. A resolução de operações concorrentes pode ajustar o resultado inicialmente apresentado por um dispositivo offline.

## Hidratação e progressão

`getMascotHydration` é puro: calcula a proporção de plantações ativas com cuidados em dia, usando os intervalos existentes, a última rega e os avisos de calor. Não incentiva regas adicionais de plantas já cuidadas hoje. Sem plantações ativas, devolve0 e uma explicação.

A chuva **estimada para o intervalo atual** pode encher a taça virtual da mascote. Requer meteorologia utilizável, ativada, do local selecionado, com precipitação positiva e símbolo de chuva. Previsões futuras, dados expirados/offline e outra localização não contam. Isto nunca marca uma planta como regada, incluindo plantas em estufa ou no interior.

`claimHydrationReward` recalcula os cuidados a partir da quinta e regas guardadas. Concede40XP, no máximo uma vez por data local, quando os cuidados estão completos ou a taça recebe a chuva atual estimada. Um valor arbitrário fornecido pela interface não permite reclamar a recompensa.

O nível inicial é1, com0XP; cada100XP acrescenta um nível. Há evolução nos níveis5,10,15,20,30,40,50,70,90,110,160,210,310,410 e depois a cada100 níveis. A evolução mantém a espécie escolhida.

## Persistência e testes

O backup versão5 inclui `mascot` e `lastWatered`. Ambos participam no isolamento e recuperação de contas Google. As regas usam a data válida mais recente por plantação; a comida consumida não é recriada pela restauração de uma cópia anterior da mesma conta. Limpar os dados do navegador elimina a cópia local, pelo que a cópia Drive ou exportada continua importante.

Verificação: `node --test scripts/mascot.test.js`. Inclui quantidades, colheita única, falhas de armazenamento, fome/fusos, alimentação, fusão concorrente, evolução, hidratação/chuva/calor, XP diário, restauração e isolamento Google.
