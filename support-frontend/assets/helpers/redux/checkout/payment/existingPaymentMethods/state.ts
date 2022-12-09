import type { AsyncStatus } from 'helpers/types/asyncStatus';
import { Initial } from 'helpers/types/asyncStatus';

type ExistingPaymentType = 'Card' | 'DirectDebit';

export type ExistingPaymentMethodSubscription = {
	isActive: boolean;
	isCancelled: boolean;
	name: string;
	billingAccountId?: string;
};

export type NotRecentlySignedInExistingPaymentMethod = {
	paymentType: ExistingPaymentType;
};

export type RecentlySignedInExistingPaymentMethod = {
	paymentType: ExistingPaymentType;
	billingAccountId: string;
	subscriptions: ExistingPaymentMethodSubscription[];
	card?: string;
	mandate?: string;
};

export type ExistingPaymentMethod =
	| NotRecentlySignedInExistingPaymentMethod
	| RecentlySignedInExistingPaymentMethod;

export type ExistingPaymentMethodsState = {
	status: AsyncStatus;
	paymentMethods: ExistingPaymentMethod[];
};

export const initialState: ExistingPaymentMethodsState = {
	status: Initial,
	paymentMethods: [],
};
