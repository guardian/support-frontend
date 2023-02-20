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
		abParticipations.singleToRecurringV3 === 'control' ||
		!abParticipations.singleToRecurringV3
			? 'MONTHLY'
			: 'ANNUAL';
	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId][recurringType].min;

	const minWeeklyAmount =
		countryGroupId === 'GBPCountries'
			? Math.ceil((minAmount * 100) / 52).toString() + `p`
			: currencyGlyph +
			  (Math.ceil((minAmount * 100) / 52) / 100).toFixed(2).toString();

	const title2CopyMonthly = `Support us every month`;
	const paragraphCopyMonthly = `Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up a ${recurringType.toLowerCase()} payment today from just  ${currencyGlyph}${minAmount} – it takes less than a minute.`;

	const title2CopyAnnual = `From just ${currencyGlyph}${minAmount} (${minWeeklyAmount} a week)`;
	const paragraphCopyAnnual = `Funding Guardian journalism every year doesn’t need to be expensive. Make a bigger impact today, and protect our independence long term. Please consider annual support.`;

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
		nudgeTitleCopySection2:
			recurringType === 'MONTHLY' ? title2CopyMonthly : title2CopyAnnual,
		nudgeParagraphCopy:
			recurringType === 'MONTHLY' ? paragraphCopyMonthly : paragraphCopyAnnual,
		nudgeLinkCopy: `See ${recurringType.toLowerCase()}`,
		recurringType: recurringType,
		countryGroupId: countryGroupId,
		onNudgeClose,
		onNudgeClick,
	});
}
