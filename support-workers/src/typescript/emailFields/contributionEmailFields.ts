import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { User } from '../model/stateSchemas';
import {
	buildThankYouEmailFields,
	getPaymentMethodFieldsSupporterPlus,
} from './emailFields';

export function buildContributionEmailFields({
	now,
	user,
	amount,
	currency,
	paymentMethod,
	mandateId,
	ratePlan,
}: {
	now: dayjs.Dayjs;
	user: User;
	amount: number;
	currency: IsoCurrency;
	paymentMethod: PaymentMethod;
	mandateId?: string;
	ratePlan: 'Annual' | 'Monthly';
}): EmailMessageWithIdentityUserId {
	const paymentMethodFields = getPaymentMethodFieldsSupporterPlus(
		paymentMethod,
		now,
		mandateId,
	);
	const productFields = {
		created: now.toISOString(),
		amount: amount.toString(),
		currency: currency,
		edition: user.billingAddress.country,
		name: user.firstName,
		first_name: user.firstName,
		product: `${ratePlan.toLowerCase()}-contribution`,
		...paymentMethodFields,
	};
	return buildThankYouEmailFields(
		user,
		'regular-contribution-thank-you',
		productFields,
	);
}
