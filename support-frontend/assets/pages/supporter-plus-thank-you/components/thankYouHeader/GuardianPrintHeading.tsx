import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import {
	headerTitleText,
	longHeaderTitleText,
	weeklyGiftLineBreak,
} from './headingStyles';
import { isGuardianWeeklyGiftProduct } from './utils/productMatchers';
import YellowHighlightText from './YellowHighlightText';

export default function GuardianPrintHeading({
	productKey,
	ratePlanKey,
}: {
	productKey: ActiveProductKey;
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

	const guardianWeeklyGifting = isGuardianWeeklyGiftProduct(
		productKey,
		ratePlanKey,
	);
	if (guardianWeeklyGifting) {
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

	const paperRatePlanName =
		ratePlanKey === 'Everyday' ? 'Every day' : ratePlanKey;
	return (
		<h1 css={headerTitleText}>
			{thankYouText}
			<br />
			You have now subscribed to the{' '}
			<YellowHighlightText>{paperRatePlanName} package</YellowHighlightText>
		</h1>
	);
}
