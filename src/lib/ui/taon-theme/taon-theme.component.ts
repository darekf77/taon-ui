import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TaonThemeMode, TaonThemeService } from './taon-theme.service';

@Component({
  selector: 'taon-theme',
  standalone: true,
  imports: [MatSlideToggleModule],
  template: `
   <mat-slide-toggle
      class="p-2"
      [checked]="taonTheme.isAuto()"
      (change)="taonTheme.toogleAuto($event.checked)">
      Sync colors with system
    </mat-slide-toggle>

    <mat-slide-toggle
      class="p-2"
      [checked]="taonTheme.isDark()"
      [disabled]="taonTheme.isAuto()"
      (change)="taonTheme.setDark($event.checked)">
      Dark mode
    </mat-slide-toggle>
  `,
})
export class TaonThemeComponent {
  TaonThemeMode = TaonThemeMode;
  taonTheme = inject(TaonThemeService);
}