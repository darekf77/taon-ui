//#region imports
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Translatable,
  TranslateDirective,
  TranslateService,
  Translation,
} from '@taon-dev/i18n/src';
import { of, tap } from 'rxjs';
import { Taon } from 'taon/src';
import { UtilsI18n } from 'tnp-core/src';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Component({
  selector: 'taon-lang-selector',
  templateUrl: './taon-lang-selector.component.html',
  styleUrls: ['./taon-lang-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, TranslateDirective],
})
export class TaonLangSelectorComponent implements Translatable {
  t = t.for(this);

  private translateService = inject(TranslateService);

  readonly availableLangs$ = this.translateService.manager.availableLangs$.pipe(
    tap(availableLangs => {
      // console.log({ availableLangs });
    }),
  );

  readonly currentGlobalLanguage$ =
    this.translateService.currentGlobalLanguage$;

  readonly isLoading$ = of(false); // this.langSelectorService.isLoading$;

  constructor() {}

  async changeLanguage(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    await this.translateService.changeGlobalLang(
      select.value as UtilsI18n.CommonLocaleCode,
    );
  }
}
