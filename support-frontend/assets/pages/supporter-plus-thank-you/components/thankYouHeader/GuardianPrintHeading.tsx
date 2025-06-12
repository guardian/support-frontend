import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { headerTitleText } from './headingStyles';
import YellowHighlightText from './YellowHighlightText';

export default function GuardianPrintheaderTitleText({
	ratePlanKey,
}: {
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

	const guardianWeeklyGifting = ['ThreeMonthGift', 'OneYearGift'].includes(
		ratePlanKey,
	);
	if (guardianWeeklyGifting) {
		return (
			<h1 css={headerTitleText}>
				{thankYouText}
				<br />
				Your purchase of a Guardian Weekly gift subscription is now complete
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
