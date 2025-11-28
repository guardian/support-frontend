import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import HighlightText from '../../../../components/HighlightText';
import { isGuardianWeeklyGiftProduct } from '../../helpers/productMatchers';
import {
	headerTitleText,
	longHeaderTitleText,
	weeklyGiftLineBreak,
} from './headingStyles';

export type GuardianPrintHeadingProps = {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
};

export default function GuardianPrintHeading({
	productKey,
	ratePlanKey,
}: GuardianPrintHeadingProps) {
	const thankYouText = 'Thank you for supporting our journalism!';
	const guardianWeekly = ['Monthly', 'Annual', 'Quarterly'].includes(
		ratePlanKey,
	);
	if (guardianWeekly) {
		return (
			<h1 css={headerTitleText}>
				{thankYouText}
				<br />
				You have now subscribed to{' '}
				<HighlightText>the Guardian Weekly</HighlightText>
			</h1>
		);
	}

	if (isGuardianWeeklyGiftProduct(productKey, ratePlanKey)) {
		return (
			<h1 css={longHeaderTitleText}>
				{thankYouText}
				<br />
				<div css={weeklyGiftLineBreak}>
					<span>You have now purchased a </span>
					<HighlightText>Guardian Weekly gift subscription</HighlightText>
				</div>
			</h1>
		);
	}

	const maybeRatePlanDetails =
		productCatalogDescription[productKey].ratePlans[ratePlanKey];
	const maybeRatePlanDisplayName = maybeRatePlanDetails?.displayName;
	// This will be something like "Six day package"
	const ratePlanDisplayName =
		maybeRatePlanDisplayName ?? `${ratePlanKey} package`;

	return (
		<h1 css={headerTitleText}>
			{thankYouText}
			<br />
			You have now subscribed to the{' '}
			<HighlightText>{ratePlanDisplayName}</HighlightText>
		</h1>
	);
}
