import { css } from '@emotion/react';
import { from, titlepiece42 } from '@guardian/source/dist/foundations';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import YellowHighlightText from './YellowHighlightText';

const heading = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 28px;
	}
`;

export default function PrintProductsHeading({
	isObserverPrint,
	ratePlanKey,
}: {
	isObserverPrint: boolean;
	ratePlanKey?: ActiveRatePlanKey;
}) {
	if (isObserverPrint) {
		return (
			<h1 css={heading}>
				You are now an{' '}
				<YellowHighlightText>Observer subscriber</YellowHighlightText>.
				<br />
				Welcome and thank you for supporting Observer journalism!
			</h1>
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
			<h1 css={heading}>
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
			<h1 css={heading}>
				{thankYouText}
				<br />
				Your purchase of a Guardian Weekly gift subscription is now complete
			</h1>
		);
	}

	const paperRatePlanName =
		ratePlanKey === 'Everyday' ? 'Every day' : ratePlanKey;
	return (
		<h1 css={heading}>
			{thankYouText}
			<br />
			You have now subscribed to the{' '}
			<YellowHighlightText>{paperRatePlanName} package</YellowHighlightText>
		</h1>
	);
}
