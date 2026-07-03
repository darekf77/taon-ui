//#region imports
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import {
  Translatable,
  TranslateDirective,
  TranslateService,
  Translation,
} from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';

import { TaonLangSelectorComponent } from '../taon-lang-selector/taon-lang-selector.component';
import {
  TaonThemeMode,
  TaonThemeService,
} from '../taon-theme/taon-theme.service';

//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Component({
  selector: 'taon-settings',
  templateUrl: './taon-settings.component.html',
  styleUrls: ['./taon-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterOutlet,
    TaonLangSelectorComponent,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslateDirective,
  ],
})
export class TaonSettingsComponent implements Translatable {
  t = t.for(this);

  TaonThemeMode = TaonThemeMode;

  private readonly dialogRef = inject(MatDialogRef<TaonSettingsComponent>);

  close(): void {
    this.dialogRef.close();
  }

  taonTheme = inject(TaonThemeService);
}
