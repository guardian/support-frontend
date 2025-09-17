import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

export type ContactRecordRequest = {
	IdentityID__c: string;
	Email: string;
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	OtherStreet: string | null;
	OtherCity: string | null;
	OtherState: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	Phone?: string | null;
	MailingStreet?: string | null;
	MailingCity?: string | null;
	MailingState?: string | null;
	MailingPostalCode?: string | null;
	MailingCountry?: string | null;
};

export type DeliveryContactRecordRequest = {
	AccountId: string;
	Email: string | null;
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
	RecordTypeId: '01220000000VB50AAG';
};
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
		const buyerResponse = await this.upsert(
			createContactRecordRequest(user, giftRecipient),
		);
		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
		return giftRecipientResponse?.ContactRecord ?? buyerResponse.ContactRecord;
	};

	upsert = async (
		contact: ContactRecordRequest | DeliveryContactRecordRequest,
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
			const giftRecipientContact: DeliveryContactRecordRequest = {
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
				RecordTypeId: '01220000000VB50AAG',
			};
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}

export const createContactRecordRequest = (
	user: User,
	giftRecipient: GiftRecipient | null,
): ContactRecordRequest => {
	const contact = {
		IdentityID__c: user.id,
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		OtherStreet: getAddressLine(user.billingAddress),
		OtherCity: user.billingAddress.city,
		OtherState: user.billingAddress.state,
		OtherPostalCode: user.billingAddress.postCode,
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
		Phone: user.telephoneNumber,
	};
	if (giftRecipient ?? !user.deliveryAddress) {
		// If there is a gift recipient then we don't want to update the
		// delivery address. This is because the user may already have another
		// non-gift delivery product which must still be delivered to their
		// original delivery address.
		return contact;
	}
	return {
		...contact,
		MailingStreet: getAddressLine(user.deliveryAddress),
		MailingCity: user.deliveryAddress.city,
		MailingState: user.deliveryAddress.state,
		MailingPostalCode: user.deliveryAddress.postCode,
		MailingCountry: getCountryNameByIsoCode(user.deliveryAddress.country),
	};
};
