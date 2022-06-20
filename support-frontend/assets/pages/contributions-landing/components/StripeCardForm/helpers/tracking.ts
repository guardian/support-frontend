import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackComponentLoad } from 'helpers/tracking/behaviour';

export function trackRecaptchaClientTokenReceived(): void {
	trackComponentLoad('contributions-recaptcha-client-token-received');
}

export function trackRecaptchaVerified(): void {
	trackComponentLoad('contributions-recaptcha-verified');
}

export function trackStripe3ds(): void {
	trackComponentLoad('stripe-3ds');
}

export function trackRecaptchaVerificationWarning(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): void {
	trackComponentLoad(
		`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`,
	);
}
