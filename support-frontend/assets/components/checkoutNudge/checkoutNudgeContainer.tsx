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

	const [displayNudge, setDisplayNudge] = useState(true);

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['ANNUAL'].min;

	const minWeeklyAmount =
		countryGroupId === 'GBPCountries'
			? Math.ceil((minAmount * 100) / 52).toString() + `p`
			: currencyGlyph +
			  (Math.ceil((minAmount * 100) / 52) / 100).toFixed(2).toString();

	const [title, subtitle, paragraph] = [
		`Support us every year`,
		`from just ${
			currencyGlyph + minAmount.toString()
		} (${minWeeklyAmount} a week)`,
		`Funding Guardian journalism every year doesn’t need to be expensive. Make a bigger impact today, and protect our independence long term. Please consider annual support.`,
	];

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
