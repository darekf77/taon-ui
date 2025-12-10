// iframe-sync.component.ts
import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { debounce } from 'lodash';
import { Level, Log, Logger } from 'ng2-logger/src';
import { Subject } from 'rxjs';
import { filter, takeUntil, distinctUntilChanged } from 'rxjs/operators';

// taon-iframe-sync.component.ts
@Component({
  selector: 'taon-iframe-sync',
  template: `
    <!-- Hidden by default, shown only when ready -->
    <iframe
      #iframe
      [src]="safeSrc"
      [style.display]="isReady ? 'block' : 'none'"
      [style.visibility]="isReady ? 'visible' : 'hidden'"
      [style.opacity]="isReady ? '1' : '0'"
      frameborder="0"
      style="width:100%; height:100%; border:none; transition: opacity 0.2s ease;"
      (load)="onIframeLoad()"
      allow="clipboard-write"></iframe>

    <!-- Optional: nice loading placeholder -->
    <div
      *ngIf="!isReady"
      class="iframe-loading-placeholder"
      [style.background]="loaderBackgroundColor"
      >
      <div class="spinner"></div>
      <p>Loading documentation...</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
      }
      .iframe-loading-placeholder {
        position: absolute;
        inset: 0;
        background: var(--md-primary-fg-color--light);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        color: var(--text-color, #666);
        font-family: system-ui, sans-serif;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonIframeSyncComponent implements AfterViewInit, OnDestroy {
  @Input() loaderBackgroundColor = 'white';

  private destroy$ = new Subject<void>();

  private iframeWin: Window | null = null;

  // This is the key: iframe stays hidden until first correct page is confirmed loaded
  isReady = false;

  private hasInitialSync = false;

  @ViewChild('iframe') iframeRef!: ElementRef<HTMLIFrameElement>;

  // ... same inputs as before
  #src!: string;

  @Input({ required: true }) set iframeSrc(v: string) {
    this.#src = v.trim();
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.#src);
  }

  get iframeSrc() {
    return this.#src;
  }

  @Input() queryParamKey = 'internalIframePath';

  @Input() initialPath: string | null = null;

  @Input() targetOrigin?: string;

  safeSrc!: SafeResourceUrl;

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private sanitizer = inject(DomSanitizer);

  ngAfterViewInit() {
    this.setupSync();
    window.addEventListener('message', this.handleIframeMessage);
  }

  private setupSync() {
    this.route.queryParamMap
      .pipe(
        distinctUntilChanged(
          (a, b) => a.get(this.queryParamKey) === b.get(this.queryParamKey),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.sendNavigateIfReady());

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.sendNavigateIfReady());
  }

  onIframeLoad() {
    this.iframeWin = this.iframeRef?.nativeElement?.contentWindow;

    // Send the correct path — iframe will load it
    this.sendNavigateIfReady();

    // The real magic: wait for iframe to confirm it loaded the right page
    // (we'll enhance the iframe script to send a "READY" message)
  }

  private sendNavigateIfReady() {
    if (
      !this.iframeWin ||
      !this.isValidUrl(this.iframeSrc) ||
      this.hasInitialSync
    )
      return;

    const path =
      this.route.snapshot.queryParamMap.get(this.queryParamKey) ??
      this.initialPath ??
      '/';

    const origin = this.targetOrigin ?? this.getSafeOrigin(this.iframeSrc);

    this.iframeWin.postMessage({ type: 'NAVIGATE', path }, origin);
    this.hasInitialSync = true;
  }

  // ────── Safe URL helpers ──────
  private isValidUrl(string: string): boolean {
    if (!string) return false;
    try {
      new URL(string, window.location.origin);
      return true;
    } catch {
      return false;
    }
  }

  private getSafeOrigin(src: string): string {
    if (!src) return window.location.origin;

    try {
      // Full URL
      if (src.startsWith('http')) {
        return new URL(src).origin;
      }

      // Relative path
      if (src.startsWith('/')) {
        return window.location.origin;
      }

      // Protocol-relative
      if (src.startsWith('//')) {
        return new URL(src, window.location.origin).origin;
      }

      // Just return current origin for anything else
      return window.location.origin;
    } catch {
      return window.location.origin;
    }
  }

  // This is called when iframe confirms: "Yes, I loaded the correct page!"
  private handleIframeMessage = (event: MessageEvent) => {
    const expected = this.targetOrigin ?? this.getSafeOrigin(this.iframeSrc);
    if (event.origin !== expected) return;

    // NEW: iframe tells us when it's truly ready
    if (event.data?.type === 'IFRAME_READY') {
      this.isReady = true; // NOW show the iframe!
      return;
    }

    if (event.data?.type === 'IFRAME_PATH_UPDATE') {
      const path = event.data.path || '/';
      this.router.navigate([], {
        queryParams: { [this.queryParamKey]: path === '/' ? null : path },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  };

  // ... rest of helpers (isValidUrl, getSafeOrigin) same as before

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('message', this.handleIframeMessage);
  }
}
