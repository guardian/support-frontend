import type { TypedStartListening } from '@reduxjs/toolkit';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { initReducer } from 'pages/contributions-landing/contributionsLandingReducer';
import { addAddressSideEffects } from './checkout/address/contributionsSideEffects';
import { addPaymentsSideEffects } from './checkout/payment/contributionsSideEffects';
import { addPersonalDetailsSideEffects } from './checkout/personalDetails/contributionsSideEffects';
import { setCurrency } from './checkout/product/actions';
import { addProductSideEffects } from './checkout/product/contributionsSideEffects';
import { addRecaptchaSideEffects } from './checkout/recaptcha/contributionsSideEffects';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import { debugReducer } from './debug/reducer';
import { getInitialState } from './utils/setup';

// Listener middleware allows us to specify side-effects for certain actions
// https://redux-toolkit.js.org/api/createListenerMiddleware
const listenerMiddleware = createListenerMiddleware();

export type ContributionsStartListening = TypedStartListening<
	ContributionsState,
	ContributionsDispatch
>;

export const startContributionsListening =
	listenerMiddleware.startListening as ContributionsStartListening;

export const contributionsStore = configureStore({
	reducer: {
		common: commonReducer,
		page: initReducer(),
		debug: debugReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type ContributionsState = ReturnType<typeof contributionsStore.getState>;

export type ContributionsDispatch = typeof contributionsStore.dispatch;

export type ContributionsStore = typeof contributionsStore;

export function initReduxForContributions(
	// Injecting the store and listener makes it possible to re-use this function for tests
	store = contributionsStore,
	startListening = startContributionsListening,
): ContributionsStore {
	try {
		addPersonalDetailsSideEffects(startListening);
		addProductSideEffects(startListening);
		addPaymentsSideEffects(startListening);
		addRecaptchaSideEffects(startListening);
		addAddressSideEffects(startListening);
		const initialState = getInitialState();
		store.dispatch(setInitialCommonState(initialState));
		store.dispatch(setCurrency(initialState.internationalisation.currencyId));
		return store;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}
