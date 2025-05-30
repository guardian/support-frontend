import { css } from '@emotion/react';
import { from, titlepiece42 } from '@guardian/source/foundations';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import ContributionHeading from './ContributionHeading';
import PrintProductsHeading from './PrintProductsHeading';
import { isContributionProduct, isPrintProduct } from './utils/productMatchers';
import YellowHighlightText from './YellowHighlightText';

const tier3lineBreak = css`
	display: none;
	${from.tablet} {
		display: inline-block;
	}
`;

const headerTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;
const longHeaderTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 28px;
	}
`;

type HeadingProps = {
	name: string | null;
	productKey: ActiveProductKey;
	isOneOffPayPal: boolean;
	amount: number;
	currency: IsoCurrency;
	isObserverPrint: boolean;
	ratePlanKey: ActiveRatePlanKey;
	paymentStatus?: PaymentStatus;
	promotion?: Promotion;
};
function Heading({
	name,
	productKey,
	amount,
	currency,
	isObserverPrint,
	ratePlanKey,
	promotion,
}: HeadingProps): JSX.Element {
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isTier3 = productKey === 'TierThree';

	const contributionProduct = isContributionProduct(productKey);
	const printProduct = isPrintProduct(productKey);

	const contributorName = name && name.length < 10 ? name : '';

	if (printProduct) {
		return (
			<h1 css={longHeaderTitleText}>
				<PrintProductsHeading
					isObserverPrint={isObserverPrint}
					ratePlanKey={ratePlanKey}
				/>
			</h1>
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
						<br css={tier3lineBreak} />
						Your valued support powers our journalism.
					</>
				)}
			</h1>
		);
	}

	return (
		<h1 css={headerTitleText}>
			Thank you <span data-qm-masking="blocklist">{contributorName}</span> your
			valuable contribution
		</h1>
	);
}

export default Heading;
