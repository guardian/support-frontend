import React from 'react';
import type { ReactNode } from 'react';
import type { DigitalBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Annual, Quarterly } from 'helpers/productPrice/billingPeriods';
import { getBillingDescription } from 'helpers/productPrice/priceDescriptionsDigital';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import EndSummary from 'pages/digital-subscription-checkout/components/endSummary/endSummary';
import { getGiftOrderSummaryText } from '../helpers';
import * as styles from './orderSummaryStyles';

type PropTypes = {
	billingPeriod: DigitalBillingPeriod;
	changeSubscription?: string;
	image: ReactNode;
	productPrice: ProductPrice;
	title: string;
	orderIsAGift?: boolean;
};

function OrderSummary(props: PropTypes): JSX.Element {
	const giftBillingPeriod = props.billingPeriod === Annual ? Annual : Quarterly;
	const giftPriceString = getGiftOrderSummaryText(
		giftBillingPeriod,
		showPrice(props.productPrice),
	).cost;
	const priceString = props.orderIsAGift
		? giftPriceString
		: getBillingDescription(props.productPrice, props.billingPeriod);
	return (
		<aside css={styles.wrapper}>
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
				<EndSummary />
			</div>
		</aside>
	);
}

OrderSummary.defaultProps = {
	changeSubscription: '',
	orderIsAGift: false,
};
export default OrderSummary;
