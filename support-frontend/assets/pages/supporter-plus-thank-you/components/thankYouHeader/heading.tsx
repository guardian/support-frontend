import type { IsoCurrency } from '@modules/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import ContributionHeading from './ContributionHeading';
import GenericHeading from './GenericHeading';
import GuardianPrintHeading from './GuardianPrintHeading';
import {
	headerTitleText,
	longHeaderTitleText,
	tier3LineBreak,
} from './headingStyles';
import { isContributionProduct, isPrintProduct } from './utils/productMatchers';
import YellowHighlightText from './YellowHighlightText';

type HeadingProps = {
	name: string | null;
	productKey: ActiveProductKey;
	amount: number;
	currency: IsoCurrency;
	isObserverPrint: boolean;
	ratePlanKey: ActiveRatePlanKey;
	isWeeklyGift: boolean;
	promotion?: Promotion;
};
function Heading({
	name,
	productKey,
	amount,
	currency,
	isObserverPrint,
	ratePlanKey,
	isWeeklyGift,
	promotion,
}: HeadingProps) {
	const isDigitalEdition = productKey === 'DigitalSubscription';
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
				isWeeklyGift={isWeeklyGift}
				ratePlanKey={ratePlanKey}
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

	if (isDigitalEdition) {
		return (
			<h1 css={headerTitleText}>
				Thank you <span data-qm-masking="blocklist">{contributorName}</span> for
				subscribing to the{' '}
				<YellowHighlightText>Digital Edition</YellowHighlightText>
			</h1>
		);
	}

	if (isTier3 || isGuardianAdLite) {
		return (
			<h1 css={longHeaderTitleText}>
				Thank you <span data-qm-masking="blocklist">{contributorName}</span> for
				subscribing to{' '}
				<YellowHighlightText>
					{isTier3 ? 'Digital + print.' : 'Guardian Ad-Lite.'}
				</YellowHighlightText>
				{isTier3 && (
					<>
						<br css={tier3LineBreak} />
						Your valued support powers our journalism.
					</>
				)}
			</h1>
		);
	}

	if (isObserverPrint) {
		return (
			<h1 css={headerTitleText}>
				You are now an{' '}
				<YellowHighlightText>Observer subscriber</YellowHighlightText>.
				<br />
				Welcome and thank you for supporting Observer journalism!
			</h1>
		);
	}

	return <GenericHeading contributorName={contributorName} />;
}

export default Heading;
