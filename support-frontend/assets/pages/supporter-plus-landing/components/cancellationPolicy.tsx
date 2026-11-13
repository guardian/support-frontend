import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	contributionsTermsLinks,
	digitalPlusTermsLink,
	guardianAdLiteTermsLink,
	guardianHelpCentreLink,
	guardianWeeklyTermsLink,
	manageAccountLink,
	observerLinks,
	paperTermsLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { textLink } from 'helpers/utilities/textLink';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

const getTerms = (
	copy: string,
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
) => {
	switch (productKey) {
		case 'Contribution':
			return textLink(copy, contributionsTermsLinks['GBPCountries']);
		case 'GuardianAdLite':
			return textLink(copy, guardianAdLiteTermsLink);
		case 'SupporterPlus':
			return textLink(copy, supporterPlusTermsLink);
		case 'DigitalSubscription':
			return textLink(copy, digitalPlusTermsLink);
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return textLink(copy, guardianWeeklyTermsLink);
		case 'HomeDelivery':
		case 'SubscriptionCard':
		case 'NationalDelivery':
			return textLink(
				copy,
				ratePlanKey.startsWith('Sunday') ? observerLinks.TERMS : paperTermsLink,
			);
		default:
			return textLink(copy, guardianHelpCentreLink); // default to help centre for oneTime
	}
};

const digitalMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
		within 14 days of sign-up and receive a full refund. See more about your
		cooling-off rights in your full pre-contract information{' '}
		{getTerms('here', productKey, ratePlanKey)}.
	</p>
);
const digitalAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
		within 14 days of sign-up or each renewal and receive a full refund of your
		pre-contract information {getTerms('here', productKey, ratePlanKey)}.
	</p>
);
const studentAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		You may cancel your All-access digital subscription within 14 days of taking
		out the subscription. If you do, you'll receive a full refund and your
		subscription will stop immediately. To cancel, go to{' '}
		{textLink('Manage My Account', manageAccountLink)} or see our{' '}
		{getTerms('terms', productKey, ratePlanKey)}. This subscription does not
		auto-renew.
	</p>
);

const printMonthlyDelivery = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
		within 14 days of receiving your first issue and receive a full refund. See
		more about your cooling-off rights in your full pre-contract information{' '}
		{getTerms('here', productKey, ratePlanKey)}.
	</p>
);
const printMonthlySubscription = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
		within 14 days of receiving your subscription card and receive a full
		refund. See more about your cooling-off rights in your full pre-contract
		information {getTerms('here', productKey, ratePlanKey)}.
	</p>
);
const printAnnualDelivery = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
		within 14 days of receiving your first issue and receive a full refund. See
		more about your cooling-off rights in your full pre-contract information{' '}
		{getTerms('here', productKey, ratePlanKey)}.
	</p>
);
const printGift = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<p css={marginTop}>
		By proceeding, you are agreeing to our{' '}
		{getTerms('Terms & Conditions', productKey, ratePlanKey)}. This subscription
		does not auto-renew. If you cancel within 14 days of sign-up, you'll receive
		a full refund. To cancel within 14 days of sign-up and receive a refund
		contact Customer Service.
	</p>
);

const promotionDigitalMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	firstPayment: number,
): JSX.Element => {
	return (
		<p css={marginTop}>
			Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
			within 14 days of sign-up or your first payment at £${firstPayment} and
			receive a full refund of your last payment. See more about your
			cooling-off rights in your full pre-contract information{' '}
			{getTerms('here', productKey, ratePlanKey)}.
		</p>
	);
};
const promotionPrintAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	firstPayment: number,
): JSX.Element => {
	return (
		<p css={marginTop}>
			Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
			within 14 days of receiving your $
			{productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue'}{' '}
			or your first payment at £${firstPayment} and receive a full refund of
			that payment. See more about your cooling-off rights in your full
			pre-contract information {getTerms('here', productKey, ratePlanKey)}.
		</p>
	);
};
const promotionObserverMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => {
	return (
		<p css={marginTop}>
			Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
			within 14 days of receiving your $
			{productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue'}{' '}
			and receive a full refund. See more about your cooling-off rights in your
			full pre-contract information {getTerms('here', productKey, ratePlanKey)}.
		</p>
	);
};

type PolicyElement = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, JSX.Element>>>
>;

const getCancellation = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): PolicyElement => {
	return {
		GuardianAdLite: {
			Monthly: digitalMonthly(productKey, ratePlanKey),
		},
		SupporterPlus: {
			Monthly: digitalMonthly(productKey, ratePlanKey),
			MonthlyTaxExclusive: digitalMonthly(productKey, ratePlanKey),
			Annual: digitalAnnual(productKey, ratePlanKey),
			AnnualTaxExclusive: digitalAnnual(productKey, ratePlanKey),
			OneYearStudent: studentAnnual(productKey, ratePlanKey),
		},
		DigitalSubscription: {
			Monthly: digitalMonthly(productKey, ratePlanKey),
			MonthlyTaxExclusive: digitalMonthly(productKey, ratePlanKey),
			Annual: digitalAnnual(productKey, ratePlanKey),
			AnnualTaxExclusive: digitalAnnual(productKey, ratePlanKey),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: printMonthlyDelivery(productKey, ratePlanKey),
			QuarterlyPlus: printMonthlyDelivery(productKey, ratePlanKey),
			AnnualPlus: printAnnualDelivery(productKey, ratePlanKey),
			ThreeMonthGift: printGift(productKey, ratePlanKey),
			OneYearGift: printGift(productKey, ratePlanKey),
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: printMonthlyDelivery(productKey, ratePlanKey),
			QuarterlyPlus: printMonthlyDelivery(productKey, ratePlanKey),
			AnnualPlus: printAnnualDelivery(productKey, ratePlanKey),
			ThreeMonthGift: printGift(productKey, ratePlanKey),
			OneYearGift: printGift(productKey, ratePlanKey),
		},
		SubscriptionCard: {
			EverydayPlus: printMonthlySubscription(productKey, ratePlanKey),
			SixdayPlus: printMonthlySubscription(productKey, ratePlanKey),
			WeekendPlus: printMonthlySubscription(productKey, ratePlanKey),
			SaturdayPlus: printMonthlySubscription(productKey, ratePlanKey),
			SundayPlus: printMonthlyDelivery(productKey, ratePlanKey),
			Sunday: printMonthlyDelivery(productKey, ratePlanKey),
		},
		HomeDelivery: {
			EverydayPlus: printMonthlyDelivery(productKey, ratePlanKey),
			SixdayPlus: printMonthlyDelivery(productKey, ratePlanKey),
			WeekendPlus: printMonthlyDelivery(productKey, ratePlanKey),
			SaturdayPlus: printMonthlyDelivery(productKey, ratePlanKey),
			SundayPlus: printMonthlyDelivery(productKey, ratePlanKey),
			Sunday: printMonthlyDelivery(productKey, ratePlanKey),
		},
	};
};

const promotionalCancellation = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	firstPayment: number,
): PolicyElement => {
	const promoDigitalMonthly = promotionDigitalMonthly(
		productKey,
		ratePlanKey,
		firstPayment,
	);
	const promoPrintAnnual = promotionPrintAnnual(
		productKey,
		ratePlanKey,
		firstPayment,
	);
	const promoObserverMonthly = promotionObserverMonthly(
		productKey,
		ratePlanKey,
	);
	return {
		GuardianAdLite: {
			Monthly: promoDigitalMonthly,
		},
		SupporterPlus: {
			Monthly: promoDigitalMonthly,
			MonthlyTaxExclusive: promoDigitalMonthly,
			Annual: digitalAnnual(productKey, ratePlanKey),
			AnnualTaxExclusive: digitalAnnual(productKey, ratePlanKey),
			OneYearStudent: studentAnnual(productKey, ratePlanKey),
		},
		DigitalSubscription: {
			Monthly: promotionDigitalMonthly(productKey, ratePlanKey, firstPayment),
			MonthlyTaxExclusive: promoDigitalMonthly,
			Annual: digitalAnnual(productKey, ratePlanKey),
			AnnualTaxExclusive: digitalAnnual(productKey, ratePlanKey),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: promoPrintAnnual,
			QuarterlyPlus: promoPrintAnnual,
			AnnualPlus: promoPrintAnnual,
			ThreeMonthGift: printGift(productKey, ratePlanKey),
			OneYearGift: printGift(productKey, ratePlanKey),
		},
		GuardianWeeklyRestOfWorld: {
			MonthlyPlus: promoPrintAnnual,
			QuarterlyPlus: promoPrintAnnual,
			AnnualPlus: promoPrintAnnual,
			ThreeMonthGift: printGift(productKey, ratePlanKey),
			OneYearGift: printGift(productKey, ratePlanKey),
		},
		SubscriptionCard: {
			EverydayPlus: promoPrintAnnual,
			SixdayPlus: promoPrintAnnual,
			WeekendPlus: promoPrintAnnual,
			SaturdayPlus: promoPrintAnnual,
			Sunday: promoObserverMonthly,
		},
		HomeDelivery: {
			EverydayPlus: promoPrintAnnual,
			SixdayPlus: promoPrintAnnual,
			WeekendPlus: promoPrintAnnual,
			SaturdayPlus: promoPrintAnnual,
			Sunday: promoObserverMonthly,
		},
	};
};

function getPromotionalCancellation(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promotion?: Promotion,
): PolicyElement {
	const firstPayment = promotion?.discountedPrice ?? 0;
	return promotionalCancellation(productKey, ratePlanKey, firstPayment);
}

function getCancellationPolicy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promotion?: Promotion,
): PolicyElement {
	return promotion
		? getPromotionalCancellation(productKey, ratePlanKey, promotion)
		: getCancellation(productKey, ratePlanKey);
}

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	promotion?: Promotion;
}
export function CancellationPolicy({
	productKey,
	ratePlanKey,
	promotion,
}: CancellationPolicyProps): JSX.Element | null {
	const isContribution = productKey === 'Contribution';
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	const display = !isContribution && !isWeeklyGift;
	return display
		? getCancellationPolicy(productKey, ratePlanKey, promotion)[productKey]?.[
				ratePlanKey
		  ] ?? null
		: null;
}
