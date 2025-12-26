//#region imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TaonGithubForkMeRibbonComponent } from './taon-github-fork-me-ribbon.component';
//#endregion

@NgModule({
  imports: [CommonModule],
  declarations: [TaonGithubForkMeRibbonComponent],
  exports: [TaonGithubForkMeRibbonComponent],
})
export class TaonGithubForkMeRibbonModule {}
