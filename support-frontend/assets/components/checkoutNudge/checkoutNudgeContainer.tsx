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

	const [title, subtitle, paragraph] = copyNudge(
		recurringType,
		currencyGlyph + minAmount.toString(),
		minWeeklyAmount,
	);

	function copyNudge(
		recurringType: string,
		minAmount: string,
		minWeeklyAmount: string,
	): string[] {
		switch (recurringType) {
			case 'ANNUAL': {
				return [
					`Support us every year`,
					`from just ${minAmount} (${minWeeklyAmount} a week)`,
					`Funding Guardian journalism every year doesn’t need to be expensive. Make a bigger impact today, and protect our independence long term. Please consider annual support.`,
				];
			}
			case 'MONTHLY':
			default: {
				return [
					`Make a bigger impact`,
					`Support us every month`,
					`Regular, reliable support powers Guardian journalism in perpetuity. If you can, please consider setting up a ${recurringType.toLowerCase()} payment today from just  ${minAmount} – it takes less than a minute.`,
				];
			}
		}
	}
	function onNudgeClose() {
		setDisplayNudge(false);
	}
	function onNudgeClick() {
		dispatch(setProductType(recurringType));
	}

	return renderNudge({
		contributionType,
		nudgeDisplay: displayNudge,
		nudgeTitle: title,
		nudgeSubtitle: subtitle,
		nudgeParagraph: paragraph,
		nudgeLinkCopy: `See ${recurringType.toLowerCase()}`,
		recurringType: recurringType,
		countryGroupId: countryGroupId,
		onNudgeClose,
		onNudgeClick,
	});
}
