import { configureStore } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { initReducer } from 'pages/contributions-landing/contributionsLandingReducer';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import { getInitialState } from './utils/setup';

export const contributionsStore = configureStore({
	reducer: {
		common: commonReducer,
		page: initReducer(),
	},
});

export type ContributionsState = ReturnType<typeof contributionsStore.getState>;

export type ContributionsDispatch = typeof contributionsStore.dispatch;

export function initReduxForContributions(): typeof contributionsStore {
	try {
		const initialState = getInitialState();
		contributionsStore.dispatch(setInitialCommonState(initialState));

		return contributionsStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}
