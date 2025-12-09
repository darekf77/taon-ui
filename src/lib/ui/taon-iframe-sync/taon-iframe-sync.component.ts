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

const log = Log.create(
  'TaonIframeSyncComponent',
  Level.__NOTHING
);

@Component({
  selector: 'taon-iframe-sync',
  template: `
    <iframe
      #iframe
      [src]="safeSrc"
      frameborder="0"
      style="width:100%; height:100%; border:none; display:block;"
      (load)="onIframeLoad()"
      allow="clipboard-write"></iframe>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonIframeSyncComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private iframeWin: Window | null = null;

  private hasInitialSync = false;

  @ViewChild('iframe', { static: false })
  iframeRef!: ElementRef<HTMLIFrameElement>;

  // Inputs
  #src!: string;

  @Input({ required: true }) set iframeSrc(v: string) {
    this.#src = v.trim(); // ← Clean whitespace
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
    // Setup subscriptions (but don't sync yet — wait for iframe load)
    this.route.queryParamMap
      .pipe(
        distinctUntilChanged(
          (a, b) => a.get(this.queryParamKey) === b.get(this.queryParamKey),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.maybeSendNavigate());

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.maybeSendNavigate());

    window.addEventListener('message', this.handleIframeMessage);
  }

  onIframeLoad() {
    this.iframeWin = this.iframeRef?.nativeElement?.contentWindow || null;

    if (this.iframeWin && this.isValidUrl(this.iframeSrc)) {
      log.d('[sync] Iframe loaded, initial sync starting...');
      this.sendNavigate();
    } else {
      log.w('[sync] Iframe loaded but src invalid:', this.iframeSrc);
    }
  }

  private maybeSendNavigate() {
    // Only sync if iframe is ready AND path actually changed
    if (this.iframeWin && this.hasInitialSync) {
      this.sendNavigate();
    }
  }

  private sendNavigate() {
    // Guard: iframe not ready
    if (!this.iframeWin) {
      log.w('[sync] Cannot send: iframe not ready');
      return;
    }

    // Guard: src not set or invalid
    if (!this.iframeSrc || !this.isValidUrl(this.iframeSrc)) {
      log.w('[sync] Cannot send: invalid src', this.iframeSrc);
      return;
    }

    const path =
      this.route.snapshot.queryParamMap.get(this.queryParamKey) ??
      this.initialPath ??
      '/';

    const origin = this.targetOrigin ?? this.getSafeOrigin(this.iframeSrc);

    log.d('[sync] Parent → Iframe:', { path, origin });

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

  private handleIframeMessage = (event: MessageEvent) => {
    const expected = this.targetOrigin ?? this.getSafeOrigin(this.iframeSrc);
    if (event.origin !== expected) return;

    if (event.data?.type === 'IFRAME_PATH_UPDATE' && this.hasInitialSync) {
      const path = event.data.path || '/';
      this.router.navigate([], {
        queryParams: { [this.queryParamKey]: path === '/' ? null : path },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('message', this.handleIframeMessage);
  }
}
