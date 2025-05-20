import { css } from '@emotion/react';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

const yellowHighlightText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;

export function YellowHighlightText({ text }: { text: string }) {
	return <span css={yellowHighlightText}>{text}</span>;
}

export default function PrintProductsHeading({
	isObserverPrint,
	ratePlanKey,
	isPending,
}: {
	isObserverPrint: boolean;
	ratePlanKey?: ActiveRatePlanKey;
	isPending: boolean;
}): JSX.Element {
	if (isObserverPrint) {
		const statusText = isPending ? (
			<>
				Your <YellowHighlightText text="Observer subscription" /> is being
				processed
			</>
		) : (
			<>
				You are now an <YellowHighlightText text="Observer subscription" />.
			</>
		);
		return (
			<>
				{statusText}
				Welcome and thank you for supporting Observer journalism!
			</>
		);
	}

	if (!ratePlanKey) {
		return;
	}

	const thankYouText = 'Thank you for supporting our journalism!';
	const guardianWeekly = ['Monthly', 'Annual', 'Quarterly'].includes(
		ratePlanKey,
	);
	if (guardianWeekly) {
		const statusText = (
			<>
				You have now subscribed to{' '}
				<YellowHighlightText text="the Guardian Weekly" />
			</>
		);

		return (
			<>
				{thankYouText}
				{statusText}
			</>
		);
	}

	const guardianWeeklyGifting = ['ThreeMonthGift', 'OneYearGift'].includes(
		ratePlanKey,
	);
	if (guardianWeeklyGifting) {
		const statusText = isPending
			? 'Your Guardian Weekly gift subscription is being processed'
			: 'Your purchase of a Guardian Weekly gift subscription is now complete';
		return (
			<>
				{thankYouText}
				{statusText}
			</>
		);
	}

	const paperRatePlanName =
		ratePlanKey === 'Everyday' ? 'Every day' : ratePlanKey;
	return (
		<>
			{thankYouText}
			{isPending
				? `Your subscription to the ${paperRatePlanName} package is being processed`
				: `You have now subscribed to the ${paperRatePlanName} package`}
		</>
	);
}
