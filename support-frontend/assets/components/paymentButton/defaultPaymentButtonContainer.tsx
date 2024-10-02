import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { getPromotion } from 'helpers/productPrice/promotions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import {
	getContributionType,
	getMinimumContributionAmount,
} from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { getLowerBenefitsThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { threeTierCheckoutEnabled } from 'pages/supporter-plus-landing/setup/threeTierChecks';
import { deleteAbandonedBasketCookie } from '../../helpers/storage/abandonedBasketCookies';
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
	const { currencyId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);
	const selectedAmount = useContributionsSelector((state) =>
		isSupporterPlus
			? getLowerBenefitsThreshold(
					state,
					contributionType as RegularContributionType,
			  )
			: getUserSelectedAmount(state),
	);
	const promotion = isSupporterPlus
		? useContributionsSelector((state) =>
				getPromotion(
					state.page.checkoutForm.product.productPrices,
					countryId,
					state.page.checkoutForm.product.billingPeriod,
				),
		  )
		: undefined;
	const amount = promotion?.discountedPrice ?? selectedAmount;

	const currency = currencies[currencyId];
	const amountWithCurrency = simpleFormatAmount(currency, amount);

	const testId = 'qa-contributions-landing-submit-contribution-button';

	const amountIsAboveThreshold = useContributionsSelector(
		isSupporterPlusFromState,
	);

	const { abParticipations, amounts } = useContributionsSelector(
		(state) => state.common,
	);

	const minAmount = useContributionsSelector(getMinimumContributionAmount());

	const buttonText =
		Number.isNaN(selectedAmount) || selectedAmount < minAmount
			? 'Pay now'
			: createButtonText(
					amountWithCurrency,
					amountIsAboveThreshold ||
						threeTierCheckoutEnabled(abParticipations, amounts),
					contributionTypeToPaymentInterval[contributionType],
			  );

	return (
		<DefaultPaymentButton
			id={testId}
			buttonText={buttonText}
			onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
				deleteAbandonedBasketCookie();
				onClick(event);
			}}
		/>
	);
}
