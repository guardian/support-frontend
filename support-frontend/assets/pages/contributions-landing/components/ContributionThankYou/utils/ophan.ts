import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { trackComponentEvents } from 'helpers/tracking/ophan';

export const OPHAN_COMPONENT_ID_SIGN_IN = 'sign-into-the-guardian-link';
export const OPHAN_COMPONENT_ID_SIGN_UP = 'set-password';
export const OPHAN_COMPONENT_ID_SET_REMINDER = 'reminder-test-link-clicked';
export const OPHAN_COMPONENT_ID_MARKETING = 'marketing-permissions';
export const OPHAN_COMPONENT_ID_SURVEY = 'contribution-thankyou-survey';
export const OPHAN_COMPONENT_ID_SOCIAL = 'contribution-thankyou-social';
export const OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK =
	'contribution-thankyou-social-facebook';
export const OPHAN_COMPONENT_ID_SOCIAL_TWITTER =
	'contribution-thankyou-social-twitter';
export const OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN =
	'contribution-thankyou-social-linked-in';
export const OPHAN_COMPONENT_ID_SOCIAL_EMAIL =
	'contribution-thankyou-social-email';
export const OPHAN_COMPONENT_ID_AUS_MAP = 'contribution-thankyou-aus-map';
export const OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN =
	'contribution-thankyou-return-to-guardian';
export const OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN =
	'contribution-thankyou-read-more-sign-in';
export const OPHAN_COMPONENT_ID_READ_MORE_SIGN_UP =
	'contribution-thankyou-read-more-sign-up';
const OPHAN_EVENT_ID_PAYMENT_METHOD = 'contributions-thankyou-payment-method';
const OPHAN_EVENT_ID_CONTRIBUTION_TYPE =
	'contributions-thankyou-contribution-type';
const OPHAN_EVENT_ID_SIGNED_IN = 'contributions-thankyou-signed-in';
const OPHAN_EVENT_ID_KNOWN_EMAIL = 'contributions-thankyou-known-email';
const OPHAN_EVENT_ID_LARGE_DONATION = 'contributions-thankyou-large-donation';

const trackPaymentMethod = (paymentMethod: PaymentMethod) => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
		},
		action: 'VIEW',
		id: OPHAN_EVENT_ID_PAYMENT_METHOD,
		value: paymentMethod,
	});
};

const trackContributionType = (contributionType: ContributionType) => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
		},
		action: 'VIEW',
		id: OPHAN_EVENT_ID_CONTRIBUTION_TYPE,
		value: contributionType,
	});
};

const trackSignedIn = (isSignedIn: boolean) => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
		},
		action: 'VIEW',
		id: OPHAN_EVENT_ID_SIGNED_IN,
		value: isSignedIn.toString(),
	});
};

const trackKnownEmail = (isKnownEmail: boolean) => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
		},
		action: 'VIEW',
		id: OPHAN_EVENT_ID_KNOWN_EMAIL,
		value: isKnownEmail.toString(),
	});
};

const trackLargeDonation = (isLargeUsDonation: boolean) => {
	trackComponentEvents({
		component: {
			componentType: 'ACQUISITIONS_OTHER',
		},
		action: 'VIEW',
		id: OPHAN_EVENT_ID_LARGE_DONATION,
		value: isLargeUsDonation.toString(),
	});
};

export const trackUserData = (
	paymentMethod: PaymentMethod,
	contributionType: ContributionType,
	isSignedIn: boolean,
	isKnownEmail: boolean,
	isLargeDonation: boolean,
): void => {
	trackPaymentMethod(paymentMethod);
	trackContributionType(contributionType);
	trackSignedIn(isSignedIn);
	trackKnownEmail(isKnownEmail);
	trackLargeDonation(isLargeDonation);
};
