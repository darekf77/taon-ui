//#region imports
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { TaonThemeComponent } from '../taon-theme/taon-theme.component';

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
    JsonPipe,
    TaonThemeComponent,
  ],
})
export class TaonSimpleLayoutComponent {
  protected router = inject(Router);

  navItems = input<TaonSimpleLayoutNavItem[]>();

  navigateTo(item: { path: string; label: string }): void {
    this.router.navigateByUrl(item.path);
  }
}
