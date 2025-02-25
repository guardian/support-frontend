import type { ContributionType } from '../../../support-frontend/assets/helpers/contributions.ts';
import type { IsoCountry } from '../../../support-frontend/assets/helpers/internationalisation/country';
import type { IsoCurrency } from '../../../support-frontend/assets/helpers/internationalisation/currency';
import type { PaymentMethod } from '../../../support-frontend/assets/helpers/forms/paymentMethods';
type ProductType =
	| 'Contribution'
	| 'Paper'
	| 'GuardianWeekly'
	| 'SupporterPlus'
	| 'TierThree';

export type AcquisitionsProductDetails = {
	details: [AcquisitionsProductDetail];
};

// Items not required by BigQuery
export type AcquisitionsProductDetail = AcquisitionsProduct & {
	eventTimeStamp: Date;
	product: ProductType;
	country: IsoCountry;
	currency: IsoCurrency;
	paymentFrequency: ContributionType;
	labels: [string]; // one-time-checkout
	reusedExistingPaymentMethod: boolean;
	readerType: string; // Direct
	acquisitionType: string; // Purchase
	queryParameters: [string] | []; // ??
	platform: string; // SUPPORT
	postalCode: string;
	state: string;
	email: string;
};

// Items to write to BigQuery
// From scala : AcquistionDataRowMapper.mapToTableRow
export type AcquisitionsProduct = {
	amount: number;
	componentId: string | null;
	componentType: string | null;
	campaignCode: string;
	source: string | null;
	referrerUrl: string | null;
	abTests: [
		{
			name: string; // oneTimeConfirmEmail
			variant: string; // variant
		},
	];
	paymentProvider: PaymentMethod;
	printOptions: string | null;
	browserId: string | null;
	identityId: string; // 200381287
	pageViewId: string; // m7ezxppo1x1qg5b4q1x8
	referrerPageViewId: string;
	promoCode: string | null;
	zuoraSubscriptionNumber: string | null;
	contributionId: string; //f7c7aef7-f12d-476b-ba68-5ae79237cd8f
	paymentId: string; // PAYID-M64KYRY1DX444112D060283M
};

export const aquisitionProduct: AcquisitionsProduct = {
	amount: 10.0,
	componentId: null,
	componentType: null,
	campaignCode: '',
	source: null,
	referrerUrl: null,
	abTests: [{ name: 'oneTimeConfirmEmail', variant: 'variant' }],
	paymentProvider: 'PayPal',
	printOptions: null,
	browserId: null,
	identityId: '200381287',
	pageViewId: 'm7ezxppo1x1qg5b4q1x8',
	referrerPageViewId: '',
	promoCode: null,
	zuoraSubscriptionNumber: null,
	contributionId: 'f7c7aef7-f12d-476b-ba68-5ae79237cd8f',
	paymentId: 'PAYID-M64KYRY1DX444112D060283M',
};

export const aquisitionProductDetail: AcquisitionsProductDetail = {
	eventTimeStamp: new Date(),
	product: 'Contribution',
	country: 'GB',
	currency: 'GBP',
	paymentFrequency: 'ONE_OFF',
	labels: ['one-time-checkout'],
	reusedExistingPaymentMethod: false,
	readerType: 'Direct',
	acquisitionType: 'Purchase',
	queryParameters: [],
	platform: 'SUPPORT',
	postalCode: '',
	state: 'CA',
	email: '',
	...aquisitionProduct,
};

export const aquisitionProductDetails: AcquisitionsProductDetails = {
	details: [aquisitionProductDetail],
};
