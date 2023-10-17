import { useState } from 'preact/hooks';
import type { ContributionType } from 'helpers/contributions';
import { getConfigMinAmount } from 'helpers/contributions';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import {
	getContributionType,
	getSelectedAmount,
} from 'helpers/redux/checkout/product/selectors/productType';
import {
	getMaximumContributionAmount,
	getMinimumContributionAmount,
	isUserInAbVariant,
} from 'helpers/redux/commonState/selectors';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { CheckoutNudgeProps } from './checkoutNudge';

type CheckoutNudgeContainerProps = {
	renderNudge: (props: CheckoutNudgeProps) => JSX.Element;
	frequency: ContributionType;
};

export function CheckoutNudgeContainer({
	renderNudge: renderNudge,
	frequency,
}: CheckoutNudgeContainerProps): JSX.Element | null {
	const dispatch = useContributionsDispatch();
	const contributionType = useContributionsSelector(getContributionType);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const { selectedAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const { amounts } = useContributionsSelector((state) => state.common);
	const { amountsCardData } = amounts;
	const { defaultAmount } = amountsCardData[frequency];

	const [displayNudge, setDisplayNudge] = useState(true);

	const currencyGlyph = glyph(detect(countryGroupId));

	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		frequency,
		defaultAmount,
	).toString();

	const dynamic = useContributionsSelector(
		isUserInAbVariant('makeItAnnualNudge', 'variant'),
	);

	const { otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const min = useContributionsSelector(getMinimumContributionAmount('ANNUAL'));
	const max = useContributionsSelector(getMaximumContributionAmount('ANNUAL'));

	const annualAmount =
		selectedAmount === 'other'
			? otherAmounts[frequency].amount ?? '0'
			: selectedAmount;

	const clampedAmount = Math.min(
		Math.max(Number.parseInt(annualAmount), min),
		max,
	);

	let title, subtitle;

	if (dynamic) {
		title = 'Make it annual';
		subtitle = `change to ${currencyGlyph}${clampedAmount} per year`;
	} else {
		const minAmount = getConfigMinAmount(countryGroupId, 'ANNUAL');
		const weeklyMinAmount =
			Math.round(Math.ceil((minAmount * 100) / 52) / 10) * 10;
		const minWeeklyAmount =
			countryGroupId === 'GBPCountries' && weeklyMinAmount < 100
				? weeklyMinAmount.toString() + `p`
				: currencyGlyph +
				  (weeklyMinAmount / 100)
						.toFixed(weeklyMinAmount % 100 === 0 ? 0 : 2)
						.toString();

		title = 'Support us every year';
		subtitle = `with ${
			currencyGlyph + minAmount.toString()
		} (${minWeeklyAmount} per week)`;
	}

	const paragraph =
		'Funding Guardian journalism every year is great value on a weekly basis. Make a bigger impact today, and protect our independence long term. Please consider annual support.';

	function onNudgeClose() {
		setDisplayNudge(false);
	}

	function onNudgeClick() {
		dispatch(setProductType('ANNUAL'));
	}

	return renderNudge({
		contributionType,
		nudgeDisplay: displayNudge,
		nudgeTitle: title,
		nudgeSubtitle: subtitle,
		nudgeParagraph: paragraph,
		nudgeLinkCopy: `See annual`,
		nudgeLinkHref: dynamic
			? `/contribute?selected-amount=${clampedAmount}&selected-contribution-type=annual`
			: undefined,
		countryGroupId: countryGroupId,
		onNudgeClose,
		onNudgeClick: !dynamic ? onNudgeClick : undefined,
	});
}
