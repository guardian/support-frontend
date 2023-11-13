import { useState } from 'preact/hooks';
import type { ContributionType } from 'helpers/contributions';
import { getConfigMinAmount } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
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

function calcWeeklyAmount(
	countryGroupId: CountryGroupId,
	currencyGlyph: string,
	annualAmount: number,
	toNearest = 1,
) {
	const weeklyAmount = Math.ceil((annualAmount * 100) / 52);
	// Current/control solution is to round to the nearest 10p so this may be
	// disposable if the variant is adopted as we want the dynamic version to be
	// rounded to the nearest 1p
	const roundedWeeklyAmount = Math.round(weeklyAmount / toNearest) * toNearest;

	if (countryGroupId === 'GBPCountries' && roundedWeeklyAmount < 100) {
		return `${roundedWeeklyAmount.toString()}p`;
	} else {
		const fixedDigitAmount = roundedWeeklyAmount % 100 === 0 ? 0 : 2;
		const amountString = (roundedWeeklyAmount / 100).toFixed(fixedDigitAmount);
		return `${currencyGlyph}${amountString}`;
	}
}

function getDynamicCopy(
	isDynamicUs: boolean,
	isDynamicGlobal: boolean,
	countryGroupId: CountryGroupId,
	clampedAmount: number,
): { title: string; subtitle: string; paragraph: string } {
	const currency = detect(countryGroupId);
	const currencyGlyph = glyph(currency);

	const clampedAmountToCurrenyStr = `${currencyGlyph}${new Intl.NumberFormat(
		'en-GB',
		{
			minimumFractionDigits: clampedAmount % 1 == 0 ? 0 : 2,
		},
	).format(clampedAmount)}`;

	if (isDynamicUs) {
		return {
			title: 'Make it annual',
			subtitle: `change to ${clampedAmountToCurrenyStr} per year`,
			paragraph:
				'Regular, reliable funding from readers is vital for our future. Help protect our open, independent journalism long term.',
		};
	}

	const title = 'Support us every year';
	const paragraph =
		'Funding Guardian journalism every year is great value on a weekly basis. Make a bigger impact today, and protect our independence long term. Please consider annual support.';

	if (isDynamicGlobal) {
		return {
			title,
			paragraph,
			subtitle: `with ${clampedAmountToCurrenyStr} (${calcWeeklyAmount(
				countryGroupId,
				currencyGlyph,
				clampedAmount,
			)} per week)`,
		};
	}

	const minAmount = getConfigMinAmount(countryGroupId, 'ANNUAL');

	return {
		title,
		paragraph,
		subtitle: `with ${currencyGlyph + minAmount.toString()} (${calcWeeklyAmount(
			countryGroupId,
			currencyGlyph,
			minAmount,
			10,
		)} per week)`,
	};
}

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

	const selectedAmount = getSelectedAmount(
		selectedAmounts,
		frequency,
		defaultAmount,
	).toString();

	const isDynamicUs = useContributionsSelector(
		isUserInAbVariant('makeItAnnualNudge', 'variant'),
	);

	const isDynamicGlobal = useContributionsSelector(
		isUserInAbVariant('makeItAnnualNudgeGlobal', 'variant'),
	);

	const isDynamic = isDynamicUs || isDynamicGlobal;

	const { otherAmounts } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);

	const min = useContributionsSelector(getMinimumContributionAmount('ANNUAL'));
	const max = useContributionsSelector(getMaximumContributionAmount('ANNUAL'));

	const otherAmount =
		otherAmounts[frequency].amount?.length &&
		// Regex pattern matches valid 'other amount' input;
		// 1234 or 1234.5 or 1234.56
		/^\d*(\.?\d{1,2})?$/g.test(otherAmounts[frequency].amount ?? '')
			? otherAmounts[frequency].amount
			: '0';

	const annualAmount =
		selectedAmount === 'other' ? otherAmount : selectedAmount;

	const clampedAmount = Math.min(
		Math.max(Number(annualAmount ?? '0'), min),
		max,
	);

	const { title, subtitle, paragraph } = getDynamicCopy(
		isDynamicUs,
		isDynamicGlobal,
		countryGroupId,
		clampedAmount,
	);

	function onNudgeClose() {
		setDisplayNudge(false);
	}

	function onNudgeClick(event: React.MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		trackComponentClick('contribution-annual-nudge');

		if (isDynamic) {
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
		nudgeLinkHref: isDynamic
			? `/contribute?selected-amount=${clampedAmount}&selected-contribution-type=annual`
			: undefined,
		countryGroupId: countryGroupId,
		onNudgeClose,
		onNudgeClick,
	});
}
