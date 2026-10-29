import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, Translation } from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP, {
  // debug: true,
});

@Component({
  selector: 'taon-not-found',
  standalone: true,
  imports: [RouterLink, TranslateDirective],
  templateUrl: './taon-not-found.component.html',
  styleUrls: ['./taon-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonNotFoundComponent {
  t = t.for(this);
}
