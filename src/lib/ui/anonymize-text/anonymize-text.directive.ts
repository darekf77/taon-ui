import { Directive, ElementRef, HostListener, inject, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[anonymizeText]',
  standalone: true,
})
export class AnonymizeTextDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);

  private encodedValue = '';
  private revealed = false;

  @Input() anonymizeText?: string;

  ngOnInit(): void {
    const original = this.anonymizeText || this.el.nativeElement.textContent || '';

    this.encodedValue = btoa(unescape(encodeURIComponent(original.trim())));

    this.el.nativeElement.textContent = this.maskText(original);
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.title = 'Click to reveal';
  }

  @HostListener('click')
  toggle(): void {
    this.revealed = !this.revealed;

    const decoded = decodeURIComponent(escape(atob(this.encodedValue)));

    this.el.nativeElement.textContent = this.revealed
      ? decoded
      : this.maskText(decoded);
  }

  private maskText(value: string): string {
    return value.replace(/[a-zA-Z0-9]+/g, part => {
      if (part.length <= 2) return part;
      if (part.length === 3) return `${part[0]}*${part[2]}`;

      return `${part.slice(0, 2)}${'*'.repeat(part.length - 3)}${part.at(-1)}`;
    });
  }
}
