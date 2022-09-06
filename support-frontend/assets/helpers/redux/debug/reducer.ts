import { createSlice } from '@reduxjs/toolkit';

const isAnyAction = () => true;

export const debugSlice = createSlice({
	name: 'debug',
	initialState: {
		actionHistory: '',
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(isAnyAction, (state, action) => {
			try {
				const { type, payload } = action as { type: string; payload: unknown };
				state.actionHistory += ` ${JSON.stringify({ type, payload })}\n`;
			} catch (error) {
				return;
			}
		});
	},
});

export const debugReducer = debugSlice.reducer;
