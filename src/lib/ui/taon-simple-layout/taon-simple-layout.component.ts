//#region imports
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { TaonThemeComponent } from '../taon-theme/taon-theme.component';
import { TaonThemeService } from '../taon-theme/taon-theme.service';

import { TaonSimpleLayoutNavItem } from './taon-simple-layout.model';
//#endregion

@Component({
  selector: 'taon-simple-layout',
  templateUrl: './taon-simple-layout.component.html',
  styleUrls: ['./taon-simple-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    RouterModule,
    MatDialogModule,
    JsonPipe,
    TaonThemeComponent,
  ],
})
export class TaonSimpleLayoutComponent {
  protected router = inject(Router);

  protected dialog = inject(MatDialog);

  protected theme = inject(TaonThemeService);

  @Input() hideThemeSettings: boolean;

  navItems = input<TaonSimpleLayoutNavItem[]>();

  navigateTo(item: { path: string; label: string }): void {
    this.router.navigateByUrl(item.path);
  }

  openDialog(
    enterAnimationDuration: string | number,
    exitAnimationDuration: string | number,
  ): void {
    this.dialog.open(TaonThemeComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
