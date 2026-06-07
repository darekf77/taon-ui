//#region imports
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Self,
  inject,
  AfterViewInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PasswordModule } from 'primeng/password';
import { interval, take, tap } from 'rxjs';
import { TaonStor } from 'taon-storage/src';
//#endregion

export interface TaonSessionPasscodeModel {
  passcode: string;
}

export type TaonSessionPasscodeForm = {
  [prop in keyof TaonSessionPasscodeModel]: FormControl<
    TaonSessionPasscodeModel[prop]
  >;
};

@Component({
  selector: 'taon-session-passcode',
  templateUrl: './taon-session-passcode.component.html',
  styleUrls: ['./taon-session-passcode.component.scss'],
  standalone: true,
  imports: [PasswordModule, CommonModule, ReactiveFormsModule, FormsModule],
})
export class TaonSessionPasscodeComponent implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);

  @Input({
    required: true,
  })
  public passcode: string;

  @Input() public message: string;

  public safeMessage: SafeHtml;

  private lastPasscode = TaonStor.inLocalstorage(
    {
      defaultValue: '',
      keyOrPath: 'lastPasscode',
    },
    TaonSessionPasscodeComponent,
  );

  @HostBinding('style.display') public display = 'none';

  public form: FormGroup<TaonSessionPasscodeForm> =
    new FormGroup<TaonSessionPasscodeForm>({
      passcode: new FormControl(),
    });

  constructor(
    @Self() private element: ElementRef<HTMLElement>,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    if (!this.message) {
      this.message = `
      This website is only for testing purpose. Please type passcode bellow to see content.

      `;
    }
    this.safeMessage = this.domSanitizer.bypassSecurityTrustHtml(this.message);
    await this.lastPasscode.ready();

    if (this.lastPasscode()?.toString() === this.passcode?.toString()) {
      this.hide();
    } else {
      this.show();
      this.focus();
    }
    this.cdr.markForCheck();

    interval(1000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.focus();
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
  }

  submit({ passcode }: Partial<TaonSessionPasscodeModel>) {
    if (this.isPasscodeOK(passcode || '')) {
      this.hide();
    } else {
      this.clear();
    }
  }

  private isPasscodeOK(passcode: string) {
    this.lastPasscode.set(passcode.toString());
    return this.passcode.toString() === passcode;
  }

  ngAfterViewInit(): void {}

  public focus(): void {
    this.element.nativeElement.querySelector('input')?.focus();
  }

  hide() {
    this.display = 'none';
  }

  show() {
    this.display = 'block';
  }

  clear() {
    this.form.controls.passcode.setValue('');
  }

  onKeyup(event: KeyboardEvent & { target: { value: string } }) {
    if (this.isPasscodeOK(event.target.value || '')) {
      this.hide();
      return;
    }
    const key = event.keyCode || event.charCode;
    if (key === 8 || key === 46 || this.lastPasscode()?.length > 5) {
      this.clear();
    }
  }
}
