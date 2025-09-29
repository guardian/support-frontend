import { css } from '@emotion/react';
import { from, space, textEgyptian15 } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import DirectDebitMessage from './DirectDebitMessage';
import Heading from './heading';
import LegitimateInterestMessage from './LegitimateInterestMessage';
import ObserverMessage from './ObserverMessage';
import ProductCatalogMessage from './ProductCatalogMessage';
import StartDateMessage from './StartDateMessage';
import { isPrintProduct } from './utils/productMatchers';

const header = css`
	background: white;
	padding: ${space[4]}px 10px ${space[5]}px;
	${from.tablet} {
		padding-left: 0px;
		padding-right: 0px;
		background: none;
	}
`;

const headerSupportingText = css`
	${textEgyptian15};
	padding-top: ${space[3]}px;

	${from.tablet} {
		font-size: 17px;
	}
`;

type ThankYouHeaderProps = {
	name: string | null;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	isDirectDebitPayment: boolean;
	amount: number;
	currency: IsoCurrency;
	observerPrint?: ObserverPrint;
	startDate?: string;
	promotion?: Promotion;
};

function ThankYouHeader({
	name,
	productKey,
	ratePlanKey,
	isDirectDebitPayment,
	amount,
	currency,
	observerPrint,
	startDate,
	promotion,
}: ThankYouHeaderProps): JSX.Element {
	const isPrint = isPrintProduct(productKey);
	const isSubscriptionCard = productKey === 'SubscriptionCard';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const showLegitimateInterestMessage = !(isGuardianAdLite || observerPrint);
	const showProductCatalogMessage = isGuardianAdLite && !observerPrint;
	const showStartDateMessage = isPrint && !isSubscriptionCard;

	return (
		<header css={header}>
			<Heading
				name={name}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				amount={amount}
				currency={currency}
				isObserverPrint={!!observerPrint}
				promotion={promotion}
			/>

			<div css={headerSupportingText}>
				{showStartDateMessage && (
					<StartDateMessage
						productKey={productKey}
						ratePlanKey={ratePlanKey}
						startDate={startDate}
					/>
				)}

				{isDirectDebitPayment && (
					<DirectDebitMessage
						mediaGroup={observerPrint ? 'The Observer' : 'Guardian Media Group'}
					/>
				)}

				{showLegitimateInterestMessage && (
					<LegitimateInterestMessage
						showPaymentStatus={!isDirectDebitPayment}
					/>
				)}

				{observerPrint && <ObserverMessage observerPrint={observerPrint} />}

				{showProductCatalogMessage && (
					<ProductCatalogMessage productKey={productKey} />
				)}
			</div>
		</header>
	);
}

export default ThankYouHeader;
