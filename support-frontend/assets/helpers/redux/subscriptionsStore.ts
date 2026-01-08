import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { commonReducer } from './commonState/reducer';
import { debugReducer } from './debug/reducer';

const subscriptionsPageReducer = createReducer();

const baseReducer = {
	common: commonReducer,
	page: subscriptionsPageReducer,
	debug: debugReducer,
};

// Listener middleware allows us to specify side-effects for certain actions
// https://redux-toolkit.js.org/api/createListenerMiddleware
const listenerMiddleware = createListenerMiddleware();

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this will be removed soon, but I'm doing this incrementally
const subscriptionsStore = configureStore({
	reducer: baseReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type SubscriptionsStore = typeof subscriptionsStore;

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;
