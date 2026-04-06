export interface TaonKvAuthorizationProduct {
  productTitle: string;
  parentProductTitle?: string;
  /**
   * ex. YT playlist id
   */
  parentId?: string;
  /**
   * ex. YT id (NOT SAVED INTO AUTHORIZATION DB)
   */
  productId: string;
  /**
   * string with price => real price store in stripe products
   */
  price: string;
  /**
   * example: price_1T8VJBL324234234s36zuh
   */
  stripePriceId?: string; // stripe price
  /**
   * example: prod_U6if12A2S133HNSoQ2r
   * SAVED INTO AUTORIZATION DB
   */
  stripeProductId?: string;
  /**
   * Value of previous price
   * to display promotion
   */
  promotionPreviousPrice?: string;
  authorized?: boolean;
  children?: TaonKvAuthorizationProduct[];
}
