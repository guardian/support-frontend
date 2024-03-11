import { useEffect, useState } from 'react';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmountBeforeAmendment } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getLowerBenefitsThresholds } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { CheckoutTopUpToggleProps } from './checkoutTopUpToggle';

type CheckoutTopUpToggleContainerProps = {
	renderCheckoutTopUpToggle: (props: CheckoutTopUpToggleProps) => JSX.Element;
};

export function CheckoutTopUpToggleContainer({
	renderCheckoutTopUpToggle,
}: CheckoutTopUpToggleContainerProps): JSX.Element | null {
	const [checked, setChecked] = useState<boolean>(false);

	const dispatch = useContributionsDispatch();

	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const contributionType = useContributionsSelector(getContributionType);
	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);

	if (contributionType === 'ONE_OFF') {
		return null;
	}

	const benefitsThreshold =
		getLowerBenefitsThresholds(countryGroupId)[contributionType];

	useEffect(() => {
		dispatch(
			setSelectedAmount({
				contributionType: contributionType,
				amount: checked ? `${benefitsThreshold}` : `${amountBeforeAmendments}`,
			}),
		);
		trackComponentClick(
			`contribution-topup-toggle-${
				checked ? 'checked' : 'unchecked'
			}-${countryGroupId}-${contributionType}`,
		);
	}, [checked]);

	return renderCheckoutTopUpToggle({
		contributionType,
		benefitsThreshold,
		checked,
		onChange: () => setChecked(!checked),
	});
}
