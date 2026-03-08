import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {_} from 'tnp-core/src';

import { AuthDialogComponent } from './auth-dialog.component';
import { SessionService } from './session.service';

@Component({
  selector: 'taon-auth-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ButtonModule, MatIconModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss',
})
export class AuthButtonComponent implements OnInit {
  @Input({ required: true }) linkToDashboard!: string;

  @Input({ required: true }) googleClientId!: string;

  @Input() displayDashboardButton: boolean;

  readonly session = inject(SessionService);

  private readonly dialog = inject(MatDialog);

  private readonly router = inject(Router);

  openLogin() {
    this.dialog.open(AuthDialogComponent, {
      width: '410px',
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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log('this.displayDashboardButton', this.displayDashboardButton);
    this.displayDashboardButton = _.isBoolean(this.displayDashboardButton)
      ? this.displayDashboardButton
      : true;
  }
}
