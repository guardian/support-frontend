import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DeliveryAgentsResponse } from './state';

export const getDeliveryAgentsThunk = createAsyncThunk<
	DeliveryAgentsResponse,
	string
>(`addressMeta/getDeliveryAgents`, getDeliveryAgents);

async function getDeliveryAgents(
	postcode: string,
): Promise<DeliveryAgentsResponse> {
	const agentsResponse = await fetch(`/delivery-agents/${postcode}`);
	const response = (await agentsResponse.json()) as DeliveryAgentsResponse;
	return response;
}
