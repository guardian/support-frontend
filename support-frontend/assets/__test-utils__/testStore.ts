import '__mocks__/settingsMock';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type {
	ContributionsStartListening,
	ContributionsState,
	ContributionsStore,
} from 'helpers/redux/contributionsStore';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { debugReducer } from 'helpers/redux/debug/reducer';
import { initReducer } from 'pages/supporter-plus-landing/setup/legacyReducer';

export function createTestStoreForContributions(
	initialState?: ContributionsState,
): ContributionsStore {
	const baseReducer = {
		common: commonReducer,
		page: initReducer(),
		debug: debugReducer,
	};

	const listenerMiddleware = createListenerMiddleware();

	const testStartListening =
		listenerMiddleware.startListening as ContributionsStartListening;

	const testContributionsStore = configureStore({
		reducer: baseReducer,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				// Disabling middleware to improve test performance
				immutableCheck: false,
				serializableCheck: false,
			}).prepend(listenerMiddleware.middleware),
	});

	return initReduxForContributions(testContributionsStore, testStartListening);
}
