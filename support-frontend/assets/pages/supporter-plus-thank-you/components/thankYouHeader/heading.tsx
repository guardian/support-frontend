import { useTheme } from '@emotion/react';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	getProductDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import ContributionHeading from './ContributionHeading';
import GenericHeading from './GenericHeading';
import GuardianPrintHeading from './GuardianPrintHeading';
import {
	headerTitleText,
	longHeaderTitleText,
	observerHeaderTitleText,
	tier3LineBreak,
} from './headingStyles';
import HighlightText from './HighlightText';
import { isContributionProduct, isPrintProduct } from './utils/productMatchers';

type HeadingProps = {
	name: string | null;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	currency: IsoCurrency;
	isObserverPrint: boolean;
	promotion?: Promotion;
	enableWeeklyDigital?: boolean;
};
function Heading({
	name,
	productKey,
	ratePlanKey,
	amount,
	currency,
	isObserverPrint,
	promotion,
	enableWeeklyDigital,
}: HeadingProps) {
	const isPremiumDigital = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isTier3 = productKey === 'TierThree';
	const contributionProduct = isContributionProduct(productKey);
	const isGuardianPrint = isPrintProduct(productKey) && !isObserverPrint;

	const contributorName = name && name.length < 10 ? name : '';

	if (!amount) {
		return <GenericHeading contributorName={contributorName} />;
	}

	if (isGuardianPrint) {
		return (
			<GuardianPrintHeading
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				enableWeeklyDigital={enableWeeklyDigital}
			/>
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
