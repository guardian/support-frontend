import { z } from 'zod';
import type { GiftRecipient, User } from '../model/stateSchemas';
import { createDigitalOnlyContactRecordRequest } from './contactTypes/digitalOnly';
import type { DigitalOnlyContactRecordRequest } from './contactTypes/digitalOnly';
import { createGiftBuyerContactRecordRequest } from './contactTypes/giftBuyer';
import type { GiftBuyerContactRecordRequest } from './contactTypes/giftBuyer';
import { createGiftRecipientContactRecordRequest } from './contactTypes/giftRecipient';
import type { GiftRecipientContactRecordRequest } from './contactTypes/giftRecipient';
import { createPrintContactRecordRequest } from './contactTypes/print';
import type { PrintContactRecordRequest } from './contactTypes/print';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

export const salesforceContactRecordSchema = z.object({
	Id: z.string(),
	AccountId: z.string(),
});
export type SalesforceContactRecord = z.infer<
	typeof salesforceContactRecordSchema
>;

export class SalesforceError extends Error {
	constructor({ errorCode, message }: { errorCode: string; message: string }) {
		super(message);
		this.name = errorCode;
	}
}

export const successfulUpsertResponseSchema = z.object({
	Success: z.literal(true),
	ContactRecord: salesforceContactRecordSchema,
});

type SuccessfulUpsertResponse = z.infer<typeof successfulUpsertResponseSchema>;

const failedUpsertResponseSchema = z.object({
	Success: z.literal(false),
	ErrorString: z.string(),
});
const upsertResponseSchema = z.discriminatedUnion('Success', [
	successfulUpsertResponseSchema,
	failedUpsertResponseSchema,
]);

export type UpsertResponse = z.infer<typeof upsertResponseSchema>;

export const salesforceErrorCodes = {
	expiredAuthenticationCode: 'INVALID_SESSION_ID',
	rateLimitExceeded: 'REQUEST_LIMIT_EXCEEDED',
	readOnlyMaintenance: 'INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE',
};

export class SalesforceService {
	private upsertEndpoint = 'services/apexrest/RegisterCustomer/v1/';
	private client: SalesforceClient;

	constructor(config: SalesforceConfig) {
		this.client = new SalesforceClient(config);
	}

	createContactRecords = async (
		user: User,
		giftRecipient: GiftRecipient | null,
	): Promise<SalesforceContactRecord> => {
		const hasGiftRecipient = !!giftRecipient;
		const buyerType = getBuyerType(user, hasGiftRecipient);
		const buyerContact = createBuyerRecordRequest(user, buyerType);
		const buyerResponse = await this.upsert(buyerContact);
		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
		console.log('buyerResponse:', buyerResponse);
		console.log('giftRecipientResponse:', giftRecipientResponse);
		return giftRecipientResponse?.ContactRecord ?? buyerResponse.ContactRecord;
	};

	upsert = async (
		contact:
			| PrintContactRecordRequest
			| GiftBuyerContactRecordRequest
			| GiftRecipientContactRecordRequest
			| DigitalOnlyContactRecordRequest,
	): Promise<SuccessfulUpsertResponse> => {
		const response: UpsertResponse = await this.client.post(
			this.upsertEndpoint,
			JSON.stringify({
				newContact: contact,
			}),
			upsertResponseSchema,
		);

		return SalesforceService.parseResponseToResult(response);
	};

	static parseResponseToResult(response: UpsertResponse) {
		if (response.Success) {
			return response;
		} else {
			const errorCode = response.ErrorString.includes(
				salesforceErrorCodes.readOnlyMaintenance,
			)
				? salesforceErrorCodes.readOnlyMaintenance
				: 'UNKNOWN_ERROR';
			throw new SalesforceError({
				errorCode,
				message:
					response.ErrorString ||
					'Salesforce `Success` returned as `false` with no error message',
			});
		}
	}

	private maybeAddGiftRecipient(
		contactRecord: SalesforceContactRecord,
		giftRecipient: GiftRecipient | null,
		user: User,
	): Promise<SuccessfulUpsertResponse> | null {
		if (giftRecipient && validGiftRecipientFields(giftRecipient)) {
			const giftRecipientContact = createGiftRecipientContactRecordRequest(
				contactRecord,
				giftRecipient,
				user,
			);
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}

const validGiftRecipientFields = (giftRecipient: GiftRecipient) => {
	return giftRecipient.firstName && giftRecipient.lastName;
};

export const createBuyerRecordRequest = (
	user: User,
	buyerType: 'Print' | 'GiftBuyer' | 'DigitalOnly',
):
	| PrintContactRecordRequest
	| GiftBuyerContactRecordRequest
	| DigitalOnlyContactRecordRequest => {
	console.log('Creating buyer record of type:', buyerType);

	switch (buyerType) {
		case 'Print':
			return createPrintContactRecordRequest(user);
		case 'GiftBuyer':
			return createGiftBuyerContactRecordRequest(user);
		case 'DigitalOnly':
			return createDigitalOnlyContactRecordRequest(user);
	}
};

export const createGiftRecipientContactRecordRequestWrapper = (
	user: User,
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
): GiftRecipientContactRecordRequest => {
	return createGiftRecipientContactRecordRequest(
		contactRecord,
		giftRecipient,
		user,
	);
};

const getBuyerType = (
	user: User,
	hasGiftRecipient: boolean,
): 'Print' | 'GiftBuyer' | 'DigitalOnly' => {
	if (hasGiftRecipient) {
		return 'GiftBuyer';
	}
	if (user.deliveryAddress) {
		return 'Print';
	}

	return 'DigitalOnly';
};
