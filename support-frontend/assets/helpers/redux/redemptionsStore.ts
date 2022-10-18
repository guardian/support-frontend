import { configureStore } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { redemptionPageReducer } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import { debugReducer } from './debug/reducer';
import { getInitialState } from './utils/setup';

const baseReducer = {
	common: commonReducer,
	page: redemptionPageReducer,
	debug: debugReducer,
};

export const redemptionStore = configureStore({
	reducer: baseReducer,
});

export type RedemptionStore = typeof redemptionStore;

export function initReduxForRedemption(): RedemptionStore {
	try {
		const initialState = getInitialState();
		redemptionStore.dispatch(setInitialCommonState(initialState));

		return redemptionStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type RedemptionPageState = ReturnType<typeof redemptionStore.getState>;

export type RedemptionDispatch = typeof redemptionStore.dispatch;
