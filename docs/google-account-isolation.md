# Isolamento local das contas Google

Antes de trocar de uma conta Google já conhecida para outra, a aplicação guarda uma cópia local por identidade Google (`hortaviva_account_backup_v1:`). Inclui perfil, plantações, animais, lembretes, subscrição local, preferências regionais, aparência, eliminações e contadores de utilização. Não inclui tokens OAuth, chaves de API nem catálogos partilhados.

A conta de destino recebe a sua cópia local anterior, se existir, ou um estado sem registos/definições da conta de origem. A primeira ligação Google adota deliberadamente os dados do convidado. O identificador do proprietário permanece após terminar sessão, evitando tratar os dados de uma conta anterior como uma nova quinta convidada. A cópia é guardada antes de limpar a vista ativa; falta de espaço aborta a troca. As cópias permanecem no armazenamento do navegador e não são uma segunda cópia na nuvem.

A ligação exige que o endpoint oficial de identidade devolva identidade e email; uma falha mantém as credenciais anteriores. Pedidos Drive verificam o token ativo antes de escrever IDs de ficheiros, importar respostas ou concluir a sincronização. Uma resposta iniciada na conta anterior é recusada depois da troca. Restaurar dados do Drive atualiza a interface sem disparar um novo ciclo de gravação da própria importação. Alterações pedidas enquanto uma sincronização está em curso originam uma passagem adicional.

As cópias dependem da conservação do armazenamento do navegador: limpar dados do site ou usar outro navegador elimina essa recuperação local. O Drive continua a exigir autorização válida, ligação de rede e o projeto OAuth configurado para a origem. Os testes simulam os endpoints; não comprovam a autorização de produção nem contactam uma conta real.

Verificação: `node --test tests/googleAccountIsolation.test.mjs`. Cobre A→B→A, recuperação após logout, migração do convidado, erro de quota, falha da identidade, resposta atrasada de outra conta, ausência de ciclos de sincronização e alterações durante uma gravação.
