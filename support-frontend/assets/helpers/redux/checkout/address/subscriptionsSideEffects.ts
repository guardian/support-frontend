import { isAnyOf } from '@reduxjs/toolkit';
import { fromString } from 'helpers/internationalisation/country';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
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
			const { productType } = listener.getState().page.checkoutForm.product;
			const isSettingDeliveryAddress = setDeliveryCountry.match(action);

			// The billing address is only relevant to the displayed price for the digital subscription
			const countryShouldBeUpdated =
				isSettingDeliveryAddress || productType === 'DigitalPack';

			if (country && countryShouldBeUpdated) {
				listener.dispatch(setCountryInternationalisation(country));
			}
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
