import { css } from '@emotion/react';
import { from, space, textEgyptian15 } from '@guardian/source/foundations';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import DirectDebitMessage from './directDebitMessage';
import Heading from './heading';
import LegitimateInterestMessage from './LegitimateInterestMessage';
import StartDateMessage from './StartDateMessage';
import Subheading from './subheading';
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
	showDirectDebitMessage: boolean;
	isOneOffPayPal: boolean;
	amount: number | undefined;
	currency: IsoCurrency;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	identityUserType: UserType;
	observerPrint?: ObserverPrint;
	startDate?: string;
	paymentStatus?: PaymentStatus;
	promotion?: Promotion;
};

function ThankYouHeader({
	name,
	productKey,
	ratePlanKey,
	showDirectDebitMessage,
	isOneOffPayPal,
	amount,
	currency,
	amountIsAboveThreshold,
	isSignedIn,
	identityUserType,
	observerPrint,
	startDate,
	paymentStatus,
	promotion,
}: ThankYouHeaderProps): JSX.Element {
	const isPrint = isPrintProduct(productKey);
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const showLegitimateInterestMessage = !isGuardianAdLite || !observerPrint;
	const showStartDateMessage = showLegitimateInterestMessage && isPrint;

	return (
		<header css={header}>
			<Heading
				name={name}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				isOneOffPayPal={isOneOffPayPal}
				amount={amount}
				currency={currency}
				isObserverPrint={!!observerPrint}
				paymentStatus={paymentStatus}
				promotion={promotion}
			/>

			<div css={headerSupportingText}>
				{showDirectDebitMessage && (
					<DirectDebitMessage
						mediaGroup={observerPrint ? 'The Observer' : 'Guardian Media Group'}
					/>
				)}

				{showStartDateMessage && <StartDateMessage startDate={startDate} />}

				{showLegitimateInterestMessage && <LegitimateInterestMessage />}

				{!showLegitimateInterestMessage && (
					<Subheading
						productKey={productKey}
						ratePlanKey={ratePlanKey}
						amountIsAboveThreshold={amountIsAboveThreshold}
						isSignedIn={isSignedIn}
						observerPrint={observerPrint}
						identityUserType={identityUserType}
						paymentStatus={paymentStatus}
						startDate={startDate}
					/>
				)}
			</div>
		</header>
	);
}

export default ThankYouHeader;
