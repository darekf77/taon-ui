//#region imports
import { Routes } from '@angular/router';

import { TaonSimpleLayoutComponent } from './taon-simple-layout.component';
//#endregion

export const TaonSimpleLayoutRoutes: Routes = [
  {
    path: '',
    component: TaonSimpleLayoutComponent,
  },
  // {
  //   path: 'anothermodulepath',
  //   loadChildren: () => import('anothermodule')
  //     .then(m => m.AnotherLazyModule),
  // },
];