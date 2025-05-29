import { css } from '@emotion/react';
import { from, titlepiece42 } from '@guardian/source/foundations';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import PrintProductsHeading from './PrintProductsHeading';
import SupportHeading from './SupportHeading';
import { isPrintProduct } from './utils/productMatchers';
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
	isOneOffPayPal,
	amount,
	currency,
	isObserverPrint,
	ratePlanKey,
	promotion,
}: HeadingProps): JSX.Element {
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isTier3 = productKey === 'TierThree';

	const printProduct = isPrintProduct(productKey);
	const maybeNameAndTrailingSpace: string =
		name && name.length < 10 ? `${name} ` : '';
	const maybeNameAndCommaSpace: string =
		name && name.length < 10 ? `, ${name}, ` : '';
	// Print Products Header
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

	// Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
	if (isOneOffPayPal || !amount) {
		return (
			<h1 css={headerTitleText}>
				Thank you{' '}
				<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>{' '}
				your valuable contribution
			</h1>
		);
	}

	if (isDigitalEdition) {
		return (
			<h1 css={headerTitleText}>
				Thank you
				<span data-qm-masking="blocklist">{maybeNameAndCommaSpace}</span>
				{'for subscribing to the Digital Edition'}
			</h1>
		);
	}

	if (isTier3 || isGuardianAdLite) {
		return (
			<h1 css={longHeaderTitleText}>
				Thank you{' '}
				<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>for
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
		<SupportHeading
			amount={amount}
			name={maybeNameAndTrailingSpace}
			ratePlanKey={ratePlanKey}
			promotion={promotion}
			isoCurrency={currency}
		/>
	);

	// 	default:
	// 		return (
	// 			<h1 css={headerTitleText}>
	// 				Thank you{' '}
	// 				<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>
	// 				for your valuable contribution
	// 			</h1>
	// 		);
	// }
}

export default Heading;
