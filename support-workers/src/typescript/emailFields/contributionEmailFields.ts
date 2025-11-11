import type { IsoCurrency } from '@guardian/support-service-lambdas/modules/internationalisation/src/currency';
import type { EmailMessageWithIdentityUserId } from '@modules/email/email';
import dayjs from 'dayjs';
import type { User } from '../model/stateSchemas';
import { buildThankYouEmailFields } from './emailFields';

export function buildContributionThankYouEmailFields(
	user: User,
	amount: number,
	currency: IsoCurrency,
	ratePlan: 'Annual' | 'Monthly',
): EmailMessageWithIdentityUserId {
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
