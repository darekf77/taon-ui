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

  @Input()
  whenAllowedAnimationMap?: Map<unknown, unknown[]>;

  /**
   * undefined -> automatically use static slides on iOS
   * true      -> always use static slides
   * false     -> always use animated slides
   */
  @Input()
  useStaticSlides?: boolean;

  private readonly activeIndex = signal(0);

  private readonly currentState = signal<unknown>(undefined);

  readonly shouldAnimate = signal(false);

  readonly transform = () => `translateX(-${this.activeIndex() * 100}%)`;

  public staticSlides = false;

  ngAfterContentInit(): void {
    this.staticSlides = this.useStaticSlides ?? this.isIOS();

    this.updateStaticSlides();
  }

  public goTo(state: unknown): void {
    const slides = this.slides.toArray();

    const index = slides.findIndex(slide => slide.assignToState === state);

    if (index === -1) {
      console.warn('[TaonSlideContentComponent] Unknown slide state:', state);
      return;
    }

    const previousState = this.currentState();

    this.shouldAnimate.set(
      !this.staticSlides &&
        previousState !== undefined &&
        this.isAnimationAllowed(previousState, state),
    );

    this.currentState.set(state);
    this.activeIndex.set(index);

    this.updateStaticSlides();
  }

  private updateStaticSlides(): void {
    const activeIndex = this.activeIndex();

    this.slides.forEach((slide, index) => {
      slide.staticMode.set(this.staticSlides);
      slide.staticVisible.set(index === activeIndex);
    });
  }

  private isAnimationAllowed(fromState: unknown, toState: unknown): boolean {
    if (!this.whenAllowedAnimationMap) {
      return true;
    }

    return (
      this.whenAllowedAnimationMap.get(fromState)?.includes(toState) ?? false
    );
  }

  private isIOS(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }

    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }
}
