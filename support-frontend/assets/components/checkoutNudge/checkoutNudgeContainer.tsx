import { useState } from 'preact/hooks';
import { config } from 'helpers/contributions';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
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
	const contributionType = useContributionsSelector(getContributionType);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);

	const [displayNudge, setDisplayNudge] = useState(true);

	const recurringType =
		abParticipations.singleToRecurring === 'control' ||
		!abParticipations.singleToRecurring
			? 'MONTHLY'
			: 'ANNUAL';
	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId][recurringType].min;
	const paragraphCopyVariant = `Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up ${
		recurringType === 'MONTHLY' ? 'a' : 'an'
	} ${recurringType.toLowerCase()} payment today from just  ${currencyGlyph}${minAmount} – it takes less than a minute.`;

	function onNudgeClose() {
		setDisplayNudge(false);
	}
	function onNudgeClick() {
		dispatch(setProductType(recurringType));
	}

	return renderNudge({
		contributionType,
		nudgeDisplay: displayNudge,
		nudgeTitleCopySection1: 'Make a bigger impact',
		nudgeTitleCopySection2: `Support us every ${
			recurringType === 'MONTHLY' ? 'month' : 'year'
		}`,
		nudgeParagraphCopy: paragraphCopyVariant,
		nudgeLinkCopy: `See ${recurringType.toLowerCase()}`,
		onNudgeClose,
		onNudgeClick,
	});
}
