//#region imports
import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TaonThemeMode, TaonThemeService } from './taon-theme.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
//#endregion

@Component({
  selector: 'taon-theme',
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './taon-theme.component.html',
})
export class TaonThemeComponent {
  TaonThemeMode = TaonThemeMode;

  private readonly dialogRef = inject(MatDialogRef<TaonThemeComponent>);

  close(): void {
    this.dialogRef.close();
  }

  taonTheme = inject(TaonThemeService);
}
