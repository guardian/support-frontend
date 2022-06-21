import { isAnyOf } from '@reduxjs/toolkit';
import { fromString } from 'helpers/internationalisation/country';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import { onDeliveryCountryChanged } from 'helpers/subscriptionsForms/formActions';
import {
	setBillingAddressLineOne,
	setBillingCountry,
	setBillingPostcode,
	setBillingState,
	setBillingTownCity,
	setDeliveryAddressLineOne,
	setDeliveryCountry,
	setDeliveryPostcode,
	setDeliveryState,
	setDeliveryTownCity,
} from './actions';

// ---- Side effects ---- //

export function addAddressSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_action, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});

	startListening({
		matcher: shouldUpdateInternationalisation,
		effect(action, listener) {
			const country = fromString(action.payload);

			if (country) {
				listener.dispatch(setCountryInternationalisation(country));
			}
		},
	});

	startListening({
		actionCreator: setDeliveryCountry,
		effect(action, listener) {
			listener.dispatch(onDeliveryCountryChanged(action.payload));
		},
	});
}

// ---- Matchers ---- //

const shouldCheckFormEnabled = isAnyOf(
	setBillingAddressLineOne,
	setBillingPostcode,
	setBillingState,
	setBillingTownCity,
	setDeliveryAddressLineOne,
	setDeliveryPostcode,
	setDeliveryState,
	setDeliveryTownCity,
);

const shouldUpdateInternationalisation = isAnyOf(
	setBillingCountry,
	setDeliveryCountry,
);
