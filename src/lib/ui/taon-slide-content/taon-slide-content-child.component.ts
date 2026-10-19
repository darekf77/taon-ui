import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  signal,
} from '@angular/core';

@Component({
  selector: 'taon-slide-content-child',
  standalone: true,
  templateUrl: './taon-slide-content-child.component.html',
  styleUrl: './taon-slide-content-child.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonSlideContentContentChildComponent {
  @Input({ required: true })
  assignToState!: unknown;

  readonly staticMode = signal(false);

  readonly staticVisible = signal(true);

  @HostBinding('style.display')
  get display(): string {
    if (this.staticMode()) {
      return this.staticVisible() ? 'block' : 'none';
    }

    return 'block';
  }
}
