import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
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
		const contactType = getContactType(user, giftRecipient);
		const contact = createContactRecordRequest(user, contactType);
		const buyerResponse = await this.upsert(contact);
		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
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
		if (giftRecipient?.firstName && giftRecipient.lastName) {
			const giftRecipientContact: GiftRecipientContactRecordRequest = {
				AccountId: contactRecord.AccountId,
				Email: giftRecipient.email,
				Salutation: giftRecipient.title,
				FirstName: giftRecipient.firstName,
				LastName: giftRecipient.lastName,
				MailingStreet: user.deliveryAddress
					? getAddressLine(user.deliveryAddress)
					: null,
				MailingCity: user.deliveryAddress?.city ?? null,
				MailingState: user.deliveryAddress?.state ?? null,
				MailingPostalCode: user.deliveryAddress?.postCode ?? null,
				MailingCountry: user.deliveryAddress
					? getCountryNameByIsoCode(user.deliveryAddress.country)
					: null,
			};
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}

export const createContactRecordRequest = (
	user: User,
	contactType: 'Print' | 'GiftRecipient' | 'GiftBuyer' | 'DigitalOnly',
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
):
	| PrintContactRecordRequest
	| GiftRecipientContactRecordRequest
	| GiftBuyerContactRecordRequest
	| DigitalOnlyContactRecordRequest => {
	console.log('Creating contact record of type:', contactType);
	switch (contactType) {
		case 'Print':
			return createPrintContactRecordRequest(user);
		case 'GiftRecipient':
			return createGiftRecipientContactRecordRequest(
				contactRecord,
				giftRecipient,
				user,
			);
		case 'GiftBuyer':
			return createGiftBuyerContactRecordRequest(user);
		case 'DigitalOnly':
			return createDigitalOnlyContactRecordRequest(user);
	}
};

//This has issues because I've assumed user is always the buyer, but it can also be the gift recipient.
const getContactType = (
	user: User,
	giftRecipient: GiftRecipient | null,
): 'Print' | 'GiftBuyer' | 'GiftRecipient' | 'DigitalOnly' => {
	if (giftRecipient?.firstName && giftRecipient.lastName) {
		if (user.deliveryAddress) {
			return 'GiftRecipient';
		}
		return 'GiftBuyer';
	}
	if (user.deliveryAddress) {
		return 'Print';
	}

	return 'DigitalOnly';
};
