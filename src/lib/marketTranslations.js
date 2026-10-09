const rows = `
market.navTitle|Mercado da Horta|Mercado da Horta|Garden Market|Mercado del huerto
market.navDesc|Loja diária e vendas com moedas virtuais|Loja diária e vendas com moedas virtuais|Daily shop and sales with virtual coins|Tienda diaria y ventas con monedas virtuales
market.goMarket|Visitar mercado|Visitar mercado|Visit market|Visitar mercado
market.back|Mascote & Armazém|Mascote e Armazém|Pet & Warehouse|Mascota y almacén
market.eyebrow|A banca da tua horta|A banca da sua horta|Your garden stall|El puesto de tu huerto
market.title|Colhe, troca e faz crescer a tua horta.|Colha, troque e faça sua horta crescer.|Harvest, trade and grow your garden.|Cosecha, intercambia y haz crecer tu huerto.
market.subtitle|Encontra alimentos na loja e dá um novo destino às tuas colheitas.|Encontre alimentos na loja e dê um novo destino às suas colheitas.|Find food in the shop and give your harvests a new purpose.|Encuentra alimentos en la tienda y da un nuevo destino a tus cosechas.
market.simulation|Mercado simulado|Mercado simulado|Simulated market|Mercado simulado
market.simulationHint|As moedas são virtuais. Os compradores são simulados: não há dinheiro real nem transações com outras pessoas.|As moedas são virtuais. Os compradores são simulados: não há dinheiro real nem transações com outras pessoas.|Coins are virtual. Buyers are simulated: no real money or transactions with other people are involved.|Las monedas son virtuales. Los compradores son simulados: no hay dinero real ni transacciones con otras personas.
market.balance|As tuas moedas|Suas moedas|Your coins|Tus monedas
market.coins|{amount} moedas|{amount} moedas|{amount} coins|{amount} monedas
market.currency|moedas|moedas|coins|monedas
market.startingBalance|Começas com 120 moedas virtuais.|Você começa com 120 moedas virtuais.|You start with 120 virtual coins.|Empiezas con 120 monedas virtuales.
market.shopTab|Loja de hoje|Loja de hoje|Today's shop|Tienda de hoy
market.stallTab|A minha banca|Minha banca|My stall|Mi puesto
market.historyTab|Histórico|Histórico|History|Historial
market.dailyShop|Fresquinhos na banca de hoje|Fresquinhos na banca de hoje|Fresh at today's stall|Recién llegados al puesto de hoy
market.dailyShopHint|Cada pacote pode ser comprado uma vez. Os alimentos vão diretamente para o armazém.|Cada pacote pode ser comprado uma vez. Os alimentos vão diretamente para o armazém.|Each pack can be bought once. Food goes straight to your warehouse.|Cada paquete se puede comprar una vez. Los alimentos van directamente a tu almacén.
market.offersCount|{count} pacotes diferentes|{count} pacotes diferentes|{count} different packs|{count} paquetes diferentes
market.refreshIn|Novos pacotes em {time}|Novos pacotes em {time}|New packs in {time}|Nuevos paquetes en {time}
market.refreshAt|Renovação às 00:00 · {zone}|Renovação à 00:00 · {zone}|Refreshes at 00:00 · {zone}|Se renueva a las 00:00 · {zone}
market.quantity|{quantity} unidades|{quantity} unidades|{quantity} units|{quantity} unidades
market.unitPrice|{price} moedas / unidade|{price} moedas / unidade|{price} coins / unit|{price} monedas / unidad
market.buy|Comprar pacote|Comprar pacote|Buy pack|Comprar paquete
market.bought|Comprado hoje|Comprado hoje|Bought today|Comprado hoy
market.rejectedPurchase|Compra não aplicada|Compra não aplicada|Purchase not applied|Compra no aplicada
market.retryPurchase|Voltar a tentar|Tentar novamente|Try again|Volver a intentar
market.previousRejectedPurchase|Uma tentativa anterior não foi aplicada.|Uma tentativa anterior não foi aplicada.|A previous attempt was not applied.|Un intento anterior no se aplicó.
market.syncNotice|O saldo e os alimentos foram atualizados após sincronizar. Algumas operações não puderam ser aplicadas.|O saldo e os alimentos foram atualizados após sincronizar. Algumas operações não puderam ser aplicadas.|Your balance and food were updated after syncing. Some operations could not be applied.|El saldo y los alimentos se actualizaron tras sincronizar. Algunas operaciones no se pudieron aplicar.
market.operationConflict|Esta operação não pôde ser aplicada após sincronizar. Confirma o saldo e os alimentos atuais.|Esta operação não pôde ser aplicada após sincronizar. Confira o saldo e os alimentos atuais.|This operation could not be applied after syncing. Check your current balance and food.|Esta operación no se pudo aplicar tras sincronizar. Comprueba tu saldo y tus alimentos actuales.
market.needCoins|Faltam {amount} moedas|Faltam {amount} moedas|You need {amount} more coins|Te faltan {amount} monedas
market.buySuccess|{quantity} unidades de {food} chegaram ao armazém.|{quantity} unidades de {food} chegaram ao armazém.|{quantity} units of {food} arrived in your warehouse.|Llegaron {quantity} unidades de {food} a tu almacén.
market.difficulty.easy|Cultivo fácil|Cultivo fácil|Easy to grow|Cultivo fácil
market.difficulty.medium|Cultivo intermédio|Cultivo intermediário|Moderate to grow|Cultivo intermedio
market.difficulty.hard|Cultivo exigente|Cultivo exigente|Demanding to grow|Cultivo exigente
market.listTitle|Monta a tua banca|Monte sua banca|Set up your stall|Monta tu puesto
market.listHint|Escolhe um produto do armazém, a quantidade e o preço por unidade.|Escolha um produto do armazém, a quantidade e o preço por unidade.|Choose a product from your warehouse, the quantity and the price per unit.|Elige un producto del almacén, la cantidad y el precio por unidad.
market.food|Produto|Produto|Product|Producto
market.availableOne|{quantity} disponível no armazém|{quantity} disponível no armazém|{quantity} available in the warehouse|{quantity} disponible en el almacén
market.available|{quantity} disponíveis no armazém|{quantity} disponíveis no armazém|{quantity} available in the warehouse|{quantity} disponibles en el almacén
market.quantityLabel|Quantidade a colocar à venda|Quantidade a colocar à venda|Quantity to list|Cantidad a poner en venta
market.priceLabel|Moedas por unidade|Moedas por unidade|Coins per unit|Monedas por unidad
market.priceRange|Preço permitido: {min}–{max} moedas / unidade|Preço permitido: {min}–{max} moedas / unidade|Allowed price: {min}–{max} coins / unit|Precio permitido: {min}–{max} monedas / unidad
market.speed.fast|Barato · maior interesse|Barato · maior interesse|Low price · more interest|Barato · mayor interés
market.speed.normal|Justo · interesse equilibrado|Justo · interesse equilibrado|Fair price · balanced interest|Justo · interés equilibrado
market.speed.slow|Caro · venda mais lenta|Caro · venda mais lenta|High price · slower sales|Caro · venta más lenta
market.speedHint|O preço e a dificuldade da cultura influenciam o ritmo dos compradores simulados. O tempo de venda varia.|O preço e a dificuldade da cultura influenciam o ritmo dos compradores simulados. O tempo de venda varia.|Price and growing difficulty influence simulated buyer activity. Sale timing varies.|El precio y la dificultad del cultivo influyen en el ritmo de los compradores simulados. El tiempo de venta varía.
market.reserveHint|Os alimentos colocados à venda ficam reservados. Cancela a oferta para devolver as unidades ainda não vendidas ao armazém.|Os alimentos colocados à venda ficam reservados. Cancele a oferta para devolver ao armazém as unidades ainda não vendidas.|Listed food is reserved. Cancel a listing to return unsold units to your warehouse.|Los alimentos en venta quedan reservados. Cancela la oferta para devolver al almacén las unidades sin vender.
market.listButton|Colocar à venda|Colocar à venda|List for sale|Poner en venta
market.listSuccess|A tua banca está pronta. Os compradores simulados já podem encontrar esta oferta.|Sua banca está pronta. Os compradores simulados já podem encontrar esta oferta.|Your stall is ready. Simulated buyers can now find this listing.|Tu puesto está listo. Los compradores simulados ya pueden encontrar esta oferta.
market.emptyInventory|Ainda não tens alimentos disponíveis para vender.|Você ainda não tem alimentos disponíveis para vender.|You have no food available to sell yet.|Aún no tienes alimentos disponibles para vender.
market.emptyInventoryHint|Compra um pacote na loja ou regista uma colheita na tua quinta.|Compre um pacote na loja ou registre uma colheita na sua fazenda.|Buy a shop pack or record a harvest on your farm.|Compra un paquete en la tienda o registra una cosecha en tu finca.
market.myListings|As tuas ofertas|Suas ofertas|Your listings|Tus ofertas
market.noListings|A tua banca ainda está vazia.|Sua banca ainda está vazia.|Your stall is still empty.|Tu puesto aún está vacío.
market.soldProgress|{sold} de {total} unidades vendidas|{sold} de {total} unidades vendidas|{sold} of {total} units sold|{sold} de {total} unidades vendidas
market.reservedOne|{quantity} unidade reservada|{quantity} unidade reservada|{quantity} unit reserved|{quantity} unidad reservada
market.reserved|{quantity} unidades reservadas|{quantity} unidades reservadas|{quantity} units reserved|{quantity} unidades reservadas
market.listing.active|À venda|À venda|For sale|En venta
market.listing.sold|Vendido|Vendido|Sold|Vendido
market.listing.cancelled|Cancelado|Cancelado|Cancelled|Cancelado
market.cancel|Retirar da banca|Retirar da banca|Remove from stall|Retirar del puesto
market.cancelSuccess|As unidades ainda não vendidas regressaram ao armazém.|As unidades ainda não vendidas voltaram ao armazém.|Unsold units returned to your warehouse.|Las unidades sin vender volvieron al almacén.
market.historyTitle|Pequenas trocas, novas possibilidades|Pequenas trocas, novas possibilidades|Little trades, new possibilities|Pequeños intercambios, nuevas posibilidades
market.historyHint|Vendas a compradores simulados, com as moedas recebidas e a hora da operação.|Vendas a compradores simulados, com as moedas recebidas e a hora da operação.|Sales to simulated buyers, showing coins received and transaction time.|Ventas a compradores simulados, con las monedas recibidas y la hora de la operación.
market.simulatedBuyer|Comprador simulado|Comprador simulado|Simulated buyer|Comprador simulado
market.noSales|As primeiras vendas vão aparecer aqui.|As primeiras vendas vão aparecer aqui.|Your first sales will appear here.|Tus primeras ventas aparecerán aquí.
market.historyCount|A mostrar {shown} de {total} vendas|Mostrando {shown} de {total} vendas|Showing {shown} of {total} sales|Mostrando {shown} de {total} ventas
market.showMore|Ver mais vendas|Ver mais vendas|Show more sales|Ver más ventas
market.loading|A abrir a banca…|Abrindo a banca…|Opening the stall…|Abriendo el puesto…
market.retry|Tentar novamente|Tentar novamente|Try again|Intentar de nuevo
market.error|Não foi possível concluir a operação. Os dados guardados foram mantidos. Tenta novamente.|Não foi possível concluir a operação. Os dados salvos foram mantidos. Tente novamente.|Could not complete the operation. Saved data was kept. Try again.|No se pudo completar la operación. Se conservaron los datos guardados. Inténtalo de nuevo.
market.storageError|Não foi possível ler ou guardar o mercado neste dispositivo. Verifica o armazenamento do navegador.|Não foi possível ler ou salvar o mercado neste dispositivo. Confira o armazenamento do navegador.|Could not read or save the market on this device. Check your browser storage.|No se pudo leer o guardar el mercado en este dispositivo. Comprueba el almacenamiento del navegador.
market.accountChanged|A conta mudou. Atualizámos o mercado antes de continuar; volta a escolher a operação.|A conta mudou. Atualizamos o mercado antes de continuar; escolha a operação novamente.|The account changed. We refreshed the market before continuing; choose the operation again.|La cuenta ha cambiado. Actualizamos el mercado antes de continuar; vuelve a elegir la operación.
market.error.insufficient_funds|Não tens moedas suficientes para este pacote.|Você não tem moedas suficientes para este pacote.|You do not have enough coins for this pack.|No tienes monedas suficientes para este paquete.
market.error.already_purchased|Este pacote já foi comprado hoje.|Este pacote já foi comprado hoje.|This pack has already been bought today.|Este paquete ya se compró hoy.
market.error.empty|Já não há unidades suficientes deste produto no armazém.|Não há mais unidades suficientes deste produto no armazém.|There are no longer enough units of this product in the warehouse.|Ya no hay suficientes unidades de este producto en el almacén.
market.error.invalid_quantity|Indica uma quantidade inteira válida, dentro do stock disponível.|Informe uma quantidade inteira válida, dentro do estoque disponível.|Enter a valid whole quantity within the available stock.|Indica una cantidad entera válida dentro de las existencias disponibles.
market.error.invalid_price|Escolhe um preço inteiro dentro do intervalo permitido.|Escolha um preço inteiro dentro do intervalo permitido.|Choose a whole price within the allowed range.|Elige un precio entero dentro del intervalo permitido.
market.error.listing_not_found|Esta oferta já não está disponível. Atualizámos a banca.|Esta oferta não está mais disponível. Atualizamos a banca.|This listing is no longer available. We refreshed the stall.|Esta oferta ya no está disponible. Actualizamos el puesto.
market.error.offer_expired|A loja já renovou os seus pacotes. Escolhe uma oferta de hoje.|A loja já renovou seus pacotes. Escolha uma oferta de hoje.|The shop has refreshed its packs. Choose an offer from today.|La tienda ya renovó sus paquetes. Elige una oferta de hoy.
`;

export const MARKET_TRANSLATIONS = { 'pt-PT': {}, 'pt-BR': {}, en: {}, es: {} };
for (const row of rows.trim().split('\n')) {
  const [key, pt, br, en, es] = row.split('|');
  MARKET_TRANSLATIONS['pt-PT'][key] = pt;
  MARKET_TRANSLATIONS['pt-BR'][key] = br;
  MARKET_TRANSLATIONS.en[key] = en;
  MARKET_TRANSLATIONS.es[key] = es;
}
