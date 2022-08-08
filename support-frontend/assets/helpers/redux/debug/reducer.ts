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
			state.actionHistory += ` ${JSON.stringify(action)}\n`;
		});
	},
});

export const debugReducer = debugSlice.reducer;
