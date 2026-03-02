import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

interface Window {
  google?: any;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  constructor(private zone: NgZone) {}

  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as Window).google?.accounts?.id) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  renderButton(
    container: HTMLElement,
    clientId: string,
    width: number,
  ): Observable<any> {
    return new Observable(subscriber => {
      this.loadScript().then(() => {
        const google = (window as Window).google;

        google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response: any) => {
            this.zone.run(() => {
              const payload = this.decodeJwt(response.credential);
              subscriber.next(payload);
            });
          },
        });

        google.accounts.id.disableAutoSelect();
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width,
          type: 'standard',
        });
      });
    });
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  }
}
