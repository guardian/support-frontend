import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './state';

export const addressMetaSlice = createSlice({
	name: 'addressMeta',
	initialState,
	reducers: {
		setBillingAddressMatchesDelivery(state, action: PayloadAction<boolean>) {
			state.billingAddressMatchesDelivery = action.payload;
		},
		setDeliveryInstructions(state, action: PayloadAction<string>) {
			state.deliveryInstructions = action.payload;
		},
		setDeliveryAgent(state, action: PayloadAction<number>) {
			state.deliveryAgent.chosenAgent = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getDeliveryAgentsThunk.pending, (state) => {
			state.deliveryAgent.isLoading = true;
			state.deliveryAgent.error = undefined;
		});
		builder.addCase(getDeliveryAgentsThunk.fulfilled, (state, action) => {
			state.deliveryAgent.isLoading = false;
			state.deliveryAgent.response = action.payload;
		});
		builder.addCase(getDeliveryAgentsThunk.rejected, (state, action) => {
			state.deliveryAgent.isLoading = false;
			state.deliveryAgent.error = action.error.message;
		});
	},
});

export const getDeliveryAgentsThunk = createAsyncThunk(
	`addressMeta/getDeliveryAgents`,
	getDeliveryAgents,
);

async function getDeliveryAgents(postcode: string) {
	const agentsResponse = await fetch(`/delivery-agents/${postcode}`);
	return agentsResponse.json();
}

export const addressMetaReducer = addressMetaSlice.reducer;
