import { createAction } from '@reduxjs/toolkit';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';

export const validateForm = createAction<PaymentMethod | undefined>(
	'global/validateForm',
);

const OtherAmount = 'otherAmount';

type FormElement = typeof OtherAmount;

export const validatePartialForm = createAction<FormElement | undefined>(
	'global/validatePartialForm',
);
