import { useState } from 'preact/hooks';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { config } from 'helpers/contributions';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { detect, glyph } from 'helpers/internationalisation/currency';
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

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['MONTHLY'].min;
	const paragraphCopyVariantA = `Regular, reliable funding from readers is vital for our future. It protects our independence long term, so we can report with freedom and truth. Support us monthly from just ${currencyGlyph}${minAmount}.`;
	const paragraphCopyVariantB = `Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up a monthly payment today from just ${currencyGlyph}${minAmount} – it takes less than a minute.`;

	function onNudgeClose() {
		setDisplayNudge(false);
	}
	function onNudgeClick() {
		dispatch(setProductType('MONTHLY'));
	}

	return renderNudge({
		nudgeDisplay: displayNudge,
		nudgeTitleCopySection1:
			abParticipations.singleToRecurring === 'variantA'
				? 'Make a bigger impact'
				: 'Consider monthly',
		nudgeTitleCopySection2:
			abParticipations.singleToRecurring === 'variantA'
				? 'Support us every month'
				: 'to sustain us long term',
		nudgeParagraphCopy:
			abParticipations.singleToRecurring === 'variantA'
				? paragraphCopyVariantA
				: paragraphCopyVariantB,
		onNudgeClose,
		onNudgeClick,
	});
}
