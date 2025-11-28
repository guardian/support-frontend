import { useTheme } from '@emotion/react';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getFeatureFlags } from 'helpers/featureFlags';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	getProductDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import HighlightText from '../../../../components/HighlightText';
import {
	isContributionProduct,
	isPrintProduct,
} from '../../../../helpers/productMatchers';
import ContributionHeading from './ContributionHeading';
import GenericHeading from './GenericHeading';
import GuardianPrintHeading from './GuardianPrintHeading';
import {
	headerTitleText,
	longHeaderTitleText,
	observerHeaderTitleText,
	tier3LineBreak,
} from './headingStyles';

type HeadingProps = {
	name: string | null;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	currency: IsoCurrency;
	isObserverPrint: boolean;
	promotion?: Promotion;
};
function Heading({
	name,
	productKey,
	ratePlanKey,
	amount,
	currency,
	isObserverPrint,
	promotion,
}: HeadingProps) {
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isTier3 = productKey === 'TierThree';
	const contributionProduct = isContributionProduct(productKey);
	const isGuardianPrint = isPrintProduct(productKey) && !isObserverPrint;
	const { enablePremiumDigital } = getFeatureFlags();
	const isPremiumDigital = enablePremiumDigital && isDigitalEdition;

	const contributorName = name && name.length < 10 ? name : '';

	if (!amount) {
		return <GenericHeading contributorName={contributorName} />;
	}

	if (isGuardianPrint) {
		return (
			<GuardianPrintHeading productKey={productKey} ratePlanKey={ratePlanKey} />
		);
	}

	if (contributionProduct) {
		return (
			<ContributionHeading
				amount={amount}
				name={contributorName}
				ratePlanKey={ratePlanKey}
				promotion={promotion}
				isoCurrency={currency}
			/>
		);
	}

	if (isDigitalEdition && !isPremiumDigital) {
		return (
			<h1 css={headerTitleText}>
				Thank you <span data-qm-masking="blocklist">{contributorName}</span> for
				subscribing to the <HighlightText>Digital Edition</HighlightText>
			</h1>
		);
	}

	if (isTier3 || isGuardianAdLite || isPremiumDigital) {
		const { label: productName } = getProductDescription(
			productKey,
			ratePlanKey,
		);

		return (
			<h1 css={longHeaderTitleText}>
				Thank you <span data-qm-masking="blocklist">{contributorName}</span> for
				subscribing to <HighlightText>{productName}</HighlightText>
				{(isTier3 || isPremiumDigital) && (
					<>
						<br css={tier3LineBreak} />
						Your valued support powers our journalism.
					</>
				)}
			</h1>
		);
	}

	if (isObserverPrint) {
		const { observerThemeButton } = useTheme();
		return (
			<h1
				css={[headerTitleText, observerThemeButton && observerHeaderTitleText]}
			>
				You are now an{' '}
				<HighlightText>
					Observer{isObserverSubdomain() ? ' digital & print' : ''} subscriber
				</HighlightText>
				.
				<br />
				Thank you for subscribing to The Observer.
			</h1>
		);
	}

	return <GenericHeading contributorName={contributorName} />;
}

export default Heading;
