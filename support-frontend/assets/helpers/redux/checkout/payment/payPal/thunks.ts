import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadPayPalRecurring } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';

export const loadPayPalExpressSdk = createAsyncThunk(
	'paypal/loadPayPalExpressSdk',
	loadPayPalRecurring,
);
