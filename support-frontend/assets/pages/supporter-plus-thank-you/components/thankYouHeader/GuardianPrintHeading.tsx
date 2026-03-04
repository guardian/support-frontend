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
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyProduct,
} from './utils/productMatchers';

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
	const nowSubscribed = enableWeeklyDigital
		? 'You are subscribed to'
		: 'You have now subscribed to';

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
	if (isGuardianWeeklyProduct(productKey)) {
		return (
			<h1 css={headerTitleText}>
				{thankYouText}
				<br />
				{nowSubscribed} <HighlightText>the Guardian Weekly</HighlightText>
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
