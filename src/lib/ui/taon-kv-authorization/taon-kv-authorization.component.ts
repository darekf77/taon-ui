import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
} from '@angular/core';
import { TaonStripeCloudflareWorker } from 'tnp-core/src';

export interface TaonKvAuthorizationProduct {
  productTitle:string;
  productId: string;
  /**
   * string with price => real price store in stripe products
   */
  price: string;
  stripePriceId?: string; // stripe price
  stripeProductId?:string; // prod_U6ifA2S3HNSoQr
  authorized?: boolean;
}

@Component({
  selector: 'taon-kv-authorization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taon-kv-authorization.component.html',
})
export class TaonKvAuthorizationComponent implements OnInit {
  @Input({ required: true }) email!: string;

  @Input({ required: true }) url!: string;

  @Input({ required: true }) products: TaonKvAuthorizationProduct[] = [];

  @Output() authorizedProducts = new EventEmitter<
    TaonKvAuthorizationProduct[]
  >();

  protected loading = signal(true);

  protected authorizedProductsData = signal<TaonKvAuthorizationProduct[]>([]);

  async ngOnInit(): Promise<void> {
    const worker = new TaonStripeCloudflareWorker(this.url);

    const results: TaonKvAuthorizationProduct[] = [];

    for (const product of this.products) {
      try {
        const authorized = await worker.checkAccess({
          clientEmail: this.email,
          productId: product.stripeProductId,
        });

        results.push({
          ...product,
          authorized,
        });
      } catch {
        results.push({
          ...product,
          authorized: false,
        });
      }
    }

    this.authorizedProductsData.set(results);
    this.loading.set(false);

    this.authorizedProducts.emit(results);
  }

  protected authorizedCount(): number {
    return this.authorizedProductsData().filter(p => p.authorized).length;
  }
}
