//#region import
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
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { TaonStripeCloudflareWorker } from '@taon-dev/api-workers/src';
import { Taon, Translation } from 'taon/src';

import { TaonKvAuthorizationProduct } from './taon-kv-authorization.models';
//#endregion

const t = Translation.for(Taon.__FILE_RELATIVE_PATH, Taon.LANG_IMPORT_MAP);

@Component({
  selector: 'taon-kv-authorization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './taon-kv-authorization.component.html',
})
export class TaonKvAuthorizationComponent implements OnInit, OnChanges {
  t = t.for(this);

  infoMsg = t.gettext('Loading authorization info...');

  infoMsgSignla = t.signal.gettext(
    'Loading authorization info...',
    null,
    'taon-ui',
  );

  infoMsg$ = t.$.gettext('Loading authorization [[hello]] info...', {
    hello: 'asdasd',
  });

  cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) email!: string;

  @Input({ required: true }) url!: string;

  infoMsgDUMB5 = this.t.gettext(
    'Loading authorization [[a]] info... [[c]]',
    {
      a: 'b',
      c: 'd',
    },
    'amazingcontext',
  );

  @Input({ required: true }) products: TaonKvAuthorizationProduct[] = [];

  @Output() authorizedProducts = new EventEmitter<
    TaonKvAuthorizationProduct[]
  >();

  protected loading = signal(true);

  protected authorizedProductsData = signal<TaonKvAuthorizationProduct[]>([]);

  protected authorizationCheckingInProgress = false;

  ngOnInit(): void {
    this.products = this.products ? this.products : [];
    this.checkIfProducstsAuthorized();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.checkIfProducstsAuthorized();
  }

  public async checkIfProducstsAuthorized(): Promise<void> {
    if (
      this.authorizationCheckingInProgress ||
      !this.products ||
      this.products.length === 0
    ) {
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
