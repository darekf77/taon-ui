//#region imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TaonProgressBarComponent } from './taon-progress-bar.component';
//#endregion

// import { NgProgressConfig, NgProgressModule } from 'ngx-progressbar';

@NgModule({
  imports: [
    CommonModule,
    // NgProgressModule.withConfig({})
  ],
  declarations: [TaonProgressBarComponent],
  exports: [TaonProgressBarComponent],
})
export class TaonProgressBarModule {}
