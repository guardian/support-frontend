import { useState } from 'preact/hooks';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { CheckoutNudgeProps } from './checkoutNudge';

type CheckoutNudgeContainerProps = {
	renderNudge: (props: CheckoutNudgeProps) => JSX.Element;
};

export function CheckoutNudgeContainer({
	renderNudge: renderNudge,
}: CheckoutNudgeContainerProps): JSX.Element | null {
	const dispatch = useContributionsDispatch();
	const { countryGroupId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const abParticipations = initAbTests(
		countryId,
		countryGroupId,
		getSettings(),
	);
	const isControl =
		abParticipations.singleToRecurring === 'control' ||
		!abParticipations.singleToRecurring;
	const [displayNudge, setDisplayNudge] = useState(!isControl);

	function onNudgeClose() {
		setDisplayNudge(false);
	}
	function onNudgeClick() {
		dispatch(setProductType('MONTHLY'));
	}

	return renderNudge({
		countryGroupId,
		nudgeDisplay: displayNudge,
		nudgeTitleCopySection1:
			abParticipations.singleToRecurring === 'variantA'
				? 'Make a bigger impact'
				: 'Consider monthly',
		nudgeTitleCopySection2:
			abParticipations.singleToRecurring === 'variantA'
				? 'Support us every month'
				: 'to sustain us long term',
		onNudgeClose,
		onNudgeClick,
	});
}
