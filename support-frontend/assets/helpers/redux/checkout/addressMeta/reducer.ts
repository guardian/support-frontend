import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { DeliveryAgentsResponse } from './state';
import { initialState } from './state';
import { getDeliveryAgentsThunk } from './thunks';

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
		setDeliveryAgent(state, action: PayloadAction<number | undefined>) {
			state.deliveryAgent.chosenAgent = action.payload;
		},
		setDeliveryAgentResponse(
			state,
			action: PayloadAction<DeliveryAgentsResponse | undefined>,
		) {
			state.deliveryAgent.response = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getDeliveryAgentsThunk.pending, (state) => {
			state.deliveryAgent.isLoading = true;
			state.deliveryAgent.error = undefined;
		});
		builder.addCase(
			getDeliveryAgentsThunk.fulfilled,
			(state, action: PayloadAction<DeliveryAgentsResponse>) => {
				state.deliveryAgent.isLoading = false;
				state.deliveryAgent.response = action.payload;
			},
		);
		builder.addCase(getDeliveryAgentsThunk.rejected, (state, action) => {
			state.deliveryAgent.isLoading = false;
			state.deliveryAgent.error = action.error.message;
		});
	},
});

export const addressMetaReducer = addressMetaSlice.reducer;
