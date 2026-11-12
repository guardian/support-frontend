import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from './promotions';

const contributionMonthlyCopy = (amount: number): string => {
	return `We will attempt to take payment of £${amount}, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.`;
};
const digitalMonthlyCopy = (amount: number): string => {
	return `Subscription auto-renews monthly. Pay £${amount}/month, unless you cancel. We’ll remind you every 6 months, 2 weeks before your renewal date.`;
};
const digitalAnnualCopy = (amount: number): string => {
	return `Subscription auto-renews annually. Pay £${amount}/year, unless you cancel. Equivalent to £XX/month. We’ll remind you every year, 2 weeks before your renewal date.`;
};
const contributionAnnualCopy = (amount: number): string =>
	digitalAnnualCopy(amount);
const printMonthlyCopy = (amount: number) => digitalMonthlyCopy(amount);
const printQuarterlyCopy = (amount: number) =>
	`Subscription auto-renews quarterly. Pay £${amount}/quarter, unless you cancel. Equivalent to £X/month for each quarter. We’ll remind you every 6 months, 2 weeks before your renewal date.`;
const printAnnualCopy = digitalAnnualCopy;
const observerCopy = (amount: number) => printMonthlyCopy(amount);

type Policy = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function renewalTermsPolicyCopyWithFirstPayment(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
) {
	const renewalTermsCopy = (amount: number): Policy => {
		return {
			Contribution: {
				Monthly: contributionMonthlyCopy(amount),
				Annual: contributionAnnualCopy(amount),
			},
			GuardianAdLite: {
				Monthly: digitalMonthlyCopy(amount),
			},
			SupporterPlus: {
				Monthly: digitalMonthlyCopy(amount),
				MonthlyTaxExclusive: digitalMonthlyCopy(amount),
				Annual: digitalAnnualCopy(amount),
				AnnualTaxExclusive: digitalAnnualCopy(amount),
			},
			DigitalSubscription: {
				Monthly: digitalMonthlyCopy(amount),
				MonthlyTaxExclusive: digitalMonthlyCopy(amount),
				Annual: digitalAnnualCopy(amount),
				AnnualTaxExclusive: digitalAnnualCopy(amount),
			},
			GuardianWeeklyDomestic: {
				MonthlyPlus: printMonthlyCopy(amount),
				QuarterlyPlus: printQuarterlyCopy(amount),
				AnnualPlus: printAnnualCopy(amount),
			},
			GuardianWeeklyRestOfWorld: {
				MonthlyPlus: printMonthlyCopy(amount),
				QuarterlyPlus: printQuarterlyCopy(amount),
				AnnualPlus: printAnnualCopy(amount),
			},
			SubscriptionCard: {
				EverydayPlus: printMonthlyCopy(amount),
				SixdayPlus: printMonthlyCopy(amount),
				WeekendPlus: printMonthlyCopy(amount),
				SaturdayPlus: printMonthlyCopy(amount),
				Sunday: observerCopy(amount),
			},
			HomeDelivery: {
				EverydayPlus: printMonthlyCopy(amount),
				SixdayPlus: printMonthlyCopy(amount),
				WeekendPlus: printMonthlyCopy(amount),
				SaturdayPlus: printMonthlyCopy(amount),
				Sunday: observerCopy(amount),
			},
		};
	};
	return renewalTermsCopy(amount)[productKey]?.[ratePlanKey];
}

export function getRenewalTermsPolicyCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	amount: number,
	promotion?: Promotion,
) {
	console.log('*** promo:', promotion);
	return (
		renewalTermsPolicyCopyWithFirstPayment(productKey, ratePlanKey, amount) ??
		''
	);
}
