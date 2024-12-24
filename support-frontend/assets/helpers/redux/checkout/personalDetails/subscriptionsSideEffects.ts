import { isAnyOf } from '@reduxjs/toolkit';
import {
	setEmail as setEmailGift,
	setFirstName as setFirstNameGift,
	setGiftDeliveryDate,
	setLastName as setLastNameGift,
} from 'helpers/redux/checkout/giftingState/actions';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
} from './actions';

const shouldCheckFormEnabled = isAnyOf(
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setFirstNameGift,
	setLastNameGift,
	setEmailGift,
	setGiftDeliveryDate,
);

export function addPersonalDetailsSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(_, listenerApi) {
			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
