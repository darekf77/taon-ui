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

@Component({
  selector: 'taon-bootstrap-navbar',
  templateUrl: './taon-bootstrap-navbar.component.html',
  styleUrls: ['./taon-bootstrap-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgbCollapseModule,
    ModalModule,
  ],
  standalone: true,
})
export class TaonBootstrapNavbarComponent implements OnInit {
  // @HostBinding('style.minHeight.px') @Input() height: number = 100;
  // @Output() taonBootstrapNavbarDataChanged = new EventEmitter();
  @Input() isLoggedIn: boolean = false;
  @Input() isCollapsed: boolean = false;

  ngOnInit(): void {}
}