//#region imports
import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TaonThemeMode, TaonThemeService } from './taon-theme.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  Translatable,
  TranslateDirective,
  TranslateService,
  Translation,
} from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

/**
 * @deprecated use TaonSettings
 */
@Component({
  selector: 'taon-theme',
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslateDirective,
  ],
  templateUrl: './taon-theme.component.html',
})
export class TaonThemeComponent implements Translatable {
  t = t.for(this);

  TaonThemeMode = TaonThemeMode;

  private readonly dialogRef = inject(MatDialogRef<TaonThemeComponent>);

  close(): void {
    this.dialogRef.close();
  }

  taonTheme = inject(TaonThemeService);
}
