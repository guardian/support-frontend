import { css } from '@emotion/react';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

interface SubheadingProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	identityUserType: UserType;
	observerPrint?: ObserverPrint;
	startDate?: string;
	paymentStatus?: PaymentStatus;
}

const getSubHeadingCopy = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amountIsAboveThreshold: boolean,
	isSignedIn: boolean,
	identityUserType: UserType,
	observerPrint?: ObserverPrint,
	startDate?: string,
) => {
	const recurringCopy = (amountIsAboveThreshold: boolean) => {
		const signedInAboveThreshold = (
			<span
				css={css`
					font-weight: bold;
				`}
			>
				{`You have unlocked your exclusive supporter extras – we hope you	enjoy them.${' '}`}
			</span>
		);

		const getThankyouMessage = (): string | undefined => {
			if (observerPrint === ObserverPrint.SubscriptionCard) {
				return 'You should receive your subscription card in 1-2 weeks, but look out for an email landing in your inbox later today containing details of how you can pick up your newspaper before then.';
			}
			if (observerPrint === ObserverPrint.Paper) {
				return startDate
					? `You will receive your newspapers from ${startDate}.`
					: undefined;
			}
			return productCatalogDescription[productKey].thankyouMessage;
		};
		const thankyouMessage = getThankyouMessage();

		const signedInBelowThreshold = `Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.${' '}`;
		const notSignedInCopy = (
			<span>{thankyouMessage ?? signedInBelowThreshold}</span>
		);
		const signedInCopy = amountIsAboveThreshold ? (
			<>
				{signedInAboveThreshold}
				{notSignedInCopy}
			</>
		) : (
			notSignedInCopy
		);
		return {
			isSignedIn: signedInCopy,
			notSignedIn: notSignedInCopy,
		};
	};

	return (
		ratePlanKey !== 'OneTime' &&
		recurringCopy(amountIsAboveThreshold)[
			identityUserType === 'current' || isSignedIn
				? 'isSignedIn'
				: 'notSignedIn'
		]
	);
};

function Subheading({
	productKey,
	ratePlanKey,
	amountIsAboveThreshold,
	isSignedIn,
	observerPrint,
	identityUserType,
	startDate,
}: SubheadingProps): JSX.Element {
	const subheadingCopy = getSubHeadingCopy(
		productKey,
		ratePlanKey,
		amountIsAboveThreshold,
		isSignedIn,
		identityUserType,
		observerPrint,
		startDate,
	);

	return <>{subheadingCopy}</>;
}

export default Subheading;
