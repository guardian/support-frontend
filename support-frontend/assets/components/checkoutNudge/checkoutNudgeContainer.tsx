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
import { trackComponentClick } from 'helpers/tracking/behaviour';
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

	const otherAmount =
		otherAmounts[frequency].amount?.length &&
		// Regex pattern matches valid currency value;
		// 1234 or 1234.56
		/^\d*(\.?\d{2})?$/g.test(
			`${parseInt(otherAmounts[frequency].amount ?? '')}`,
		)
			? otherAmounts[frequency].amount
			: '0';

	const annualAmount =
		selectedAmount === 'other' ? otherAmount : selectedAmount;

	const clampedAmount = Math.min(
		Math.max(Number.parseInt(annualAmount ?? '0'), min),
		max,
	);

	let title, subtitle, paragraph;

	if (dynamic) {
		title = 'Make it an annual gift';
		subtitle = `change to ${currencyGlyph}${clampedAmount} per year`;
		paragraph =
			'Choose to support us annually, and you’ll make a bigger impact with your year-end gift. Help protect our open, independent journalism long term.';
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
		paragraph =
			'Funding Guardian journalism every year is great value on a weekly basis. Make a bigger impact today, and protect our independence long term. Please consider annual support.';
	}

	function onNudgeClose() {
		setDisplayNudge(false);
	}

	function onNudgeClick(event: React.MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		trackComponentClick('contribution-annual-nudge');

		if (dynamic) {
			window.location.href = event.currentTarget.href;
			return;
		}

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
		onNudgeClick,
	});
}
