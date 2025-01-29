import type {
	DirectDebitPaymentFields,
	StripePaymentFields,
} from '../model/paymentFields';
import type { CreatePaymentMethodState } from '../model/stateSchemas';
import {
	createPaymentMethodStateSchema,
	createSalesforceContactStateSchema,
} from '../model/stateSchemas';
import createPaymentContribution from './fixtures/createPaymentMethod/contributionMonthlyUSD.json';
import contributionWithPayPal from './fixtures/createPaymentMethod/contributionWithPayPal.json';
import createPaymentPaper from './fixtures/createPaymentMethod/paperDirectDebit.json';
import createPaymentSupporterPlus from './fixtures/createPaymentMethod/supporterPlusAnnualEUR.json';
import createSalesforceContactContribution from './fixtures/createSalesforceContact/contributionMonthlyUSD.json';
import createSalesforceContactPaper from './fixtures/createSalesforceContact/paperDirectDebit.json';

describe('stateSchemas', () => {
	test('createPaymentMethodSchema works with real inputs', () => {
		const supporterPlus = createPaymentMethodStateSchema.parse(
			createPaymentSupporterPlus,
		);
		expect(supporterPlus.product.currency).toBe('EUR');
		expect(supporterPlus.acquisitionData?.ophanIds.pageviewId).toBe(
			'm21r1npxieyqa3kn5gxh',
		);

		const contribution: CreatePaymentMethodState =
			createPaymentMethodStateSchema.parse(createPaymentContribution);
		expect(contribution.product.currency).toBe('USD');
		expect(contribution.product.productType).toBe('Contribution');
		if (contribution.product.productType === 'Contribution') {
			expect(contribution.product.amount).toBe(5);
		}
		expect(contribution.paymentFields.paymentType).toBe('Stripe');
		const stripePaymentFields =
			contribution.paymentFields as StripePaymentFields;
		expect(stripePaymentFields.stripePaymentType).toBe(
			'StripePaymentRequestButton',
		);

		const payPalContribution: CreatePaymentMethodState =
			createPaymentMethodStateSchema.parse(contributionWithPayPal);
		expect(payPalContribution.product.currency).toBe('GBP');
		expect(payPalContribution.product.productType).toBe('Contribution');
		if (payPalContribution.product.productType === 'Contribution') {
			expect(payPalContribution.product.amount).toBe(4);
		}
		expect(payPalContribution.paymentFields.paymentType).toBe('PayPal');
		if (payPalContribution.paymentFields.paymentType === 'PayPal') {
			expect(payPalContribution.paymentFields.baid).toBe('BA-1234');
		}

		const paper = createPaymentMethodStateSchema.parse(createPaymentPaper);
		expect(paper.product.productType).toBe('Paper');
		expect(paper.firstDeliveryDate?.getFullYear()).toBe(2024);
		expect(paper.user.deliveryAddress?.lineOne).toBe('123 Test Street');
		const ddPaymentFields = paper.paymentFields as DirectDebitPaymentFields;
		expect(ddPaymentFields.accountNumber).toBe('00000000');
	});

	test('createSalesforceContactSchema works with real inputs', () => {
		const contribution = createSalesforceContactStateSchema.parse(
			createSalesforceContactContribution,
		);
		expect(contribution.product.currency).toBe('USD');
		expect(contribution.product.productType).toBe('Contribution');
		if (contribution.product.productType === 'Contribution') {
			expect(contribution.product.amount).toBe(5);
		}
		expect(contribution.paymentMethod.Type).toBe(
			'CreditCardReferenceTransaction',
		);
		if (contribution.paymentMethod.Type === 'CreditCardReferenceTransaction') {
			expect(contribution.paymentMethod.CreditCardType).toBe('MasterCard');
		}

		const paper = createSalesforceContactStateSchema.parse(
			createSalesforceContactPaper,
		);
		expect(paper.paymentMethod.Type).toBe('BankTransfer');
		if (paper.paymentMethod.Type === 'BankTransfer') {
			expect(paper.paymentMethod.PaymentGateway).toBe('GoCardless');
		}
	});
});
