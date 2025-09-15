import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

export type BaseContactRecordRequest = {
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	Email: string | null;
	Phone?: string | null;
};

export type StandardContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	OtherStreet: string | undefined;
	OtherCity: string | undefined;
	OtherState: string | undefined;
	OtherPostalCode: string | undefined;
	OtherCountry: string | null;
	MailingStreet: string | undefined;
	MailingCity: string | undefined;
	MailingState: string | undefined;
	MailingPostalCode: string | undefined;
	MailingCountry: string | null;
};

export type GiftRecipientContactRecordRequest = BaseContactRecordRequest & {
	AccountId: string;
	RecordTypeId: '01220000000VB50AAG';
	MailingStreet: string | undefined;
	MailingCity: string | undefined;
	MailingState: string | undefined;
	MailingPostalCode: string | undefined;
	MailingCountry: string | null;
};

export type DigitalContactRecordRequest = BaseContactRecordRequest & {
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
		console.log('Creating Salesforce contact record from user:', user);
		const contactType = getContactType(giftRecipient, user);
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
			| StandardContactRecordRequest
			| GiftRecipientContactRecordRequest
			| DigitalContactRecordRequest,
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
			const giftRecipientContact: GiftRecipientContactRecordRequest =
				createGiftRecipientContactRecordRequest(
					contactRecord,
					giftRecipient,
					user,
				);
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}
const createBillingAddressFields = (user: User) => ({
	OtherStreet: getAddressLine(user.billingAddress),
	OtherCity: user.billingAddress.city ?? undefined,
	OtherState: user.billingAddress.state ?? undefined,
	OtherPostalCode: user.billingAddress.postCode ?? undefined,
	OtherCountry: getCountryNameByIsoCode(user.billingAddress.country) ?? null,
});

const createMailingAddressFields = (user: User) => {
	return {
		MailingStreet: user.deliveryAddress
			? getAddressLine(user.deliveryAddress)
			: undefined,
		MailingCity: user.deliveryAddress?.city ?? undefined,
		MailingState: user.deliveryAddress?.state ?? undefined,
		MailingPostalCode: user.deliveryAddress?.postCode ?? undefined,
		MailingCountry: user.deliveryAddress
			? getCountryNameByIsoCode(user.deliveryAddress.country)
			: null,
	};
};

const getContactType = (
	giftRecipient: GiftRecipient | null,
	user: User,
): 'Standard' | 'Digital' => {
	if (giftRecipient ?? !user.deliveryAddress) {
		return 'Standard';
	}
	return 'Digital';
};

const createStandardContactRecordRequest = (
	baseContact: BaseContactRecordRequest,
	user: User,
): StandardContactRecordRequest => {
	return {
		...baseContact,
		IdentityID__c: user.id,
		...createBillingAddressFields(user),
		...createMailingAddressFields(user),
	};
};

const createGiftRecipientContactRecordRequest = (
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
	user: User,
): GiftRecipientContactRecordRequest => {
	return {
		AccountId: contactRecord.AccountId,
		Email: giftRecipient.email,
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		...createMailingAddressFields(user),
		RecordTypeId: '01220000000VB50AAG',
	};
};

const createDigitalContactRecordRequest = (
	baseContact: BaseContactRecordRequest,
): DigitalContactRecordRequest => {
	return {
		...baseContact,
		RecordTypeId: '01220000000VB50AAG',
	};
};

export const createContactRecordRequest = (
	user: User,
	contactType: 'Standard' | 'Digital',
): StandardContactRecordRequest | DigitalContactRecordRequest => {
	const baseContact = {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
	};
	switch (contactType) {
		case 'Standard':
			return createStandardContactRecordRequest(baseContact, user);
		case 'Digital':
			return createDigitalContactRecordRequest(baseContact);
	}
};
