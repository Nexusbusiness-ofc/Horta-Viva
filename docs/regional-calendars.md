# Calendários regionais: modelo e limites

O catálogo de origem da Horta Viva é uma referência portuguesa. O motor regional fornece **janelas indicativas**, nunca calendários agronómicos locais certificados. Exige preferências confirmadas (`onboarded`), país e um perfil climático utilizável antes de atribuir meses. Os textos gerais do catálogo continuam a ser informação de referência; a adaptação dos meses não valida todas as suas instruções para outra região.

## API e representação

`src/lib/regionalClimate.js` exporta:

- `getClimateProfile(preferences)`: `id`/`climateKey`, `hemisphere`, `configured`, `calendarReady`, `inferred`, `cold`, `latitude`, `growingEnvironment`, `wetSeasonMonths`, `notes`/`noteKeys` e `isEstimate`.
- `getLocalDateString(date, preferences)` e `getLocalMonth(date, preferences)`: data e mês **civis** no fuso configurado. O mês é 1–12 e não é deslocado pelo hemisfério.
- `getReferenceMonth(month, preferences)`: equivalência com o calendário temperado de referência; seis meses de diferença no Sul. Retorna `null` para trópicos, clima árido ou configuração insuficiente.
- `getRegionalSeason(date, preferences)`: `inverno`, `primavera`, `verao`, `outono`, `tropical`, `arid` ou `unknown`. São categorias meteorológicas amplas, não fases fenológicas.
- `regionalizeItems(key, items, preferences)`: adapta `sow_months`, `plant_months`, `harvest_months`, `when_months` e `season_months`.
- `restoreRegionalOriginal(item)`, `normalizeMonths`, `shiftMonths`, `getCropClimateGroup` e `getRegionalAIContext`.

Cada item adaptado conserva os campos originais em `source_calendar`. `regional_adaptation` contém `status` (`estimate`, `needs_configuration`, `local_data_required`), `suitability` (`conditional`, `not_recommended`), método e notas. `conditional` significa que a janela depende das condições, não que a cultura foi validada para o local.

A cache `hv_offline_v9_` guarda só os originais. A vista é adaptada após a leitura; alterações de preferências e serialização JSON não acumulam deslocações. As datas de progresso da plantação e agrupamento de tarefas usam dias civis no fuso escolhido. Uma data prevista de colheita continua a ser uma estimativa do registo, sem confirmação automática de maturação real.

## Regras implementadas

**Inferência aproximada:** com clima `auto`, a latitude abaixo de 23,5° indica tropical, a partir de 55° indica continental/frio e o intervalo intermédio indica temperado. Portugal/Espanha entre 30° e 43° recebem mediterrânico. O Brasil não recebe um único clima pelo país: por exemplo, uma latitude de −25° resulta em temperado. Estas faixas são heurísticas da aplicação; não equivalem a Köppen, normais meteorológicas, altitude ou microclima. O utilizador deve poder corrigir o clima. Sem latitude, só há algumas equivalências de hemisfério e a referência portuguesa; locais ambíguos exigem mais configuração.

**Temperado/mediterrânico:** os meses originais são conservados no Norte e deslocados seis meses no Sul. A diferença entre climas temperados locais não é resolvida por essa deslocação. Confirmação de geadas, cultivar, temperatura e solo continua necessária.

**Continental/frio:** usa uma janela curta aproximada: culturas de calor em maio/junho e colheita no verão do hemisfério respetivo; culturas frescas têm uma janela mais ampla. Fruteiras sensíveis ao frio ficam sem janela exterior recomendada. Podas de fruteiras de caroço usam primavera/verão; outras operações continuam dependentes da fase real. Estas tabelas são estimativas próprias, não transcrições de calendários regionais oficiais.

**Tropical:** não desloca os meses portugueses. Culturas de calor e perenes de clima ameno podem apresentar os 12 meses como possibilidades condicionais. Se forem indicados `wetSeasonMonths`, a sementeira/plantação usa esses meses fornecidos pelo utilizador. A seleção não confirma drenagem, excesso de chuva ou aptidão de todas as variedades. Culturas frescas exigem altitude/temperaturas amenas e orientação local; fruteiras com exigência de frio não são recomendadas sem validação de cultivar de baixo frio. Nestes casos os meses ficam vazios.

**Árido:** sem dados locais de água, calor e rega, não atribui meses. **Estufa e vaso:** acrescentam condições de manejo, sem pressupor climatização ou eliminar limites do clima. **Cogumelos:** a época de referência nunca prova presença local ou comestibilidade; nos trópicos e clima árido não é extrapolada.

As aplicações automáticas de produtos de tratamento da referência portuguesa não são agendadas fora de Portugal nem para perfis tropical/árido. Mesmo em Portugal, as referências existentes a produtos exigem verificação independente do rótulo, autorização, cultura e condições; o motor não faz essa validação. O guia de referência tem metadados explícitos de autorização local necessária.

Os dois clientes Gemini recebem país, região, localidade, coordenadas, clima, fuso, ambiente e língua selecionada como contexto de sistema. Devem pedir os dados essenciais em falta, distinguir hipóteses de observações e evitar inventar meteorologia ou certeza. As chaves JSON e valores canónicos mantêm-se estáveis; o texto humano deve usar a língua escolhida. Este contexto orienta a IA, mas não garante a exatidão das respostas.

## Fontes primárias e alcance

As fontes fundamentam os princípios, **não validam as tabelas globais aproximadas**:

- [University of Minnesota Extension — Planting the vegetable garden](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/planting-the-vegetable-garden): distingue culturas frescas e de calor; as sensíveis devem esperar pela última geada local.
- [UMN Extension — A Minnesota guide to garden timing](https://extension.umn.edu/about/our-stories/news/yard-and-garden-news/a-minnesota-guide-to-garden-timing): temperatura do solo/ar e tipo de cultura são mais fiáveis que o calendário isolado, sobretudo em estações curtas.
- [FAO — Multiple cropping, Home Garden Technology Leaflet 12](https://www.fao.org/4/x3996e/x3996e36.htm): cultivo continuado depende de clima apropriado e água; início/fim das chuvas orientam a sequência e a rega suplementar pode permitir cultivo na estação seca.
- [FAO — Agro-ecological zoning](https://www.fao.org/4/W2962e/w2962e-03.htm): temperatura e disponibilidade hídrica limitam o período de crescimento; estações tropicais não são equivalentes aos quatro trimestres temperados.
- [RHS — Summer pruning trained stone fruit](https://www.rhs.org.uk/advice/grow-your-own/features/summer-pruning-trained-stone-fruit): fruteiras de caroço requerem poda na primavera/verão e tempo seco; o momento varia com condições e localidade.

## Verificação

Executar `node --test tests/regionalClimate.test.mjs`. Os testes cobrem Portugal/Sul, idempotência após JSON, cache original, configuração inicial, Brasil subtropical, trópicos e chuvas, frio/árido/estufa, fusos, ano bissexto, mudança da hora, tratamentos fora de Portugal e contexto dos dois clientes IA. As chamadas IA são simuladas; nenhum pedido real é necessário.
