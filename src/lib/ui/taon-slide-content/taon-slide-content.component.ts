import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
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

  /**
   * Defines which state transitions should be animated.
   *
   * Example:
   * LOGIN -> ENTER_PASSWORD = animated
   * ENTER_PASSWORD -> LOGIN = instant
   */
  @Input()
  whenAllowedAnimationMap?: Map<unknown, unknown[]>;

  private readonly activeIndex = signal(0);

  private readonly currentState = signal<unknown>(undefined);

  readonly shouldAnimate = signal(false);

  readonly transform = () => `translateX(-${this.activeIndex() * 100}%)`;

  ngAfterContentInit(): void {
    const firstSlide = this.slides.first;

    if (firstSlide) {
      this.currentState.set(firstSlide.assignToState);
    }
  }

  public goTo(state: unknown): void {
    const slides = this.slides.toArray();

    const index = slides.findIndex(slide => slide.assignToState === state);

    if (index === -1) {
      console.warn(
        '[TaonSlideContentSlideComponent] Unknown slide state:',
        state,
      );
      return;
    }

    const previousState = this.currentState();

    this.shouldAnimate.set(this.isAnimationAllowed(previousState, state));

    this.currentState.set(state);
    this.activeIndex.set(index);
  }

  private isAnimationAllowed(fromState: unknown, toState: unknown): boolean {
    if (!this.whenAllowedAnimationMap) {
      return true;
    }

    return (
      this.whenAllowedAnimationMap.get(fromState)?.includes(toState) ?? false
    );
  }
}
