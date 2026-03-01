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
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// declare global {
//   interface Window {
//     YT: any;
//     onYouTubeIframeAPIReady: () => void;
//   }
// }

function loadYoutubeApi(): Promise<void> {
  return new Promise(resolve => {
    // @ts-ignore
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

export type TaonYoutubeState =
  | 'preview-picture'
  | 'preview-picture-locked'
  | 'video-preview-open'
  | 'video-preview-private';

@Component({
  selector: 'taon-youtube-video',
  standalone: true,
  imports: [NgIf, NgStyle, MatIconModule, CommonModule],
  templateUrl: './taon-youtube-video.component.html',
  styleUrls: ['./taon-youtube-video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonYoutubeVideoComponent implements OnChanges, AfterViewInit {
  private readonly PS = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  currentVideoState: keyof typeof this.PS;

  @Input({ required: true }) videoId!: string;

  @Input() title?: string;

  @Input() height?: string;

  @Input() state: TaonYoutubeState = 'preview-picture';

  @Output() paddlockClicked = new EventEmitter<void>();

  @Output() previewClicked = new EventEmitter<void>();

  @ViewChild('ytFrame') iframeRef?: ElementRef<HTMLIFrameElement>;

  cdr = inject(ChangeDetectorRef);
  allowedToBeDisplayedVideoOveraly = signal(true);

  onRightClick(event) {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
  }

  clicked(event) {
    event.stopPropagation();
    this.allowedToBeDisplayedVideoOveraly.set(false);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.allowedToBeDisplayedVideoOveraly.set(true);
      this.cdr.detectChanges();
    }, 200);
  }

  restart() {
    this.postCommand('seekTo', [0, true]); // go to 0 seconds
    this.postCommand('playVideo');
  }

  // @ViewChild('playerContainer') playerContainer!: ElementRef;

  private player!: any;

  async ngAfterViewInit() {
    if (this.state !== 'video-preview-private') {
      return;
    }
    await loadYoutubeApi();

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

  private handleStateChange(state: number) {
    // @ts-ignore
    const YT = window.YT;

    // @ts-ignore
    console.log({ state, plauerstate: YT.PlayerState });

    this.currentVideoState = Object.keys(this.PS).find(
      c => this.PS[c] === state,
    ) as any;
    console.log('currentVideoState', this.currentVideoState);
  }

  private videoIdSignal = signal<string>('');

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {});
  }

  ngOnChanges() {
    this.videoIdSignal.set(this.videoId);
  }

  previewImage = computed(
    () => `https://img.youtube.com/vi/${this.videoIdSignal()}/0.jpg`,
  );

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
      `https://www.youtube.com/embed/${this.videoIdSignal()}?enablejsapi=1` +
        (this.state === 'video-preview-private' ? `&controls=0` : '') +
        (this.state === 'video-preview-private' ? `&modestbranding=1` : '') +
        (this.state === 'video-preview-private' ? `&rel=0` : '') +
        // (this.state === 'video-preview-private' ? `&fs=0` : '') +
        (this.state === 'video-preview-private' ? `&rel=0` : '') +
        `&disablekb=1` +
        `&playsinline=1` +
        `&origin=${window.location.origin}`,
    ),
  );

  get containerStyle() {
    return this.height ? { height: this.height } : null;
  }

  get displayTitle() {
    return this.title || 'YouTube video';
  }

  onLockClick(event: MouseEvent) {
    event.stopPropagation();
    this.paddlockClicked.emit();
  }

  onPreviewClick() {
    this.previewClicked.emit();
  }

  // private postCommand(command: string) {
  //   this.iframeRef?.nativeElement.contentWindow?.postMessage(
  //     JSON.stringify({
  //       event: 'command',
  //       func: command,
  //       args: [],
  //     }),
  //     '*',
  //   );
  // }

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

  play() {
    this.postCommand('playVideo');
  }

  pause() {
    this.postCommand('pauseVideo');
  }
}
