import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { _ } from 'tnp-core/src';

@Component({
  selector: 'taon-stripe-buy-button',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './taon-stripe-buy-button.component.html',
})
export class TaonStripeBuyButtonComponent {
  /**
   * Stripe price id (NOT product id)
   * example: price_1Qabc123456
   */
  @Input({ required: true }) priceId!: string;

  @Input({ required: true }) productId!: string;

  /**
   * Cloudflare worker url that creates checkout session
   * example: https://super-73d1b.darekf77.workers.dev
   */
  @Input({ required: true }) workerUrl!: string;

  /**
   * email of logged user
   * (used later for KV authorization)
   */
  @Input({ required: true }) email!: string;

  @Input() successUrl: string;

  @Input() cancelUrl: string;

  /**
   * optional label
   */
  @Input() label = 'Buy now';

  loading = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.successUrl = _.isString(this.successUrl)
      ? this.successUrl
      : `${location.href.split('?')[0]}?success=true&productId=${this.productId}`;
    this.cancelUrl = _.isString(this.cancelUrl)
      ? this.cancelUrl
      : `${location.href.split('?')[0]}?cancel=true`;
    // console.log({successUrl:this.successUrl})
    // console.log({cancelUrl:this.cancelUrl})
  }

  async buy(): Promise<void> {
    if (!this.priceId || !this.workerUrl || !this.email) {
      console.error('Missing stripe parameters');
      return;
    }

    this.loading = true;

    try {
      const resp = await fetch(`${this.workerUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: this.priceId,
          email: this.email,
          success_url: this.successUrl,
          cancel_url: this.cancelUrl,
        }),
      });

      const data = await resp.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('Stripe checkout url missing', data);
      }
    } catch (err) {
      console.error('Stripe checkout error', err);
    } finally {
      this.loading = false;
    }
  }
}
