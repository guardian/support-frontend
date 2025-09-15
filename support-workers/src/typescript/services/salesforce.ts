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
	OtherCity: string | null;
	OtherState: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	MailingStreet: string | undefined;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

export type RecipientContactRecordRequest = BaseContactRecordRequest & {
	AccountId?: string;
	RecordTypeId: '01220000000VB50AAG';
	MailingStreet?: string;
	MailingCity?: string | null;
	MailingState?: string | null;
	MailingPostalCode?: string | null;
	MailingCountry?: string | null;
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
		console.log(`XXX Creating Salesforce contact record...`);
		console.log(`XXX user: ${JSON.stringify(user)}`);
		console.log(`XXX Creating Salesforce contact record...`);
		const contact = createContactRecordRequest(user, giftRecipient);
		const buyerResponse = await this.upsert(contact);
		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
		return giftRecipientResponse?.ContactRecord ?? buyerResponse.ContactRecord;
	};

	upsert = async (
		contact: StandardContactRecordRequest | RecipientContactRecordRequest,
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
			const giftRecipientContact: RecipientContactRecordRequest = {
				AccountId: contactRecord.AccountId,
				Email: giftRecipient.email,
				Salutation: giftRecipient.title,
				FirstName: giftRecipient.firstName,
				LastName: giftRecipient.lastName,
				...createMailingAddressFields(user),
				RecordTypeId: '01220000000VB50AAG',
			};
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}
const createBillingAddressFields = (user: User) => ({
	OtherStreet: getAddressLine(user.billingAddress),
	OtherCity: user.billingAddress.city,
	OtherState: user.billingAddress.state,
	OtherPostalCode: user.billingAddress.postCode,
	OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
});

const createMailingAddressFields = (user: User) => {
	return {
		MailingStreet: user.deliveryAddress
			? getAddressLine(user.deliveryAddress)
			: undefined,
		MailingCity: user.deliveryAddress?.city ?? null,
		MailingState: user.deliveryAddress?.state ?? null,
		MailingPostalCode: user.deliveryAddress?.postCode ?? null,
		MailingCountry: user.deliveryAddress
			? getCountryNameByIsoCode(user.deliveryAddress.country)
			: null,
	};
};

export const createContactRecordRequest = (
	user: User,
	giftRecipient: GiftRecipient | null,
): StandardContactRecordRequest | RecipientContactRecordRequest => {
	const baseContact = {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
	};

	if (giftRecipient ?? !user.deliveryAddress) {
		return createDeliveryContactRecordRequest(baseContact, user);
	}

	return createStandardContactRecordRequest(baseContact, user);
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

const createDeliveryContactRecordRequest = (
	baseContact: BaseContactRecordRequest,
	user: User,
): RecipientContactRecordRequest => {
	return {
		...baseContact,
		RecordTypeId: '01220000000VB50AAG',
		...(user.deliveryAddress && createMailingAddressFields(user)),
	};
};
