import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  signal,
} from '@angular/core';

import { TaonSlideContentContentChildComponent } from './taon-slide-content-child.component';

@Component({
  selector: 'taon-slide-content',
  standalone: true,
  imports: [],
  templateUrl: './taon-slide-content.component.html',
  styleUrl: './taon-slide-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonSlideContentComponent implements AfterContentInit {
  @ContentChildren(TaonSlideContentContentChildComponent)
  private slides!: QueryList<TaonSlideContentContentChildComponent>;

  private readonly activeIndex = signal(0);

  readonly transform = () => `translateX(-${this.activeIndex() * 100}%)`;

  ngAfterContentInit(): void {
    this.activeIndex.set(0);
  }

  public goTo(state: unknown): void {
    const index = this.slides
      .toArray()
      .findIndex(slide => slide.assignToState === state);

    if (index === -1) {
      console.warn(
        '[TaonSlideContentSlideComponent] Unknown slide state:',
        state,
      );
      return;
    }

    this.activeIndex.set(index);
  }
}
