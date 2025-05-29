import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import YellowHighlightText from './YellowHighlightText';

export default function PrintProductsHeading({
	isObserverPrint,
	ratePlanKey,
}: {
	isObserverPrint: boolean;
	ratePlanKey?: ActiveRatePlanKey;
}) {
	if (isObserverPrint) {
		return (
			<>
				You are now an{' '}
				<YellowHighlightText>Observer subscriber</YellowHighlightText>.
				<br />
				Welcome and thank you for supporting Observer journalism!
			</>
		);
	}

	if (!ratePlanKey) {
		return null;
	}

	const thankYouText = 'Thank you for supporting our journalism!';
	const guardianWeekly = ['Monthly', 'Annual', 'Quarterly'].includes(
		ratePlanKey,
	);
	if (guardianWeekly) {
		return (
			<>
				{thankYouText}
				<br />
				You have now subscribed to{' '}
				<YellowHighlightText>the Guardian Weekly</YellowHighlightText>
			</>
		);
	}

	const guardianWeeklyGifting = ['ThreeMonthGift', 'OneYearGift'].includes(
		ratePlanKey,
	);
	if (guardianWeeklyGifting) {
		return (
			<>
				{thankYouText}
				<br />
				Your purchase of a Guardian Weekly gift subscription is now complete
			</>
		);
	}

	const paperRatePlanName =
		ratePlanKey === 'Everyday' ? 'Every day' : ratePlanKey;
	return (
		<>
			{thankYouText}
			<br />
			You have now subscribed to the{' '}
			<YellowHighlightText>{paperRatePlanName}</YellowHighlightText> package
		</>
	);
}
