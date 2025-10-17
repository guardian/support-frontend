import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { config } from 'helpers/contributions';
import { getStripeKeyForCountry } from 'helpers/forms/stripe';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import * as cookie from 'helpers/storage/cookie';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type { Participations } from '../../helpers/abTests/models';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import { getSupportRegionIdConfig } from '../supportRegionConfig';
import { OneTimeCheckoutComponent } from './components/oneTimeCheckoutComponent';

const countryId = Country.detect();

type OneTimeCheckoutProps = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	abParticipations: Participations;
	nudgeSettings?: CheckoutNudgeSettings;
	landingPageSettings: LandingPageVariant;
};

const stripeExpressCheckoutSwitch =
	window.guardian.settings.switches.oneOffPaymentMethods.stripeExpressCheckout;

export function OneTimeCheckout({
	supportRegionId,
	appConfig,
	abParticipations,
	nudgeSettings,
	landingPageSettings,
}: OneTimeCheckoutProps) {
	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const isTestUser = !!cookie.get('_test_username');

	const stripePublicKey = getStripeKeyForCountry(
		'ONE_OFF',
		countryId,
		currencyKey,
		isTestUser,
	);

	const stripePromise = loadStripe(stripePublicKey);

	const minAmount = config[countryGroupId]['ONE_OFF'].min;
	const elementsOptions = {
		mode: 'payment',
		/**
		 * Stripe amounts are in the "smallest currency unit"
		 * @see https://docs.stripe.com/api/charges/object
		 * @see https://docs.stripe.com/currencies#zero-decimal
		 */
		amount: minAmount * 100,
		currency: currencyKey.toLowerCase(),
		paymentMethodCreation: 'manual',
	} as const;

	return (
		<Elements stripe={stripePromise} options={elementsOptions}>
			<OneTimeCheckoutComponent
				supportRegionId={supportRegionId}
				appConfig={appConfig}
				stripePublicKey={stripePublicKey}
				countryId={countryId}
				abParticipations={abParticipations}
				useStripeExpressCheckout={stripeExpressCheckoutSwitch === 'On'}
				nudgeSettings={nudgeSettings}
				landingPageSettings={landingPageSettings}
			/>
		</Elements>
	);
}
