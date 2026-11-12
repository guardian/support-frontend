import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const contributionMonthlyCopy =
	'We will attempt to take payment of £4, on the 3rd day of every month, from now until you cancel your payment. Payments may take up to 6 days to be recorded in your bank account. You can change how much you give or cancel your payment at any time.';
const digitalMonthlyCopy =
	'Subscription auto-renews monthly. Pay £XX/month, unless you cancel. We’ll remind you every 6 months, 2 weeks before your renewal date.';
const digitalAnnualCopy =
	'Subscription auto-renews annually. Pay £XXX/year, unless you cancel. Equivalent to £XX/month. We’ll remind you every year, 2 weeks before your renewal date.';

const printMonthlyCopy = digitalMonthlyCopy;
const printQuarterlyCopy =
	'Subscription auto-renews quarterly. Pay £X/quarter, unless you cancel. Equivalent to £X/month for each quarter. We’ll remind you every 6 months, 2 weeks before your renewal date.';
const printAnnualCopy = digitalAnnualCopy;
const observerCopy = printMonthlyCopy;

const renewalTermsPolicyCopy: Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
> = {
	GuardianAdLite: {
		Monthly: digitalMonthlyCopy,
	},
	Contribution: {
		Monthly: contributionMonthlyCopy,
	},
	SupporterPlus: {
		Monthly: digitalMonthlyCopy,
		MonthlyTaxExclusive: digitalMonthlyCopy,
		Annual: digitalAnnualCopy,
		AnnualTaxExclusive: digitalAnnualCopy,
	},
	DigitalSubscription: {
		Monthly: digitalMonthlyCopy,
		MonthlyTaxExclusive: digitalMonthlyCopy,
		Annual: digitalAnnualCopy,
		AnnualTaxExclusive: digitalAnnualCopy,
	},
	GuardianWeeklyDomestic: {
		MonthlyPlus: printMonthlyCopy,
		QuarterlyPlus: printQuarterlyCopy,
		AnnualPlus: printAnnualCopy,
	},
	GuardianWeeklyRestOfWorld: {
		MonthlyPlus: printMonthlyCopy,
		QuarterlyPlus: printQuarterlyCopy,
		AnnualPlus: printAnnualCopy,
	},
	SubscriptionCard: {
		EverydayPlus: printMonthlyCopy,
		SixdayPlus: printMonthlyCopy,
		WeekendPlus: printMonthlyCopy,
		SaturdayPlus: printMonthlyCopy,
		Sunday: observerCopy,
	},
	HomeDelivery: {
		EverydayPlus: printMonthlyCopy,
		SixdayPlus: printMonthlyCopy,
		WeekendPlus: printMonthlyCopy,
		SaturdayPlus: printMonthlyCopy,
		Sunday: observerCopy,
	},
};

export function getRenewalTermsPolicyCopy(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
) {
	return renewalTermsPolicyCopy[productKey]?.[ratePlanKey] ?? '';
}
