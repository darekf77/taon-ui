import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'taon-slide-content-child',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  styles: `
    :host {
      display: block;
      flex: 0 0 100%;
      width: 100%;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaonSlideContentContentChildComponent {
  @Input({ required: true })
  assignToState!: unknown;
}
