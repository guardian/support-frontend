import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	type CountryGroupId,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import getObserver from 'pages/[countryGroupId]/helpers/getObserver';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import {
	isGuardianWeeklyGiftProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
	currency: CurrencyCode;
	amount: number;
	promotion?: Promotion;
}

function getCancellationCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion?: Promotion,
): string {
	const printSubscription =
		productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue';
	const observerPrint = getObserver(productKey, ratePlanKey);
	const observerSubscription =
		observerPrint === ObserverPrint.SubscriptionCard
			? 'subscription'
			: 'first issue';

	const printCopy = isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
		? 'By proceeding, you are agreeing to our Terms & Conditions. This subscription does not auto-renew. If you cancel within 14 days of sign-up, you’ll receive a full refund. To cancel within 14 days of sign-up and receive a refund contact Customer Service.'
		: `Cancel anytime, via your account. Cancel within 14 days of receiving your ${
				observerPrint ? observerSubscription : printSubscription
		  } and receive a full refund. See more about your cooling-off rights in your full pre-contract information here.`;
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent'; // TODO: UTS Students
	const digitalCopy = isStudentOneYearRatePlan
		? `You may cancel your All-access digital subscription within 14 days of taking out the subscription. If you do, you'll receive a full refund and your subscription will stop immediately. To cancel, go to Manage My Account or see our Terms. This subscription does not auto-renew.`
		: promotion
		? ratePlanKey === 'Monthly'
			? `Cancel anytime, via your account. Cancel within 14 days of receiving your ${
					observerPrint ? observerSubscription : printSubscription
			  } or your first payment at £${amount} and receive a full refund of that payment. See more about your cooling-off rights in your full pre-contract information here.`
			: `Cancel anytime, via your account. Cancel within 14 days of sign-up or each renewal and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.`
		: 'You can cancel anytime, via your account. You can cancel within 14 days of sign-up and receive a full refund. You can also cancel within 14 days of your first payment at £XXX and receive a full refund of that payment. See your full pre-contract details, including more information about your cooling-off rights here.';
	const isPrint = isPrintProduct(productKey);
	return isPrint ? printCopy : digitalCopy;
}

export function CancellationPolicy({
	productKey,
	ratePlanKey,
	countryGroupId,
	currency,
	amount,
	promotion,
}: CancellationPolicyProps): JSX.Element | null {
	const isGBP = countryGroupId === GBPCountries;
	const isContribution = productKey === 'Contribution';
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	const display = isGBP && !isContribution && !isWeeklyGift;

	return display ? (
		<p css={marginTop}>
			{getCancellationCopy(productKey, ratePlanKey, amount, promotion)}
			{ratePlanKey} {countryGroupId},{currency},{amount}
			{promotion && JSON.stringify(promotion)},
		</p>
	) : null;
}
