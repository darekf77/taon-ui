import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthDialogComponent } from './auth-dialog.component';
import { SessionService } from './session.service';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss',
})
export class AuthButtonComponent {
  @Input({ required: true }) linkToDashboard!: string;

  @Input({ required: true }) googleClientId!: string;

  readonly session = inject(SessionService);

  private readonly dialog = inject(MatDialog);

  private readonly router = inject(Router);

  openLogin() {
    this.dialog.open(AuthDialogComponent, {
      width: '720px',
      data: null,
    }).componentInstance.googleClientId = this.googleClientId;
  }

  goDashboard() {
    if (this.linkToDashboard) {
      this.router.navigateByUrl(this.linkToDashboard);
    }
  }

  logout() {
    this.session.logout();
  }
}
