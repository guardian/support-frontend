import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import 'components/gridImage/gridImage';
import OrderSummary from 'components/orderSummary/orderSummary';
import OrderSummaryProduct from 'components/orderSummary/orderSummaryProduct';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Collection } from 'helpers/productPrice/fulfilmentOptions';
import type {
	ActivePaperProducts,
	ProductOptions,
} from 'helpers/productPrice/productOptions';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import {
	selectCorrespondingProductOptionPrice,
	selectPriceForProduct,
} from 'helpers/redux/checkout/product/selectors/productPrice';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import {
	getOrderSummaryTitle,
	getPriceSummary,
} from 'pages/paper-subscription-checkout/helpers/orderSummaryText';

export type OrderSummaryProps = {
	digiSubPrice: string;
	image: JSX.Element | null;
	includesDigiSub: boolean;
	changeSubscription?: string | null;
	startDate?: string;
	total: ProductPrice;
};

function getMobileSummaryTitle(
	productOption: ProductOptions,
	fulfilmentOption: FulfilmentOptions,
	includesDigiSub: boolean | null | undefined = false,
) {
	return (
		<>
			{getOrderSummaryTitle(productOption, fulfilmentOption)}
			{includesDigiSub && <> +&nbsp;digital</>}
		</>
	);
}

function mapStateToProps(state: SubscriptionsState) {
	return {
		fulfilmentOption: state.page.checkoutForm.product.fulfilmentOption,
		productOption: state.page.checkoutForm.product
			.productOption as ActivePaperProducts,
		billingPeriod: state.page.checkoutForm.product.billingPeriod,
		productPrices: state.page.checkoutForm.product.productPrices,
		priceWithoutPromotions: selectPriceForProduct(state),
		correspondingProductOptionPrice:
			selectCorrespondingProductOptionPrice(state),
	};
}

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector> & OrderSummaryProps;

function PaperOrderSummary(props: PropTypes) {
	const rawTotal = getPriceSummary(
		showPrice(props.total, false),
		props.billingPeriod,
	);

	const cleanedTotal = rawTotal.replace(/\/(.*)/, ''); // removes anything after the /

	const total = `${cleanedTotal} per month`;

	// If the user has added a digi sub, we need to know the price of their selected base paper product separately
	const basePaperPrice = props.includesDigiSub
		? props.correspondingProductOptionPrice
		: props.total;

	const activePromo = getAppliedPromo(props.priceWithoutPromotions.promotions);
	const monthsDiscounted = activePromo?.numberOfDiscountedPeriods;

	const promotionPriceString =
		activePromo && monthsDiscounted
			? ` for ${monthsDiscounted} months, then ${showPrice(
					props.priceWithoutPromotions,
					false,
			  )} per month`
			: '';

	const rawPrice = getPriceSummary(
		showPrice(basePaperPrice, false),
		props.billingPeriod,
	);

	const cleanedPrice = rawPrice.replace(/\/(.*)/, ''); // removes anything after the /

	const accessiblePriceString = `You'll pay ${cleanedPrice} per month`;
	const productInfoHomeDelivery = [
		{
			content: `${accessiblePriceString}${promotionPriceString}`,
		},
	];

	const productInfoSubsCard = [
		...productInfoHomeDelivery,
		{
			content: props.startDate
				? `Your first payment will be on ${props.startDate}`
				: '',
			subText:
				'Your subscription card will arrive in the post before the payment date',
		},
	];

	const productInfoPaper =
		props.fulfilmentOption === Collection
			? productInfoSubsCard
			: productInfoHomeDelivery;

	const productInfoDigiSub = [
		{
			content: `You'll pay ${props.digiSubPrice}`,
		},
	];

	const mobilePriceStatement = activePromo
		? `${total}${promotionPriceString}`
		: total;

	const mobileSummary = {
		title: getMobileSummaryTitle(
			props.productOption,
			props.fulfilmentOption,
			props.includesDigiSub,
		),
		price: mobilePriceStatement,
	};

	return (
		<OrderSummary
			image={props.image}
			changeSubscription={props.changeSubscription}
			total={total}
			mobileSummary={mobileSummary}
		>
			<OrderSummaryProduct
				productName={getOrderSummaryTitle(
					props.productOption,
					props.fulfilmentOption,
				)}
				productInfo={productInfoPaper}
			/>
			{props.includesDigiSub && (
				<OrderSummaryProduct
					productName="Digital subscription"
					productInfo={productInfoDigiSub}
				/>
			)}
		</OrderSummary>
	);
}

PaperOrderSummary.defaultProps = {
	changeSubscription: '',
	startDate: '',
};

export default connector(PaperOrderSummary);
