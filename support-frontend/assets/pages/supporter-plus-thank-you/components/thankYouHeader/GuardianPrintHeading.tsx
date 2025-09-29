import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import {
	headerTitleText,
	longHeaderTitleText,
	weeklyGiftLineBreak,
} from './headingStyles';
import YellowHighlightText from './YellowHighlightText';

export default function GuardianPrintHeading({
	productKey,
	isWeeklyGift,
	ratePlanKey,
}: {
	productKey: ActiveProductKey;
	isWeeklyGift: boolean;
	ratePlanKey: ActiveRatePlanKey;
}) {
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
				<YellowHighlightText>the Guardian Weekly</YellowHighlightText>
			</h1>
		);
	}

	if (isWeeklyGift) {
		return (
			<h1 css={longHeaderTitleText}>
				{thankYouText}
				<br />
				<div css={weeklyGiftLineBreak}>
					<span>You have now purchased a </span>
					<YellowHighlightText>
						Guardian Weekly gift subscription
					</YellowHighlightText>
				</div>
			</h1>
		);
	}

	const maybeRatePlanDetails =
		productCatalogDescription[productKey].ratePlans[ratePlanKey];
	const maybeRatePlanDisplayName = maybeRatePlanDetails?.label;
	// This will be something like "Six day package"
	const ratePlanDisplayName =
		maybeRatePlanDisplayName ?? `${ratePlanKey} package`;

	return (
		<h1 css={headerTitleText}>
			{thankYouText}
			<br />
			You have now subscribed to the{' '}
			<YellowHighlightText>{ratePlanDisplayName}</YellowHighlightText>
		</h1>
	);
}
