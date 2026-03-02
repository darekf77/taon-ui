import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, shareReplay } from 'rxjs';

export interface SessionState {
  isLoggedIn: boolean;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  pictureUrl?: string;
}

const STORAGE_KEY = 'auth_session_v1';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state$ = new BehaviorSubject<SessionState>(this.load());

  readonly isLoggedIn$ = this.state$.pipe(
    map(s => !!s.isLoggedIn),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly emailConfirmed$ = this.state$.pipe(
    map(s => !!s.emailVerified),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly email$ = this.state$.pipe(
    map(s => s.email ?? ''),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  get snapshot(): SessionState {
    return this.state$.value;
  }

  loginWithGoogle(data: {
    email: string;
    emailVerified: boolean;
    displayName?: string;
    pictureUrl?: string;
  }) {
    const next: SessionState = {
      isLoggedIn: true,
      email: data.email,
      emailVerified: data.emailVerified,
      displayName: data.displayName,
      pictureUrl: data.pictureUrl,
    };

    this.state$.next(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  logout() {
    const next: SessionState = { isLoggedIn: false };
    this.state$.next(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private load(): SessionState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { isLoggedIn: false };
      return JSON.parse(raw);
    } catch {
      return { isLoggedIn: false };
    }
  }
}
