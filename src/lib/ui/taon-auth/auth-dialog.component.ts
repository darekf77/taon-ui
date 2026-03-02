import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
})
export class AuthDialogComponent implements AfterViewInit {
  @Input({ required: true }) googleClientId!: string;

  @ViewChild('emailLoginBtn', { static: true })
  emailLoginBtn!: ElementRef<HTMLDivElement>;

  @ViewChild('googleBtn', { static: true })
  googleBtn!: ElementRef<HTMLDivElement>;

  private readonly dialogRef = inject(MatDialogRef<AuthDialogComponent>);

  private readonly googleAuth = inject(GoogleAuthService);

  private readonly session = inject(SessionService);

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
        console.log({ width });
        this.googleAuth
          .renderButton(
            this.googleBtn.nativeElement,
            this.googleClientId,
            width,
          )
          .subscribe(payload => {
            const email = payload.email;
            const verified = !!payload.email_verified;

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
