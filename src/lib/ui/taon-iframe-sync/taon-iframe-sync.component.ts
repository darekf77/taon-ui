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
import { Subject } from 'rxjs';
import { filter, takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'taon-iframe-sync',
  template: `
    <iframe
      #iframe
      [src]="safeUrlIframeSrc"
      frameborder="0"
      style="width:100%; height:100%; border:none; display:block;"
      (load)="onIframeLoad()"></iframe>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class TaonIframeSyncComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  domSanitizer = inject(DomSanitizer);

  public safeUrlIframeSrc: SafeResourceUrl;

  private iframeWindow!: Window | null;

  // ────── Inputs ──────
  /** Base URL of the iframe content (e.g. https://docs.taon.dev) */
  #iframeSrc!: string;

  @Input({ required: true }) set iframeSrc(iframeSrc) {
    this.safeUrlIframeSrc =
      this.domSanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
    this.#iframeSrc = iframeSrc;
  }

  get iframeSrc() {
    return this.#iframeSrc;
  }

  /** Query param name in parent URL (default: internalIframePath) */
  @Input() queryParamKey = 'internalIframePath';

  /** Optional initial path if you don't want to read from URL on first load */
  @Input() initialPath: string | null = null;

  initialPathIsSet = false;

  /** Target origin for postMessage – security! (defaults to iframeSrc origin) */
  @Input() targetOrigin?: string;

  // ────── ViewChild ──────
  @ViewChild('iframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  initialPathShouldBeSet = false;

  ngOnInit() {
    const initalPathForIframeFromQuery = this.route.snapshot.queryParamMap.get(
      this.queryParamKey,
    );

    console.log({ initalPathForIframeFromQuery });
    // Listen to Angular router changes (including query param updates)
    // this.router.events
    //   .pipe(
    //     filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe(() => this.syncParentToIframe());

    // // Listen to direct query param changes (e.g. back/forward)
    // this.route.queryParamMap
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     distinctUntilChanged(
    //       (a, b) => a.get(this.queryParamKey) === b.get(this.queryParamKey),
    //     ),
    //   )
    //   .subscribe(() => this.syncParentToIframe());

    // Listen to messages coming FROM the iframe
    window.addEventListener('message', this.handleMessageFromIframe);
  }

  ngAfterViewInit() {
    this.iframeWindow = this.iframeRef.nativeElement.contentWindow;
    // Initial sync after everything is ready
    setTimeout(() => this.syncParentToIframe(), 100);
  }

  onIframeLoad() {
    this.iframeWindow = this.iframeRef.nativeElement.contentWindow;
    this.syncParentToIframe();
  }

  syncParentToIframe = debounce(() => {
    if (!this.iframeWindow) return;

    if (!this.iframeSrc) {
      return;
    }

    if (!this.initialPathIsSet) {
      this.initialPathIsSet = true;
    }

    let path = this.route.snapshot.queryParamMap.get(this.queryParamKey);

    console.log('Syncing parent to iframe, path from URL:', { path });
    if (path === null || path === undefined) {
      path = this.initialPath ? this.initialPath : '/';
    }

    const origin = this.targetOrigin || new URL(this.iframeSrc).origin;

    console.log({
      action: 'Parent → Iframe NAVIGATE',
      path,
      iframeSrc: this.iframeSrc,
    });

    this.iframeWindow.postMessage({ type: 'NAVIGATE', path }, origin);
  }, 1000);

  // ────── Iframe → Parent ──────
  private handleMessageFromIframe = (event: MessageEvent) => {
    console.info('Received message from iframe:', event);
    const expectedOrigin = this.targetOrigin || new URL(this.iframeSrc).origin;
    if (event.origin !== expectedOrigin) return;

    if (event.data?.type === 'IFRAME_PATH_UPDATE') {
      if (!this.initialPathIsSet) {
        return;
      }
      const newPath = event.data.path || '/';
      console.log(`[parent] Updating new path:`, newPath);
      this.router.navigate([], {
        queryParams: { [this.queryParamKey]: newPath === '/' ? null : newPath },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('message', this.handleMessageFromIframe);
  }
}
