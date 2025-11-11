import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import dayjs from 'dayjs';
import type { User } from './stateSchemas';

export type ThankYouEmailFields = {
	To: {
		Address: string;
		ContactAttributes: Record<string, string>;
	};
	DataExtensionName: string;
	IdentityUserId: string;
	SfContactId?: string; // TODO: I don't think this is needed
};

function buildThankYouEmailFields(
	user: User,
	dataExtensionName: string,
	productSpecificFields: Record<string, string>,
	sfContactId?: string,
) {
	return {
		To: {
			Address: user.primaryEmailAddress,
			ContactAttributes: {
				...productSpecificFields,
			},
		},
		DataExtensionName: dataExtensionName,
		IdentityUserId: user.id,
		...(sfContactId ? { SfContactId: sfContactId } : undefined),
	};
}

export function buildContributionThankYouEmailFields(
	user: User,
	amount: number,
	currency: IsoCurrency,
	ratePlan: 'Annual' | 'Monthly',
): ThankYouEmailFields {
	const productFields = {
		EmailAddress: user.primaryEmailAddress,
		created: dayjs().toISOString(), // TODO: check formatting
		amount: amount.toString(),
		currency: currency,
		edition: user.billingAddress.country,
		name: user.firstName,
		product: `${ratePlan.toLowerCase()}-contribution`,
	};
	return buildThankYouEmailFields(
		user,
		'regular-contribution-thank-you',
		productFields,
	);
}

export function buildSupporterPlusThankYouEmailFields(
	user: User,
	currency: IsoCurrency,
	billingPeriod: BillingPeriod,
	subscriptionNumber: string,
) {
	const productFields = {
		email_address: user.primaryEmailAddress,
		created: dayjs().toISOString(),
		currency: currency,
		first_name: user.firstName,
		last_name: user.lastName,
		billing_period: billingPeriod.toLowerCase(),
		product: `${billingPeriod.toLowerCase()}-supporter-plus`,
		zuorasubscriberid: subscriptionNumber,
		subscription_details: 'subscription_details',
		is_fixed_term: 'isFixedTerm.toString',
	};
	return buildThankYouEmailFields(user, 'supporter-plus', productFields);
}
