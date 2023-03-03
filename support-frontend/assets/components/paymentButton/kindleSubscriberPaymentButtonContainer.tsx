import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { getSubscriptionPriceForBillingPeriod } from 'helpers/redux/checkout/product/selectors/subscriptionPrice';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { DefaultPaymentButton } from './defaultPaymentButton';
import type { DefaultPaymentContainerProps } from './defaultPaymentButtonContainer';

const billingPeriodToPaymentInterval: Partial<
	Record<BillingPeriod, 'month' | 'year'>
> = {
	Monthly: 'month',
	Annual: 'year',
};

function getButtonText(
	amountWithCurrency: string,
	_amountIsAboveThreshold: boolean,
	paymentInterval?: 'month' | 'year',
) {
	return `Pay ${amountWithCurrency}${
		paymentInterval ? ` per ${paymentInterval}` : ''
	}`;
}

export function KindleSubscriberPaymentButtonContainer({
	onClick,
	createButtonText = getButtonText,
}: DefaultPaymentContainerProps): JSX.Element {
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const billingPeriod = useContributionsSelector(
		(state) => state.page.checkoutForm.product.billingPeriod,
	);

	const amountWithCurrency = useContributionsSelector(
		getSubscriptionPriceForBillingPeriod,
	);

	const testId = 'qa-contributions-landing-submit-contribution-button';

	const buttonText = Number.isNaN(selectedAmount)
		? 'Pay now'
		: createButtonText(
				amountWithCurrency,
				false,
				billingPeriodToPaymentInterval[billingPeriod],
		  );

	return (
		<DefaultPaymentButton
			id={testId}
			buttonText={buttonText}
			onClick={onClick}
		/>
	);
}
