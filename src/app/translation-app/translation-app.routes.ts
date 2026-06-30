//#region imports
import { Routes } from '@angular/router';

import { TranslationAppContainer } from './translation-app.container';
//#endregion

export const TranslationAppRoutes: Routes = [
  {
    path: '',
    component: TranslationAppContainer,
  },
  // {
  //   path: 'anothermodulepath',
  //   loadChildren: () => import('anothermodule')
  //     .then(m => m.AnotherLazyModule),
  // },
];

/**
 * By default exporting TranslationAppRoutes,
 * the command `taon generate:app:routes`
 * will automatically add them to the root routes in ./src/app.ts.
 */
export default TranslationAppRoutes;