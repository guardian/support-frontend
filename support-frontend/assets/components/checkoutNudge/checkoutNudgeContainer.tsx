import { useState } from 'preact/hooks';
import { getConfigMinAmount } from 'helpers/contributions';
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

	const [displayNudge, setDisplayNudge] = useState(true);

	const currencyGlyph = glyph(detect(countryGroupId));
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

	const title = 'Support us every year';
	const subtitle = `for ${
		currencyGlyph + minAmount.toString()
	} (${minWeeklyAmount} a week)`;
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
		countryGroupId: countryGroupId,
		onNudgeClose,
		onNudgeClick,
	});
}
