//#region imports
import {
  CdkDrag,
  CdkDragEnd,
  CdkDragMove,
  CdkDragRelease,
  DragDropModule,
  Point,
} from '@angular/cdk/drag-drop';
import {} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
  AfterViewInit,
  OnDestroy,
  effect,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Subject, takeUntil, tap } from 'rxjs';
import { StaticColumnsModule } from 'static-columns/src';
import { TaonAdminPanelMode, TaonAdminService } from 'taon/src';
import { TaonStor } from 'taon-storage/src';
import { Helpers, _ } from 'tnp-core/src';

import { TaonNotificationsModule } from '../taon-notifications';
import { TaonProgressBarModule } from '../taon-progress-bar';
import { TaonSessionPasscodeComponent } from '../taon-session-passcode';

//#endregion

@Component({
  //#region component options
  selector: 'taon-admin-mode-configuration',
  templateUrl: './taon-admin-mode-configuration.component.html',
  styleUrls: ['./taon-admin-mode-configuration.component.scss'],
  imports: [
    CommonModule,
    StaticColumnsModule,
    FormsModule,
    NgScrollbarModule,
    TaonProgressBarModule,
    TaonNotificationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    ReactiveFormsModule,
    DragDropModule,
    // TaonDbAdminComponent,
    TaonSessionPasscodeComponent,
  ],
  //#endregion
})
export class TaonAdminModeConfigurationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  //#region fields & getters
  TaonAdminPanelMode = TaonAdminPanelMode;

  $destroy = new Subject();

  public readonly cdr = inject(ChangeDetectorRef);

  public readonly taonAdminService: TaonAdminService = inject(TaonAdminService);

  public isWebSQLMode: boolean = Helpers.getIsWebSQL();

  public height: number = 100;

  // TODO
  public scrollableEnabled = false;

  public reloading = signal(false);

  @Input() showPasscode: boolean;

  @Input() passcode: string;

  @Input() message: string;

  public dragPositionX = TaonStor.inLocalstorage(
    {
      defaultValue: 0,
      keyOrPath: 'dragPositionX',
    },
    TaonAdminModeConfigurationComponent,
  );

  public dragPositionY = TaonStor.inLocalstorage(
    {
      defaultValue: 0,
      keyOrPath: 'dragPositionY',
    },
    TaonAdminModeConfigurationComponent,
  );

  dragPositionZero = { x: 0, y: 0 } as Point;

  dragPosition: Point;

  public selectedIndex = TaonStor.inLocalstorage(
    {
      defaultValue: 0,
      keyOrPath: 'selectedIndex',
    },
    TaonAdminModeConfigurationComponent,
  );

  //#endregion

  //#region on init
  async ngOnInit() {
    await TaonStor.awaitAll();
    this.dragPosition = { x: this.dragPositionX(), y: this.dragPositionY() };
  }
  //#endregion

  //#region after view init
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.onResize();

      // TODO QUICK_FIX for draggble popup proper first index load on tabs
      if (this.taonAdminService.adminPanelMode() !== TaonAdminPanelMode.ICON) {
        this.reloadTabs();
      }
    });
  }
  //#endregion

  //#region on destroy
  ngOnDestroy(): void {
    this.$destroy.next(void 0);
    this.$destroy.complete();
  }
  //#endregion

  //#region on resize
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.height = window.innerHeight;
  }
  //#endregion

  //#region methods
  reloadTabs(): void {
    this.reloading.set(true);
    setTimeout(() => {
      this.reloading.set(false);
      console.log('reloading done');
    });
  }

  resetDrag() {
    this.dragPositionX.set(0);
    this.dragPositionY.set(0);
    this.dragPosition = { x: this.dragPositionX(), y: this.dragPositionY() };
  }

  moved(c: CdkDragEnd) {
    this.dragPositionX.set(this.dragPositionX() + c.distance.x);
    this.dragPositionY.set(this.dragPositionY() + c.distance.y);
  }

  //#endregion
}
