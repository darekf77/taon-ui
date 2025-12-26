//#region imports
import { Directive, ElementRef, Input } from '@angular/core';
//#endregion

@Directive({
  selector: '[taonInjectHTML]',
  standalone: true,
})
export class TaonInjectHTMLDirective {
  @Input() set taonInjectHTML(content: string) {
    this.host.nativeElement.innerHTML = content;
  }

  constructor(private host: ElementRef) {}
}
