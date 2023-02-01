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

	const isControl =
		abParticipations.singleToRecurring === 'control' ||
		!abParticipations.singleToRecurring;
	const [displayNudge, setDisplayNudge] = useState(!isControl);

	const currencyGlyph = glyph(detect(countryGroupId));
	const recurringType =
		abParticipations.singleToRecurring === 'variantA' ? 'MONTHLY' : 'ANNUAL';
	const minAmount = config[countryGroupId][recurringType].min;
	const paragraphCopyVariantA = `Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up a annual payment today from just  ${currencyGlyph}${minAmount} – it takes less than a minute.`;
	const paragraphCopyVariantB = `Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up a annual payment today from just ${currencyGlyph}${minAmount} – it takes less than a minute.`;

	function onNudgeClose() {
		setDisplayNudge(false);
	}
	function onNudgeClick() {
		dispatch(setProductType(recurringType));
	}

	return renderNudge({
		contributionType,
		nudgeDisplay: displayNudge,
		nudgeTitleCopySection1:
			abParticipations.singleToRecurring === 'variantA'
				? 'Make a bigger impact'
				: 'Make a bigger impact',
		nudgeTitleCopySection2:
			abParticipations.singleToRecurring === 'variantA'
				? 'Support us every month'
				: 'Support us every year',
		nudgeParagraphCopy:
			abParticipations.singleToRecurring === 'variantA'
				? paragraphCopyVariantA
				: paragraphCopyVariantB,
		onNudgeClose,
		onNudgeClick,
	});
}
