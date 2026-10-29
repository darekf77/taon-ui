import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Translatable, Translation } from '@taon-dev/i18n/src';
import { Taon } from 'taon/src';

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Directive({
  selector: '[anonymizeText]',
  standalone: true,
})
export class AnonymizeTextDirective implements OnInit, Translatable {
  t = t.for(this);

  tooltip = this.t.signal.gettext('Click to reveal');

  @HostBinding('attr.title')
  get title(): string {
    return this.tooltip();
  }

  private el = inject(ElementRef<HTMLElement>);

  private encodedValue = '';
  private revealed = false;

  @Input() anonymizeText?: string;

  ngOnInit(): void {
    const original = this.anonymizeText || this.el.nativeElement.textContent || '';

    this.encodedValue = btoa(unescape(encodeURIComponent(original.trim())));

    this.el.nativeElement.textContent = this.maskText(original);
    this.el.nativeElement.style.cursor = 'pointer';
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
