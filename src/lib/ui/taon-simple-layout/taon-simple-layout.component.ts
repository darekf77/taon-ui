//#region imports
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { TaonSettingsComponent } from '../taon-settings/taon-settings.component';
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
    TaonSettingsComponent,
  ],
})
export class TaonSimpleLayoutComponent {
  protected router = inject(Router);

  protected dialog = inject(MatDialog);

  protected theme = inject(TaonThemeService);

  @Input() hideThemeSettings: boolean;

  @Input() hideHeader: boolean;

  navItems = input<TaonSimpleLayoutNavItem[]>();

  protected readonly mobileMenuOpen = signal(false);

  navigateToMobile(item: TaonSimpleLayoutNavItem): void {
    this.mobileMenuOpen.set(false);
    this.navigateTo(item);
  }

  protected openSettingsFromMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.openDialog(200, 200);
  }

  navigateTo(item: TaonSimpleLayoutNavItem): void {
    const primarySegments = item.path.split('/').filter(Boolean);

    this.router.navigate([
      {
        outlets: {
          primary: primarySegments,
        },
      },
    ]);
  }

  openDialog(
    enterAnimationDuration: string | number,
    exitAnimationDuration: string | number,
  ): void {
    this.dialog.open(TaonSettingsComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
