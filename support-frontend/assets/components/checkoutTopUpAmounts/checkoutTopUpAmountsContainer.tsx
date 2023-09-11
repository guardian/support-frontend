import { useEffect, useState } from 'react';
import { checkoutTopUpUpperThresholdsByCountryGroup } from 'helpers/checkoutTopUp/upperThreshold';
import { currencies } from 'helpers/internationalisation/currency';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { CheckoutTopUpAmountsProps } from './checkoutTopUpAmounts';

type CheckoutTopUpAmountsContainerProps = {
	renderCheckoutTopUpAmounts: (props: CheckoutTopUpAmountsProps) => JSX.Element;
};

export function CheckoutTopUpAmountsContainer({
	renderCheckoutTopUpAmounts,
}: CheckoutTopUpAmountsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const selectedAmount = useContributionsSelector(getUserSelectedAmount);
	const contributionType = useContributionsSelector(getContributionType);
	const currencySymbol = currencies[currencyId].glyph;
	const [hasAmountChangedWithTopUp, setHasAmountChangedWithTopUp] =
		useState<boolean>(false);
	const [isWithinThreshold, setIsWithinThreshold] = useState<boolean>(
		contributionType !== 'ONE_OFF' &&
			selectedAmount <=
				checkoutTopUpUpperThresholdsByCountryGroup[countryGroupId][
					contributionType
				],
	);
	useEffect(() => {
		hasAmountChangedWithTopUp && setIsWithinThreshold(true);
	}, [selectedAmount]);

	const timePeriods = {
		ONE_OFF: 'one-off',
		MONTHLY: 'month',
		ANNUAL: 'year',
	};

	const timePeriod = timePeriods[contributionType];

	const handleAmountUpdate = (updateAmountBy: number) => {
		dispatch(
			setSelectedAmount({
				contributionType: contributionType,
				amount: `${selectedAmount + updateAmountBy}`,
			}),
		);
		setHasAmountChangedWithTopUp(true);
	};

	const amounts = Array.from(
		{ length: 5 },
		(_, amountIndex) => amountIndex + 1,
	);

	return renderCheckoutTopUpAmounts({
		currencySymbol,
		timePeriod,
		amounts,
		handleAmountUpdate,
		isWithinThreshold,
	});
}
