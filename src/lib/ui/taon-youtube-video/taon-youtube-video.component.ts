//#region imports

import { NgIf, NgStyle, CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  computed,
  signal,
  OnChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
  effect,
  ChangeDetectorRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { TaonYoutubeState } from './taon-youtube.models';
import { TaonYouTubeUtils } from './taon-youtube.utils';
//#endregion

@Component({
  selector: 'taon-youtube-video',
  standalone: true,
  imports: [NgIf, NgStyle, MatIconModule, CommonModule],
  templateUrl: './taon-youtube-video.component.html',
  styleUrls: ['./taon-youtube-video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonYoutubeVideoComponent
  implements OnChanges, AfterViewInit, OnInit, OnDestroy
{
  //#region fields & getters
  @Input({ required: true }) videoId!: string;

  @Input() title?: string;

  @Input() height?: string;

  @Input() state: TaonYoutubeState = 'preview-picture';

  @Output() paddlockClicked = new EventEmitter<void>();

  @Output() previewClicked = new EventEmitter<void>();

  @ViewChild('ytFrame') iframeRef?: ElementRef<HTMLIFrameElement>;

  /**
   * > controls=0	Hides bottom control bar
   * > modestbranding=1	Reduces YouTube logo
   * > rel=0	Disables related videos from other channels
   * > disablekb=1	Disables keyboard controls
   * > fs=0	Disables fullscreen button
   * > playsinline=1	Prevents fullscreen auto behavior on iOS
   */
  embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.videoIdSignal()}` +
        `?enablejsapi=1` +
        `&autoplay=1` +
        `&playsinline=1` +
        `&rel=0` +
        `&origin=${encodeURIComponent(window.location.origin)}`,
    ),
  );

  private readonly PS = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  currentVideoState: keyof typeof this.PS;

  videoActivated = signal(false);

  isInViewport = signal(false);

  // previewImage = computed(
  //   () =>
  //     `https://img.youtube.com/vi/${this.videoIdSignal()}/maxresdefault.jpg`,
  // );

  previewImage = computed(
    () => `https://img.youtube.com/vi/${this.videoIdSignal()}/0.jpg`,
  );

  cdr = inject(ChangeDetectorRef);

  allowedToBeDisplayedVideoOveraly = signal(true);

  // @ViewChild('playerContainer') playerContainer!: ElementRef;

  private player!: any;

  private readonly el = inject(ElementRef<HTMLElement>);

  private observer?: IntersectionObserver;

  private videoIdSignal = signal<string>('');

  get containerStyle() {
    return this.height ? { height: this.height } : null;
  }

  get displayTitle() {
    return this.title;
  }
  //#endregion

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {});
  }

  //#region methods / right click
  onRightClick(event) {
    // console.log(event);
    event.preventDefault();
    event.stopPropagation();
  }
  //#endregion

  //#region  methods /  on thumbnail error
  onThumbnailError(event: Event): void {
    const img = event.target as HTMLImageElement;

    const fallback = `https://img.youtube.com/vi/${this.videoIdSignal()}/hqdefault.jpg`;

    if (img.src !== fallback) {
      img.src = fallback;
    }
  }
  //#endregion

  //#region methods / clicked
  clicked(event) {
    event.stopPropagation();
    this.allowedToBeDisplayedVideoOveraly.set(false);
    this.cdr.detectChanges();
    // setTimeout(() => {
    //   this.allowedToBeDisplayedVideoOveraly.set(true);
    //   this.cdr.detectChanges();
    // }, 200);
  }
  //#endregion

  //#region methods / restart
  restart() {
    this.postCommand('seekTo', [0, true]); // go to 0 seconds
    this.postCommand('playVideo');
  }
  //#endregion

  //#region on init
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  //#endregion

  //#region on destroy
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  //#endregion

  //#region after view init
  async ngAfterViewInit() {
    // this.observer = new IntersectionObserver(
    //   entries => {
    //     // console.log({ entries });
    //     const entry = entries[0];

    //     if (entry.isIntersecting) {
    //       this.isInViewport.set(true);

    //       // We don't need to watch this component anymore.
    //       this.observer?.disconnect();
    //     }
    //   },
    //   {
    //     root: null,
    //     rootMargin: '150px',
    //     threshold: 0.01,
    //   },
    // );
    // this.observer.observe(this.el.nativeElement);

    if (this.state !== 'video-preview-private') {
      return;
    }
    await TaonYouTubeUtils.loadYoutubeApi();

    // @ts-ignore
    this.player = new window.YT.Player(this.iframeRef.nativeElement, {
      videoId: this.videoId,
      playerVars: {
        origin: window.location.origin,
      },
      events: {
        onStateChange: (event: any) => {
          this.handleStateChange(event.data);
        },
      },
    });
  }
  //#endregion

  //#region handle state change
  private handleStateChange(state: number) {
    // @ts-ignore
    // const YT = window.YT;
    // // @ts-ignore
    // console.log({ state, plauerstate: YT.PlayerState });
    // this.currentVideoState = Object.keys(this.PS).find(
    //   c => this.PS[c] === state,
    // ) as any;
    // console.log('currentVideoState', this.currentVideoState);
  }
  //#endregion

  //#region on ng changes
  ngOnChanges() {
    this.videoIdSignal.set(this.videoId);
  }
  //#endregion

  //#region on lock click
  onLockClick(event: MouseEvent) {
    event.stopPropagation();
    this.paddlockClicked.emit();
  }
  //#endregion

  //#region on preview click
  onPreviewClick(): void {
    if (this.state === 'preview-picture-locked') {
      return;
    }

    this.videoActivated.set(true);
    this.previewClicked.emit();
  }
  //#endregion

  //#region play
  play() {
    this.postCommand('playVideo');
  }
  //#endregion

  //#region pause
  pause() {
    this.postCommand('pauseVideo');
  }
  //#endregion

  //#region private methods
  private postCommand(command: string, args: any[] = []) {
    const iframe = this.iframeRef?.nativeElement;
    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: args,
      }),
      'https://www.youtube.com',
    );
  }
  //#endregion
}
