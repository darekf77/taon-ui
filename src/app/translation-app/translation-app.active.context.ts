//#region imports
//
import { HOST_CONFIG } from '../../app.hosts';
// import { MIGRATIONS_CLASSES_FOR_TranslationAppActiveContext } from 'taon-ui/src';
import { TaonBaseContext, createContext } from 'taon/src';
//#endregion

export const TranslationAppActiveContext = createContext(() => ({
  ...HOST_CONFIG['TranslationAppActiveContext'],
  contextName: 'TranslationAppActiveContext',
  database: true,
  // migrations: { ...MIGRATIONS_CLASSES_FOR_TranslationAppActiveContext },
  contexts: { TaonBaseContext },
  entities: {},
  controllers: {},
  repositories: {},
  middlewares: {},
  providers: {},
}));
