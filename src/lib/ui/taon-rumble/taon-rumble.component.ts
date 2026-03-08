import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export type TaonRumbleState =
  | 'preview-picture'
  | 'preview-picture-locked'
  | 'video-preview-open'
  | 'video-preview-private';

@Component({
  selector: 'taon-rumble',
  standalone: true,
  imports: [NgIf],
  templateUrl: './taon-rumble.component.html',
  styleUrls: ['./taon-rumble.component.scss'],
})
export class TaonRumbleComponent {
  sanitizer = inject(DomSanitizer);

  @Input({
    required: true,
  })
  title!: string;

  @Input({
    required: true,
  })
  clipId!: string;

  @Input({
    required: true,
  })
  picturePreviewUrl!: string;

  @Input() state: TaonRumbleState = 'video-preview-open';

  @Output() paddlockClicked = new EventEmitter<void>();

  @Output() previewClicked = new EventEmitter<void>();

  // get embedUrl(): string {
  //   return `https://rumble.com/embed/${this.clipId}`;
  // }

  embedUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://rumble.com/embed/${this.clipId}`,
    ),
  );

  onPreviewClick() {
    this.previewClicked.emit();
  }

  onPadlockClick(event: MouseEvent) {
    event.stopPropagation();
    this.paddlockClicked.emit();
  }

  isPreview() {
    return (
      this.state === 'preview-picture' ||
      this.state === 'preview-picture-locked'
    );
  }

  isLocked() {
    return this.state === 'preview-picture-locked';
  }

  isVideoOpen() {
    return this.state === 'video-preview-open';
  }

  isPrivate() {
    return this.state === 'video-preview-private';
  }
}
