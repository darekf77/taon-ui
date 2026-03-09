import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { TaonStripeCloudflareWorker } from 'tnp-core/src';

export interface TaonKvAuthorizationProduct {
  productTitle: string;
  productId: string;
  /**
   * string with price => real price store in stripe products
   */
  price: string;
  stripePriceId?: string; // stripe price
  stripeProductId?: string; // prod_U6ifA2S3HNSoQr
  authorized?: boolean;
}

@Component({
  selector: 'taon-kv-authorization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './taon-kv-authorization.component.html',
})
export class TaonKvAuthorizationComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) email!: string;

  @Input({ required: true }) url!: string;

  @Input({ required: true }) products: TaonKvAuthorizationProduct[] = [];

  @Output() authorizedProducts = new EventEmitter<
    TaonKvAuthorizationProduct[]
  >();

  protected loading = signal(true);

  protected authorizedProductsData = signal<TaonKvAuthorizationProduct[]>([]);

  protected authorizationCheckingInProgress = false;

  ngOnInit(): void {
    this.checkIfProducstsAuthorized();
  }

  public async checkIfProducstsAuthorized(): Promise<void> {
    if (this.authorizationCheckingInProgress) {
      return;
    }
    this.authorizationCheckingInProgress = true;
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
        this.cdr.markForCheck();
      } catch {
        results.push({
          ...product,
          authorized: false,
        });
        this.cdr.markForCheck();
      }
    }

    this.authorizedProductsData.set(results);
    this.loading.set(false);

    this.authorizedProducts.emit(results);
    this.authorizationCheckingInProgress = false;
    this.cdr.markForCheck();
  }

  protected authorizedCount(): number {
    return this.authorizedProductsData().filter(p => p.authorized).length;
  }
}
