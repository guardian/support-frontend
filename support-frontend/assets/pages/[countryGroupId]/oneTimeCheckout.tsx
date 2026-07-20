import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { config } from 'helpers/contributions';
import { getStripeKeyForCountry } from 'helpers/forms/stripe';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import * as cookie from 'helpers/storage/cookie';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type { Participations } from '../../helpers/abTests/models';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import type { OneTimeCheckoutVariant } from '../../helpers/globalsAndSwitches/oneTimeCheckoutSettings';
import { getSupportRegionIdConfig } from '../supportRegionConfig';
import { OneTimeCheckoutComponent } from './components/oneTimeCheckoutComponent';

const countryId = Country.detect();

type OneTimeCheckoutProps = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	abParticipations: Participations;
	nudgeSettings?: CheckoutNudgeSettings;
	landingPageSettings: LandingPageVariant;
	oneTimeCheckoutSettings: OneTimeCheckoutVariant;
};

const stripeExpressCheckoutSwitch =
	window.guardian.settings.switches.oneOffPaymentMethods.stripeExpressCheckout;

export function OneTimeCheckout({
	supportRegionId,
	appConfig,
	abParticipations,
	nudgeSettings,
	landingPageSettings,
	oneTimeCheckoutSettings,
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
	const elementsOptions: StripeElementsOptions = {
		mode: 'payment',
		/**
		 * Stripe amounts are in the "smallest currency unit"
		 * @see https://docs.stripe.com/api/charges/object
		 * @see https://docs.stripe.com/currencies#zero-decimal
		 */
		amount: minAmount * 100,
		currency: currencyKey.toLowerCase(),
		paymentMethodCreation: 'manual',

		appearance: {
			theme: 'stripe',
			variables: {
				fontFamily: 'GuardianTextSans',
				accordionItemSpacing: '8px',
				iconCardCvcColor: '#707070',
				iconCardErrorColor: '#C70000',
				colorDanger: '#C70000',
			},
			rules: {
				'.AccordionItem': {
					fontSize: '17px',
					fontWeight: '700',
					border: '1px solid #707070',
					padding: '16px',
					color: '#707070',
				},
				'.AccordionItem:hover': {
					color: '#121212',
				},
				'.AccordionIcon': {
					height: '13.5px',
					width: '18px',
					fill: '#707070',
				},
				'.AccordionItem--selected': {
					border: '1px solid #0077B6',
					boxShadow: 'inset 0 0 0 1px #0077B6',
					color: '#052962',
				},
				'.RadioIcon': {
					width: '28px',
					height: '28px',
				},
				'.RadioIconOuter': {
					stroke: '#707070',
					strokeWidth: '4',
				},
				'.RadioIconOuter--hovered': {
					stroke: '#0077B6',
				},
				'.RadioIconOuter--checked': {
					stroke: '#0077B6',
					strokeWidth: '7',
				},

				'.RadioIconInner--checked': {
					fill: '#0077B6',
				},
				'.Label': {
					fontSize: '15px',
					fontWeight: '600',
					color: '#121212',
				},
				'.Input': {
					fontSize: '17px',
					color: '#707070',
					border: '1px solid #707070',
					borderRadius: '4px',
				},
				'.Input:focus': {
					fontSize: '17px',
					color: '#121212',
					border: '1px solid #0077B6',
					outline: '2px solid #0077B6',
					outlineOffset: '-2px',
					borderRadius: '4px',
					boxShadow: 'none',
				},
				'.Input--invalid': {
					color: '#C70000',
					border: '1px solid #C70000',
					outline: '2px solid #C70000',
					outlineOffset: '-2px',
					boxShadow: 'none',
				},
				'.Input--empty': {
					color: '#707070',
				},
				'.Error': {
					fontSize: '15px',
					color: '#C70000',
					lineHeight: '19.5px',
				},
			},
		},
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
				oneTimeCheckoutSettings={oneTimeCheckoutSettings}
			/>
		</Elements>
	);
}
