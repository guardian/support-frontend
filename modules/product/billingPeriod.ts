export enum BillingPeriod {
	Annual = 'Annual',
	Monthly = 'Monthly',
	Quarterly = 'Quarterly',
	OneTime = 'OneTime',
}

export type RecurringBillingPeriod =
	| BillingPeriod.Annual
	| BillingPeriod.Monthly
	| BillingPeriod.Quarterly;
