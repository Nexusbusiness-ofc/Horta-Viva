# Loja diária e mercado simulado

O mercado usa apenas moedas e compradores fictícios. Não envolve pagamentos, outras pessoas ou valores monetários reais.

## Stock e saldo

Uma conta começa com o armazém vazio e 120 moedas, atribuídas como saldo inicial do histórico, sem um prémio repetido a cada sessão. As plantações só criam produtos após a confirmação explícita da colheita. Comprar um pacote na loja também cria stock utilizável para alimentar a mascote ou revender.

Os eventos de compra, alimentação, reserva, cancelamento e venda pertencem ao mesmo histórico da mascote. A repetição de ações, a restauração de uma cópia antiga e a fusão entre dispositivos não devem recriar uma unidade já consumida ou vendida. Uma compra só é aceite quando há saldo disponível na sua posição no histórico; conflitos entre dispositivos são apresentados na interface.

## Loja diária

Há dez culturas diferentes por dia civil no fuso guardado. As quantidades são uma permutação de 2 a 11 unidades: cada pacote tem uma quantidade diferente. As ofertas são determinísticas e ficam guardadas para esse dia. Cada pacote pode ser comprado uma vez; a compra debita o total e fica marcada até à renovação à meia-noite local. Reabrir a app não renova os pacotes.

Os preços por unidade dependem da dificuldade do catálogo:

| Dificuldade | Loja / referência | Mínimo na banca | Máximo na banca |
| --- | ---: | ---: | ---: |
| Fácil | 3 | 2 | 6 |
| Intermédia | 5 | 3 | 10 |
| Difícil | 8 | 5 | 16 |

São valores de jogo, sem relação com preços agrícolas reais.

## A banca do utilizador

O utilizador escolhe um produto disponível, uma quantidade inteira e o preço por unidade dentro do intervalo permitido. As unidades ficam imediatamente reservadas e deixam de estar disponíveis para alimentação ou outra listagem. Retirar uma listagem devolve apenas as unidades ainda não vendidas.

Compradores simulados compram unidades em momentos diferentes. Os tempos de espera variam de forma determinística a partir da listagem; preços mais altos aumentam a espera. A primeira venda nunca é imediata e as unidades de uma listagem têm pelo menos 60 segundos de intervalo entre si. Cada venda credita o preço da respetiva unidade.

A app processa as vendas ao consultar o mercado, periodicamente enquanto está aberta e ao recuperar o foco. Depois de uma ausência, pode liquidar várias vendas vencidas; cada uma mantém o seu horário histórico individual. Não depende de um serviço a executar no telemóvel com a app fechada.

## Persistência

O mercado fica em `mascot.market`, dentro dos dados já incluídos na sincronização Google e nas cópias da Horta Viva. O saldo é calculado a partir dos eventos, em vez de ser atualizado num contador separado. Sem ligação ou sessão Google ativa, o dispositivo mantém as alterações locais até à sincronização.

## Verificação

`node --test scripts/mascot.test.js scripts/mascotMarket.test.js` cobre o jogo e a economia, incluindo compras repetidas, saldo insuficiente, preços e quantidades inválidas, reservas, alimentação de produtos comprados, cancelamento parcial, vendas graduais, diferenças de preço, renovação diária, fusão e isolamento de contas.
