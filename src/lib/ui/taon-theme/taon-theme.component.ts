import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TaonThemeMode, TaonThemeService } from './taon-theme.service';

@Component({
  selector: 'taon-theme',
  imports: [MatSlideToggleModule],
  templateUrl: './taon-theme.component.html',
})
export class TaonThemeComponent {
  TaonThemeMode = TaonThemeMode;

  taonTheme = inject(TaonThemeService);
}
