import { $Call } from "utility-types";
import React from "react";
import type { ProductPrice } from "helpers/productPrice/productPrices";
import { showPrice } from "helpers/productPrice/productPrices";
import type { DigitalBillingPeriod } from "helpers/productPrice/billingPeriods";
import { Annual, Quarterly } from "helpers/productPrice/billingPeriods";
type GridImageType = typeof import("components/gridImage/gridImage").default;
import type { GridImg } from "components/gridImage/gridImage";
import "components/gridImage/gridImage";
import { getBillingDescription } from "helpers/productPrice/priceDescriptionsDigital";
import EndSummary from "pages/digital-subscription-checkout/components/endSummary/endSummary";
import * as styles from "./orderSummaryStyles";
import { getGiftOrderSummaryText } from "../helpers";
type PropTypes = {
  billingPeriod: DigitalBillingPeriod;
  // eslint-disable-next-line react/no-unused-prop-types
  changeSubscription?: string | null;
  image: $Call<GridImageType, GridImg>;
  productPrice: ProductPrice;
  title: string;
  orderIsAGift?: boolean;
};

function OrderSummary(props: PropTypes) {
  const giftBillingPeriod = props.billingPeriod === Annual ? Annual : Quarterly;
  const giftPriceString = getGiftOrderSummaryText(giftBillingPeriod, showPrice(props.productPrice)).cost;
  const priceString = props.orderIsAGift ? giftPriceString : getBillingDescription(props.productPrice, props.billingPeriod);
  return <aside css={styles.wrapper}>
      <div css={styles.topLine}>
        <h3 css={styles.sansTitle}>Order summary</h3>
        <a href={props.changeSubscription}>Change</a>
      </div>
      <div css={styles.contentBlock}>
        <div css={styles.imageContainer}>{props.image}</div>
        <div css={styles.textBlock}>
          <h4>{props.title}</h4>
          <p>{priceString}</p>
          {!props.orderIsAGift && <span>14 day free trial</span>}
        </div>
      </div>
      <div css={styles.endSummary}>
        <EndSummary orderIsAGift={props.orderIsAGift} />
      </div>
    </aside>;
}

OrderSummary.defaultProps = {
  changeSubscription: '',
  orderIsAGift: false
};
export default OrderSummary;