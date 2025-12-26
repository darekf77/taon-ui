//#region imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TaonNotificationsComponent } from './taon-notifications.component';

// import { HotToastModule } from '@ngneat/hot-toast';

import { TaonNotificationsService } from './taon-notifications.service';
//#endregion

@NgModule({
  imports: [
    // CommonModule,
    // BrowserAnimationsModule, // required animations module
    // HotToastModule.forRoot({
    //   position: 'top-right',
    // }),
  ],
  exports: [TaonNotificationsComponent],
  declarations: [TaonNotificationsComponent],
  providers: [TaonNotificationsService],
})
export class TaonNotificationsModule {}
