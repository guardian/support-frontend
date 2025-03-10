import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DeliveryAgentsResponse } from '../../../../pages/[countryGroupId]/checkout/helpers/getDeliveryAgents';
import { getDeliveryAgents } from '../../../../pages/[countryGroupId]/checkout/helpers/getDeliveryAgents';

export const getDeliveryAgentsThunk = createAsyncThunk<
	DeliveryAgentsResponse,
	string
>(`addressMeta/getDeliveryAgents`, getDeliveryAgents);
