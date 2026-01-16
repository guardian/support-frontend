import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { DeliveryAgentsResponse } from '../../../../pages/[countryGroupId]/checkout/helpers/getDeliveryAgents';
import { initialState } from './state';
import { getDeliveryAgentsThunk } from './thunks';

const addressMetaSlice = createSlice({
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
		clearDeliveryAgentResponse(state) {
			state.deliveryAgent.response = undefined;
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
				if (action.payload.agents?.length === 1) {
					state.deliveryAgent.chosenAgent = action.payload.agents[0]?.agentId;
				}
			},
		);
		builder.addCase(getDeliveryAgentsThunk.rejected, (state, action) => {
			state.deliveryAgent.isLoading = false;
			state.deliveryAgent.error = action.error.message;
		});
	},
});

export const addressMetaReducer = addressMetaSlice.reducer;
