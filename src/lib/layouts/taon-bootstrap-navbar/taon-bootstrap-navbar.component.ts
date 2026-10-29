//#region imports
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { TranslateDirective, Translation } from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP, {
  // debug: true,
});

@Component({
  selector: 'taon-bootstrap-navbar',
  templateUrl: './taon-bootstrap-navbar.component.html',
  styleUrls: ['./taon-bootstrap-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgbCollapseModule, ModalModule, TranslateDirective],
  standalone: true,
})
export class TaonBootstrapNavbarComponent implements OnInit {
  t = t.for(this);
  // @HostBinding('style.minHeight.px') @Input() height: number = 100;
  // @Output() taonBootstrapNavbarDataChanged = new EventEmitter();
  @Input() isLoggedIn: boolean = false;

  @Input() isCollapsed: boolean = false;

  ngOnInit(): void {}
}
