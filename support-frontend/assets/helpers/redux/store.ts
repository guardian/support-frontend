import type { Reducer } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { commonReducer } from './commonState/reducer';

const baseReducer = {
	common: commonReducer,
	page: {} as Reducer,
};

export const store = configureStore({
	reducer: baseReducer,
});

export function addPageReducer(newReducer: Reducer | undefined): void {
	if (!newReducer) return;
	store.replaceReducer(
		combineReducers({
			...baseReducer,
			page: newReducer,
		}),
	);
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type PageState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type PageDispatch = typeof store.dispatch;
