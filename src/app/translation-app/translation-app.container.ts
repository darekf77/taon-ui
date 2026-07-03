//#region imports
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Translation,
  Translatable,
  TranslateDirective,
  TranslatePipe,
} from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';
import { TaonLangSelectorComponent } from 'taon-ui/src';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Component({
  selector: 'app-translation-app',
  templateUrl: './translation-app.container.html',
  styleUrls: ['./translation-app.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterOutlet,
    TaonLangSelectorComponent,
    TranslateDirective,
    TranslatePipe,
  ],
})
export class TranslationAppContainer implements Translatable {
  t = t.for(this);

  test1 = t.signal.gettext('Amazing');

  test$ = t.$.gettext('Amazing');
}
