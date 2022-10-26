import type { ContributionType } from 'helpers/contributions';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { DefaultPaymentButton } from './defaultPaymentButton';

const contributionTypeToPaymentInterval: Partial<
	Record<ContributionType, 'month' | 'year'>
> = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

export type DefaultPaymentContainerProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function getButtonText(
	amountWithCurrency: string,
	paymentInterval?: 'month' | 'year',
) {
	if (paymentInterval) {
		return `${amountWithCurrency} per ${paymentInterval}`;
	}

	return amountWithCurrency;
}

export function DefaultPaymentButtonContainer({
	onClick,
}: DefaultPaymentContainerProps): JSX.Element {
	const { currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const paymentWaiting = useContributionsSelector(
		(state) => state.page.form.isWaiting,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const contributionType = useContributionsSelector(getContributionType);

	const currency = currencies[currencyId];
	const amountWithCurrency = simpleFormatAmount(currency, selectedAmount);

	const buttonText = Number.isNaN(selectedAmount)
		? 'Pay now'
		: getButtonText(
				amountWithCurrency,
				contributionTypeToPaymentInterval[contributionType],
		  );

	return (
		<DefaultPaymentButton
			buttonText={buttonText}
			onClick={onClick}
			loading={paymentWaiting}
		/>
	);
}
