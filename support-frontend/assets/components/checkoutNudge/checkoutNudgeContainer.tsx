import { useState } from 'preact/hooks';
import { config } from 'helpers/contributions';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { isUserInAbVariant } from 'helpers/redux/commonState/selectors';
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

	const nudgeMinAmountsVariantA = useContributionsSelector(
		isUserInAbVariant('nudgeMinAmountsTest', 'variantA'),
	);
	const nudgeMinAmountsVariantB = useContributionsSelector(
		isUserInAbVariant('nudgeMinAmountsTest', 'variantB'),
	);

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = nudgeMinAmountsVariantA
		? 30
		: nudgeMinAmountsVariantB
		? 50
		: config[countryGroupId]['ANNUAL'].min;
	const roundToNearest = 10;
	const minAmountRounded =
		Math.round(Math.ceil((minAmount * 100) / 52) / roundToNearest) *
		roundToNearest;
	const minWeeklyAmount =
		countryGroupId === 'GBPCountries' && minAmountRounded < 100
			? minAmountRounded.toString() + `p`
			: currencyGlyph + (minAmountRounded / 100).toFixed(2).toString();

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
