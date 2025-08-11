import { BillingPeriod } from '@modules/product/billingPeriod';
import { getSoldToContact } from '../lambdas/createZuoraSubscriptionTSLambda';
import type {
	GuardianWeeklyState,
	PaperState,
	SupporterPlusState,
} from '../model/createZuoraSubscriptionState';

jest.mock('../model/stage', () => ({
	stageFromEnvironment: jest.fn().mockReturnValue('CODE'),
}));

describe('Sold to contact logic', () => {
	test('Digital products should not have a sold to contact', () => {
		const supporterPlusState: SupporterPlusState = {
			productType: 'SupporterPlus',
			billingCountry: 'GB',
			product: {
				amount: 15,
				currency: 'USD',
				billingPeriod: BillingPeriod.Monthly,
				productType: 'SupporterPlus',
			},
			productInformation: {
				product: 'SupporterPlus',
				ratePlan: 'Monthly',
				amount: 15,
			},
			paymentMethod: {
				TokenId: 'pm_0RuvIyItVxyc3Q6nb2IJU219',
				SecondTokenId: 'cus_SqcYN6d5k4Ad1c',
				PaymentGateway: 'Stripe PaymentIntents GNM Membership',
				Type: 'CreditCardReferenceTransaction',
				StripePaymentType: 'StripeCheckout',
			},
			appliedPromotion: null,
			salesForceContact: {
				Id: '003UD00000fFeFWYA0',
				AccountId: '001UD00000LaFxYYAV',
			},
			similarProductsConsent: true,
		};
		expect(getSoldToContact(supporterPlusState)).toBeUndefined();
	});
	test('Newspaper products should put the delivery address in the sold to contact', () => {
		const state: PaperState = {
			productType: 'Paper',
			user: {
				id: '200471109',
				primaryEmailAddress: 'support.e2e+M5VYUtE-0sIJ-5jrATmE4@thegulocal.com',
				title: null,
				firstName: 'support.e2e.firstName+tXAxq',
				lastName: 'support.e2e.lastName+4apMa',
				billingAddress: {
					lineOne: '3 Cross Street',
					lineTwo: '',
					city: 'Manchester',
					state: null,
					postCode: 'M1 1PW',
					country: 'GB',
				},
				deliveryAddress: {
					lineOne: '90 York Way',
					lineTwo: '',
					city: 'London',
					state: null,
					postCode: 'BN44 3QG',
					country: 'GB',
				},
				telephoneNumber: null,
				isTestUser: true,
				deliveryInstructions: '',
			},
			product: {
				currency: 'GBP',
				billingPeriod: BillingPeriod.Monthly,
				fulfilmentOptions: 'NationalDelivery',
				productOptions: 'EverydayPlus',
				productType: 'Paper',
				deliveryAgent: 2010,
			},
			productInformation: {
				product: 'NationalDelivery',
				ratePlan: 'EverydayPlus',
			},
			paymentMethod: {
				TokenId: 'pm_0RuvKtItVxyc3Q6n9BDeFcMk',
				SecondTokenId: 'cus_SqcauzsjICk2hi',
				PaymentGateway: 'Stripe PaymentIntents GNM Membership',
				Type: 'CreditCardReferenceTransaction',
				StripePaymentType: 'StripeCheckout',
			},
			firstDeliveryDate: '2025-08-14',
			appliedPromotion: null,
			salesForceContact: {
				Id: '003UD00000fG27tYAC',
				AccountId: '001UD00000LaQmUYAV',
			},
			similarProductsConsent: true,
		};
		expect(getSoldToContact(state)).toEqual({
			firstName: 'support.e2e.firstName+tXAxq',
			lastName: 'support.e2e.lastName+4apMa',
			workEmail: 'support.e2e+M5VYUtE-0sIJ-5jrATmE4@thegulocal.com',
			address1: '90 York Way',
			address2: '',
			city: 'London',
			postalCode: 'BN44 3QG',
			country: 'GB',
		});
	});
	describe('Guardian Weekly', () => {
		test('Gift subscriptions should use the gift recipient as sold to contact', () => {
			const state: GuardianWeeklyState = {
				productType: 'GuardianWeekly',
				user: {
					id: '200471299',
					primaryEmailAddress:
						'support.e2e+DwEGL-9Anr93TSb_va4fO@thegulocal.com',
					title: null,
					firstName: 'support.e2e.firstName+qagFn',
					lastName: 'support.e2e.lastName+4LgtN',
					billingAddress: {
						lineOne: 'Kings Place - gifter',
						lineTwo: 'Kings Cross',
						city: 'London',
						state: '',
						postCode: 'N1 9GU',
						country: 'GB',
					},
					deliveryAddress: {
						lineOne: '3 Cross St - giftee',
						lineTwo: null,
						city: 'Manchester',
						state: '',
						postCode: 'M1 9GU',
						country: 'GB',
					},
					telephoneNumber: null,
					isTestUser: true,
					deliveryInstructions: null,
				},
				giftRecipient: {
					title: 'Mr',
					firstName: 'support.e2e.firstName+qagFn-giftee',
					lastName: 'support.e2e.lastName+4LgtN-giftee',
					email: 'giftee-support.e2e+DwEGL-9Anr93TSb_va4fO@thegulocal.com',
				},
				product: {
					currency: 'GBP',
					billingPeriod: BillingPeriod.Quarterly,
					fulfilmentOptions: 'Domestic',
					productType: 'GuardianWeekly',
				},
				productInformation: null,
				paymentMethod: {
					TokenId: 'pm_0Ruw40ItVxyc3Q6nouSwThlC',
					SecondTokenId: 'cus_SqdKJlTNacgXH2',
					PaymentGateway: 'Stripe PaymentIntents GNM Membership',
					Type: 'CreditCardReferenceTransaction',
					StripePaymentType: 'StripeCheckout',
				},
				firstDeliveryDate: '2025-08-22',
				appliedPromotion: null,
				salesForceContact: {
					Id: '003UD00000fFrroYAC',
					AccountId: '001UD00000LaZJLYA3',
				},
				similarProductsConsent: null,
			};
			expect(getSoldToContact(state)).toEqual({
				firstName: 'support.e2e.firstName+qagFn-giftee',
				lastName: 'support.e2e.lastName+4LgtN-giftee',
				workEmail: 'giftee-support.e2e+DwEGL-9Anr93TSb_va4fO@thegulocal.com',
				address1: '3 Cross St - giftee',
				city: 'Manchester',
				state: '',
				postalCode: 'M1 9GU',
				country: 'GB',
			});
		});
		test('Non-gift subscriptions should use the user as sold to contact', () => {
			const state: GuardianWeeklyState = {
				productType: 'GuardianWeekly',
				user: {
					id: '200471097',
					primaryEmailAddress:
						'support.e2e+s3vjNvkhEvjHR7MWFMDyI@thegulocal.com',
					title: null,
					firstName: 'support.e2e.firstName+euOE3',
					lastName: 'support.e2e.lastName+mKXZm',
					billingAddress: {
						lineOne: 'Kings Place',
						lineTwo: '',
						city: 'London',
						state: null,
						postCode: 'N19GU',
						country: 'GB',
					},
					deliveryAddress: {
						lineOne: '61 Broadway',
						lineTwo: '',
						city: 'New York',
						state: 'NY',
						postCode: '10006',
						country: 'US',
					},
					telephoneNumber: null,
					isTestUser: true,
					deliveryInstructions: null,
				},
				giftRecipient: null,
				product: {
					currency: 'USD',
					billingPeriod: BillingPeriod.Monthly,
					fulfilmentOptions: 'Domestic',
					productType: 'GuardianWeekly',
				},
				productInformation: {
					product: 'GuardianWeeklyDomestic',
					ratePlan: 'Monthly',
				},
				paymentMethod: {
					TokenId: 'pm_0RuvI7ItVxyc3Q6nLwg01Yix',
					SecondTokenId: 'cus_SqcXRaKFROKVID',
					PaymentGateway: 'Stripe PaymentIntents GNM Membership',
					Type: 'CreditCardReferenceTransaction',
					StripePaymentType: 'StripeCheckout',
				},
				firstDeliveryDate: '2025-08-29',
				appliedPromotion: {
					promoCode: '10ANNUAL',
					countryGroupId: 'us',
				},
				salesForceContact: {
					Id: '003UD00000fFeFWYA0',
					AccountId: '001UD00000LaFxYYAV',
				},
				similarProductsConsent: true,
			};
			expect(getSoldToContact(state)).toEqual({
				firstName: 'support.e2e.firstName+euOE3',
				lastName: 'support.e2e.lastName+mKXZm',
				workEmail: 'support.e2e+s3vjNvkhEvjHR7MWFMDyI@thegulocal.com',
				address1: '61 Broadway',
				address2: '',
				city: 'New York',
				state: 'NY',
				postalCode: '10006',
				country: 'US',
			});
		});
	});
});
