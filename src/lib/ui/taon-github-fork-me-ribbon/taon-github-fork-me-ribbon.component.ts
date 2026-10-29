//#region imports
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Translatable, Translation } from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';
import { Subscription } from 'rxjs';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Component({
  selector: 'taon-github-fork-me-ribbon',
  templateUrl: './taon-github-fork-me-ribbon.component.html',
  styleUrls: ['./taon-github-fork-me-ribbon.component.scss'],
  standalone: false,
})
export class TaonGithubForkMeRibbonComponent implements Translatable {
  t = t.for(this);

  altText = this.t.signal.gettext('Fork me on GitHub');

  @Input() url: string = 'https://github.com';
}
