import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';

export enum TaonThemeMode {
  AUTO = 'auto',
  LIGHT = 'light',
  DARK = 'dark',
}

@Injectable({ providedIn: 'root' })
export class TaonThemeService {
  private readonly TAON_THEME_KEY = 'taon-theme-mode';

  private platformId = inject(PLATFORM_ID);

  private isBrowser = isPlatformBrowser(this.platformId);

  private mediaQuery: MediaQueryList | null = null;

  mode = signal<TaonThemeMode>(TaonThemeMode.AUTO);

  isDark = signal<boolean>(false);

  constructor() {
    if (!this.isBrowser) return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Load saved mode
    const saved = localStorage.getItem(this.TAON_THEME_KEY) as TaonThemeMode | null;
    if (saved) {
      this.mode.set(saved);
    }

    // React to system changes
    this.mediaQuery.addEventListener('change', e => {
      if (this.mode() === TaonThemeMode.AUTO) {
        this.apply(e.matches);
      }
    });

    // React to mode changes
    effect(() => {
      const currentMode = this.mode();
      localStorage.setItem(this.TAON_THEME_KEY, currentMode);

      const dark =
        currentMode === TaonThemeMode.AUTO
          ? (this.mediaQuery?.matches ?? false)
          : currentMode === TaonThemeMode.DARK;

      this.apply(dark);
    });
  }

  private apply(dark: boolean): void {
    this.isDark.set(dark);

    const root = document.documentElement;
    root.classList.toggle('dark-taon-theme', dark);
    root.classList.toggle('light-taon-theme', !dark);
  }

  setMode(mode: TaonThemeMode): void {
    this.mode.set(mode);
  }

  toogleAuto(auto: boolean): void {
    if (auto) {
      this.mode.set(TaonThemeMode.AUTO);
    } else {
      this.mode.set(TaonThemeMode.LIGHT);
    }
  }

  setDark(yes: boolean): void {
    if (yes) {
      this.mode.set(TaonThemeMode.DARK);
    } else {
      this.mode.set(TaonThemeMode.LIGHT);
    }
  }

  toggle(): void {
    this.setMode(this.isDark() ? TaonThemeMode.LIGHT : TaonThemeMode.DARK);
  }

  isAuto(): boolean {
    return this.mode() === TaonThemeMode.AUTO;
  }
}