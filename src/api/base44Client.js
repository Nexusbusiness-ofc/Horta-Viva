import { localEntities, localAuth, localIntegrations } from '@/lib/localStorageStore';

// Cliente local 100% offline com persistência em localStorage para Minha Quinta,
// plantações, animais, tratamentos/lembretes, perfil e autenticação sem erros 404.
export const base44 = {
  entities: localEntities,
  auth: localAuth,
  integrations: localIntegrations,
};

export default base44;
