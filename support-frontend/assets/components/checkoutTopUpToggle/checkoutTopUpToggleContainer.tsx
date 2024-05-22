import { useEffect, useState } from 'react';
import { setSelectedAmount } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmountBeforeAmendment } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getLowerBenefitsThreshold } from 'helpers/supporterPlus/benefitsThreshold';
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

	if (contributionType === 'ONE_OFF') {
		return null;
	}

	const amountBeforeAmendments = useContributionsSelector(
		getUserSelectedAmountBeforeAmendment,
	);

	const benefitsThreshold = useContributionsSelector((state) =>
		getLowerBenefitsThreshold(state, contributionType),
	);

	useEffect(() => {
		dispatch(
			setSelectedAmount({
				contributionType: contributionType,
				amount: checked ? `${benefitsThreshold}` : `${amountBeforeAmendments}`,
			}),
		);
		console.log('TEST trackComponentClick-checkoutTopToggleContainer');
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
