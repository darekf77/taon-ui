import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MicrosoftAuthService {
  login(clientId: string): Observable<any> {
    return new Observable(subscriber => {
      const redirectUri = window.location.origin;
      const nonce = crypto.randomUUID();

      const url =
        'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize' +
        `?client_id=${clientId}` +
        `&response_type=id_token` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=openid profile email` +
        `&response_mode=fragment` +
        `&prompt=login` +
        `&nonce=${nonce}`;

      const popup = window.open(url, 'microsoft-login', 'width=500,height=600');

      if (!popup) {
        subscriber.error('Popup blocked');
        return;
      }

      const timer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(timer);
            subscriber.complete();
            return;
          }

          const popupUrl = popup.location.href;

          // Wait until redirect happens back to our domain
          if (!popupUrl.startsWith(redirectUri)) return;

          const hash = popup.location.hash;
          if (!hash) return;

          const params = new URLSearchParams(hash.substring(1));
          const idToken = params.get('id_token');

          if (idToken) {
            clearInterval(timer);
            popup.close();

            const payload = this.decodeJwt(idToken);

            subscriber.next({
              email: payload.email || payload.preferred_username,
              name: payload.name,
              picture: undefined,
            });

            subscriber.complete();
          }
        } catch {
          // Cross-origin access throws until redirect returns to our domain
        }
      }, 300);
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
