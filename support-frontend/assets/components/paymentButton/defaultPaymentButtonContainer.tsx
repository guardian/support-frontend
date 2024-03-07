import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getPromotion } from 'helpers/productPrice/promotions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { shouldShowSupporterPlusMessaging } from 'helpers/supporterPlus/showMessaging';
import { showThreeTierCheckout } from 'pages/supporter-plus-landing/setup/threeTierABTest';
import { DefaultPaymentButton } from './defaultPaymentButton';

const contributionTypeToPaymentInterval: Partial<
	Record<ContributionType, 'month' | 'year'>
> = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

type ButtonTextCreator = (
	amountWithCurrency: string,
	amountIsAboveThreshold: boolean,
	paymentInterval?: 'month' | 'year' | undefined,
) => string;

export type DefaultPaymentContainerProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	createButtonText?: ButtonTextCreator;
	disabled?: boolean;
};

function getButtonText(
	amountWithCurrency: string,
	amountIsAboveThreshold: boolean,
	paymentInterval?: 'month' | 'year',
) {
	if (paymentInterval) {
		return `${
			amountIsAboveThreshold ? 'Pay' : 'Support us with'
		} ${amountWithCurrency} per ${paymentInterval}`;
	}

	return `Support us with ${amountWithCurrency}`;
}

export function DefaultPaymentButtonContainer({
	onClick,
	createButtonText = getButtonText,
}: DefaultPaymentContainerProps): JSX.Element {
	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { selectedAmounts, otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const contributionType = useContributionsSelector(getContributionType);

	const currency = currencies[currencyId];
	const amountWithCurrency = simpleFormatAmount(currency, selectedAmount);

	const { countryId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { productType } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const billingPeriod = (productType[0] +
		productType.slice(1).toLowerCase()) as BillingPeriod;
	const promotion = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.productPrices,
			countryId,
			billingPeriod,
		),
	);

	const testId = 'qa-contributions-landing-submit-contribution-button';
	const amountIsAboveThreshold = shouldShowSupporterPlusMessaging(
		contributionType,
		selectedAmounts,
		otherAmounts,
		countryGroupId,
		promotion,
	);

	const buttonText = Number.isNaN(selectedAmount)
		? 'Pay now'
		: createButtonText(
				amountWithCurrency,
				amountIsAboveThreshold ||
					showThreeTierCheckout(
						useContributionsSelector((state) => state.common).abParticipations,
					),
				contributionTypeToPaymentInterval[contributionType],
		  );

	return (
		<DefaultPaymentButton
			id={testId}
			buttonText={buttonText}
			onClick={onClick}
		/>
	);
}
