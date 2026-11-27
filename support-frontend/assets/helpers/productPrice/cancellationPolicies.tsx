import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
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
import { textLink } from 'helpers/utilities/textLink';

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
		case 'OneTimeContribution':
			return textLink(copy, guardianHelpCentreLink); // default to help centre for oneTime
	}
};

const digitalMonthlyAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<>
		Cooling-off rights: you can cancel with immediate effect within 14 days of
		sign-up: see more detail {getTerms('here', productKey, ratePlanKey)}.
	</>
);
const studentAnnual = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<>
		This subscription does not auto-renew. If you cancel within 14 days of
		sign-up, you will receive a full refund and your subscription will stop
		immediately. To cancel, go to{' '}
		{textLink('Manage My Account', manageAccountLink)} or see our{' '}
		{getTerms('Terms', productKey, ratePlanKey)}.
	</>
);
const weekly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<>
		Cooling-off rights: you can cancel with immediate effect anytime from
		sign-up until 14 days after you receive your first magazine: see more detail{' '}
		{getTerms('here', productKey, ratePlanKey)}.
	</>
);
const paperMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => (
	<>
		Cooling-off rights: you can cancel with immediate effect anytime from
		sign-up until 14 days after you receive or are entitled to collect your
		first newspaper: see more detail {getTerms('here', productKey, ratePlanKey)}
		.
	</>
);
const weeklyGift = (): JSX.Element => (
	<>
		This subscription does not auto-renew. If you cancel within 14 days of
		sign-up, you'll receive a full refund and your subscription will stop
		immediately. To cancel, contact{' '}
		{textLink('Customer Service', guardianHelpCentreLink)}.
	</>
);

const promotionWeekly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => {
	return (
		<>
			Cooling-off rights: you can cancel with immediate effect anytime from
			sign-up until 14 days after you receive your first magazine. You can also
			cancel with immediate effect within 14 days of your first higher payment:
			see more detail {getTerms('here', productKey, ratePlanKey)}.
		</>
	);
};

const promotionPaper = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => {
	return (
		<>
			Cooling-off rights: you can cancel with immediate effect anytime from
			sign-up until 14 days after you receive or are entitled to collect your
			first newspaper. You can also cancel with immediate effect within 14 days
			of your first higher payment: see more detail{' '}
			{getTerms('here', productKey, ratePlanKey)}.
		</>
	);
};
const promotionObserverMonthly = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): JSX.Element => {
	return (
		<>
			Cancel anytime, via {textLink('your account', manageAccountLink)}. Cancel
			within 14 days of receiving your{' '}
			{productKey === 'SubscriptionCard' ? 'subscription card' : 'first issue'}{' '}
			and receive a full refund. See more about your cooling-off rights in your
			full pre-contract information {getTerms('here', productKey, ratePlanKey)}.
		</>
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
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
		},
		SupporterPlus: {
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
			Annual: digitalMonthlyAnnual(productKey, ratePlanKey),
			OneYearStudent: studentAnnual(productKey, ratePlanKey),
		},
		DigitalSubscription: {
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
			Annual: digitalMonthlyAnnual(productKey, ratePlanKey),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: weekly(productKey, ratePlanKey),
			QuarterlyPlus: weekly(productKey, ratePlanKey),
			AnnualPlus: weekly(productKey, ratePlanKey),
			ThreeMonthGift: weeklyGift(),
			OneYearGift: weeklyGift(),
		},
		SubscriptionCard: {
			EverydayPlus: paperMonthly(productKey, ratePlanKey),
			SixdayPlus: paperMonthly(productKey, ratePlanKey),
			WeekendPlus: paperMonthly(productKey, ratePlanKey),
			SaturdayPlus: paperMonthly(productKey, ratePlanKey),
			SundayPlus: promotionObserverMonthly(productKey, ratePlanKey),
			Sunday: promotionObserverMonthly(productKey, ratePlanKey),
		},
		HomeDelivery: {
			EverydayPlus: paperMonthly(productKey, ratePlanKey),
			SixdayPlus: paperMonthly(productKey, ratePlanKey),
			WeekendPlus: paperMonthly(productKey, ratePlanKey),
			SaturdayPlus: paperMonthly(productKey, ratePlanKey),
			SundayPlus: promotionObserverMonthly(productKey, ratePlanKey),
			Sunday: promotionObserverMonthly(productKey, ratePlanKey),
		},
	};
};

const promotionalCancellation = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): PolicyElement => {
	return {
		GuardianAdLite: {
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
		},
		SupporterPlus: {
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
			Annual: digitalMonthlyAnnual(productKey, ratePlanKey),
			OneYearStudent: studentAnnual(productKey, ratePlanKey),
		},
		DigitalSubscription: {
			Monthly: digitalMonthlyAnnual(productKey, ratePlanKey),
			Annual: digitalMonthlyAnnual(productKey, ratePlanKey),
		},
		GuardianWeeklyDomestic: {
			MonthlyPlus: promotionWeekly(productKey, ratePlanKey),
			QuarterlyPlus: promotionWeekly(productKey, ratePlanKey),
			AnnualPlus: promotionWeekly(productKey, ratePlanKey),
			ThreeMonthGift: weeklyGift(),
			OneYearGift: weeklyGift(),
		},
		SubscriptionCard: {
			EverydayPlus: promotionPaper(productKey, ratePlanKey),
			SixdayPlus: promotionPaper(productKey, ratePlanKey),
			WeekendPlus: promotionPaper(productKey, ratePlanKey),
			SaturdayPlus: promotionPaper(productKey, ratePlanKey),
			Sunday: promotionObserverMonthly(productKey, ratePlanKey),
		},
		HomeDelivery: {
			EverydayPlus: promotionPaper(productKey, ratePlanKey),
			SixdayPlus: promotionPaper(productKey, ratePlanKey),
			WeekendPlus: promotionPaper(productKey, ratePlanKey),
			SaturdayPlus: promotionPaper(productKey, ratePlanKey),
			Sunday: promotionObserverMonthly(productKey, ratePlanKey),
		},
	};
};

function getPromotionalCancellation(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): PolicyElement {
	return promotionalCancellation(productKey, ratePlanKey);
}

export function getCancellationPolicy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	promotion?: PromoWithCatalogInformation,
): JSX.Element | undefined {
	const isValidPromotion = promotion?.discount?.amount !== undefined;
	const cancellationPolicy = isValidPromotion
		? getPromotionalCancellation(productKey, ratePlanKey)
		: getCancellation(productKey, ratePlanKey);
	return cancellationPolicy[productKey]?.[ratePlanKey];
}
