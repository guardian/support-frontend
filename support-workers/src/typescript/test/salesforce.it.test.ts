/**
 * @group integration
 */

import { handler } from '../lambdas/createSalesforceContactLambda';
import type {
	CreateSalesforceContactState,
	// WrappedState,
} from '../model/stateSchemas';
import {
	createSalesforceContactStateSchema,
	// wrapperSchemaForState,
	wrapState,
} from '../model/stateSchemas';
// import type { DeliveryContactRecordRequest } from '../services/salesforce';
import { SalesforceService } from '../services/salesforce';
import type { SalesforceConfig } from '../services/salesforceClient';
import { AuthService, getSalesforceConfig } from '../services/salesforceClient';
import createSalesforceContactContribution from './fixtures/createSalesforceContact/contributionMonthlyUSD.json';
// import createGiftSubscription from './fixtures/createSalesforceContact/gwGiftDirectDebit.json';
// import {
// 	city,
// 	customer,
// 	emailAddress,
// 	postCode,
// 	salesforceAccountId,
// 	salesforceId,
// 	state,
// 	street,
// 	telephoneNumber,
// 	title,
// 	uk,
// } from './fixtures/salesforceFixtures';

describe('AuthService', () => {
	test('should be able to retrieve an auth token', async () => {
		const config = await getSalesforceConfig('CODE');
		const authService = new AuthService(config);
		const authentication = await authService.getAuthentication();
		expect(authentication.access_token.length).toBeGreaterThan(0);
	});
	test('should reuse that auth token if it is still valid', async () => {
		const config = await getSalesforceConfig('CODE');
		const authService = new AuthService(config);
		const firstAuth = await authService.getAuthentication();
		const secondAuth = await authService.getAuthentication();
		expect(firstAuth).toEqual(secondAuth);
	});
});

describe('SalesforceService', () => {
	let config: SalesforceConfig;
	let salesforceService: SalesforceService;

	beforeAll(async () => {
		config = await getSalesforceConfig('CODE');
		salesforceService = new SalesforceService(config);
	});

	// test('should be able to upsert a customer', async () => {
	// 	const result = await salesforceService.upsert(customer);
	// 	expect(result).toEqual({
	// 		Success: true,
	// 		ContactRecord: {
	// 			Id: salesforceId,
	// 			AccountId: salesforceAccountId,
	// 		},
	// 	});
	// });

	// test('should be able to upsert a customer that has optional fields', async () => {
	// 	const result = await salesforceService.upsert({
	// 		...customer,
	// 		OtherStreet: street,
	// 		OtherCity: city,
	// 		OtherPostalCode: postCode,
	// 		OtherCountry: uk,
	// 		MailingStreet: street,
	// 		MailingCity: city,
	// 		MailingPostalCode: postCode,
	// 		Phone: telephoneNumber,
	// 	});
	// 	expect(result).toEqual({
	// 		Success: true,
	// 		ContactRecord: {
	// 			Id: salesforceId,
	// 			AccountId: salesforceAccountId,
	// 		},
	// 	});
	// });

	// test('it should be able to add a related contact record', async () => {
	// 	const name = 'integration-test-recipient';
	// 	const upsertData: DeliveryContactRecordRequest = {
	// 		AccountId: salesforceAccountId,
	// 		Email: emailAddress,
	// 		Salutation: title,
	// 		FirstName: name,
	// 		LastName: name,
	// 		MailingStreet: street,
	// 		MailingCity: city,
	// 		MailingState: state,
	// 		MailingPostalCode: postCode,
	// 		MailingCountry: uk,
	// 		RecordTypeId: '01220000000VB50AAG',
	// 	};
	// 	const result = await salesforceService.upsert(upsertData);
	// 	expect(result).toEqual({
	// 		Success: true,
	// 		ContactRecord: {
	// 			Id: expect.stringMatching('[0-9A-Z]+') as string,
	// 			AccountId: salesforceAccountId,
	// 		},
	// 	});
	// });
});

describe('CreateSalesforceContatctLambda', () => {
	test('CreateSalesforceContact lambda should upsert a SalesforceContactRecord', async () => {
		const inputState: CreateSalesforceContactState =
			createSalesforceContactStateSchema.parse(
				createSalesforceContactContribution,
			);
		const result = await handler(
			wrapState(inputState, null, {
				testUser: false,
				failed: false,
				messages: [],
			}),
		);

		expect(result.state.product.productType).toBe('Contribution');
		// Need to check type here because Typescript can't infer it from the preceding check
		if (result.state.productSpecificState.productType === 'Contribution') {
			expect(result.state.productSpecificState.salesForceContact.Id).toBe(
				'003UD00000bt0YfYAI',
			);
			expect(
				result.state.productSpecificState.salesForceContact.AccountId,
			).toBe('001UD00000KErfYYAT');
		}
	});

	// test('should upsert a gift SalesforceContactRecord', async () => {
	// 	const inputState: WrappedState<CreateSalesforceContactState> =
	// 		wrapperSchemaForState(createSalesforceContactStateSchema).parse(
	// 			createGiftSubscription,
	// 		);
	// 	const result = await handler(inputState);

	// 	expect(result.state.product.productType).toBe('GuardianWeekly');
	// 	if (result.state.productSpecificState.productType === 'GuardianWeekly') {
	// 		expect(result.state.productSpecificState.giftRecipient).toBeDefined();
	// 		expect(result.state.productSpecificState.salesForceContact.Id).toEqual(
	// 			expect.any(String),
	// 		);
	// 	}
	// });
});
