import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MtxLoaderModule, MtxLoaderType } from '@ng-matero/extensions/loader';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { _ } from 'tnp-core/src';

import { GoogleAuthService } from './google-auth.service';
import { SessionService } from './session.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MtxLoaderModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
})
export class AuthDialogComponent implements AfterViewInit {
  cdr = inject(ChangeDetectorRef);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  @Input({ required: true }) googleClientId!: string;

  @ViewChild('emailLoginBtn', { static: true })
  emailLoginBtn!: ElementRef<HTMLDivElement>;

  @ViewChild('googleBtn', { static: true })
  googleBtn!: ElementRef<HTMLDivElement>;

  diableLoginByEmail = !(
    window.location.hostname === 'localhost'
  );

  private readonly dialogRef = inject(MatDialogRef<AuthDialogComponent>);

  private readonly googleAuth = inject(GoogleAuthService);

  private readonly session = inject(SessionService);

  googleButtonLoaded = false;

  loginByEmail(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const displayName = _.startCase(
      (this.form.value.email || '').split('@')[0],
    );

    this.session.loginWithGoogle({
      email: this.form.value.email,
      emailVerified: true,
      displayName,
      // pictureUrl: payload.picture,
    });
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.diableLoginByEmail) {
      this.form.controls.email.disable();
    }
  }

  ngAfterViewInit(): void {
    if (!this.googleClientId) {
      console.warn('Google client id missing');
      return;
    }

    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        const el: HTMLElement = this.emailLoginBtn.nativeElement;
        const width = Math.floor(el.getBoundingClientRect().width);
        // el.style.width = `${width}px`;
        // console.log({ width });
        this.googleAuth
          .renderButton(
            this.googleBtn.nativeElement,
            this.googleClientId,
            width,
          )
          .subscribe(payload => {
            const email = payload.email;
            const verified = !!payload.email_verified;
            this.googleButtonLoaded = true;
            this.cdr.markForCheck();

            if (email && verified) {
              this.session.loginWithGoogle({
                email,
                emailVerified: verified,
                displayName: payload.name,
                pictureUrl: payload.picture,
              });
              this.dialogRef.close();
            }
          });
      });
    });
  }
}
