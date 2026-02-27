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
import HighlightText from './HighlightText';
import { isGuardianWeeklyGiftProduct } from './utils/productMatchers';

export type GuardianPrintHeadingProps = {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	enableWeeklyDigital?: boolean;
};

export default function GuardianPrintHeading({
	productKey,
	ratePlanKey,
	enableWeeklyDigital,
}: GuardianPrintHeadingProps) {
	const thankYouText = 'Thank you for supporting our journalism!';
	const guardianWeekly =
		ratePlanKey.startsWith('Monthly') ||
		ratePlanKey.startsWith('Annual') ||
		ratePlanKey.startsWith('Quarterly');
	const nowSubscribed = enableWeeklyDigital
		? 'You are subscribed to'
		: 'You have now subscribed to';
	if (guardianWeekly) {
		return (
			<h1 css={headerTitleText}>
				{thankYouText}
				<br />
				{nowSubscribed} <HighlightText>the Guardian Weekly</HighlightText>
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
