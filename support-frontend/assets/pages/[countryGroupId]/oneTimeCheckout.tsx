import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { config } from 'helpers/contributions';
import { getStripeKey } from 'helpers/forms/stripe';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import * as cookie from 'helpers/storage/cookie';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import type { Participations } from '../../helpers/abTests/models';
import { OneTimeCheckoutComponent } from './components/oneTimeCheckoutComponent';

const countryId = Country.detect();

type OneTimeCheckoutProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	abParticipations: Participations;
};

export function OneTimeCheckout({
	geoId,
	appConfig,
	abParticipations,
}: OneTimeCheckoutProps) {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const isTestUser = !!cookie.get('_test_username');

	const stripePublicKey = getStripeKey(
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
				geoId={geoId}
				appConfig={appConfig}
				stripePublicKey={stripePublicKey}
				countryId={countryId}
				abParticipations={abParticipations}
			/>
		</Elements>
	);
}
