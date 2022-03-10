import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { commonReducer } from './commonState/reducer';

export const store = configureStore({
	reducer: combineReducers({
		common: commonReducer,
		// page: pageReducer?.(initialState) ?? ({} as Reducer<PageState, PageAction>),
	}),
});

export type PageState = ReturnType<typeof store.getState>;

export type PageDispatch = typeof store.dispatch;
