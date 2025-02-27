import { z } from 'zod';
import {
	ProductTypeSchema,
	IsoCountrySchema,
	IsoCurrencySchema,
	ContributionTypeSchema,
	PaymentMethodSchema,
} from './dependencies';

// Items to write to BigQuery (datalake:fact_acquisition_event)
// From scala : AcquistionDataRowMapper.mapToTableRow
export const AcquisitionProductSchemaRelabel = z.object({
	eventTimeStamp: z.date(),
	country: z.enum(IsoCountrySchema),
	componentId: z.string().nullable(),
	componentType: z.string().nullable(),
	campaignCodes: z.string().array(),
	referrerUrl: z.string().nullable(),
	abTests: z
		.object({ name: z.string(), variant: z.string() })
		.array()
		.nullable(),
	paymentFrequency: z.enum(ContributionTypeSchema),
	paymentProvider: z.enum(PaymentMethodSchema), // ???
	printOptions: z
		.object({ product: z.string(), delivery_country_code: z.string() })
		.array()
		.nullable(),
	browserId: z.string().nullable(),
	identityId: z.string(), // 200381287
	pageViewId: z.string(), // m7ezxppo1x1qg5b4q1x8
	referrerPageViewId: z.string().nullable(),
	promoCode: z.string().nullable(),
	queryParameters: z
		.object({ key: z.string(), value: z.string() })
		.array()
		.nullable(),
	reusedExistingPaymentMethod: z.boolean(),
	acquisitionType: z.string(), // Purchase
	readerType: z.string(), // Direct
	zuoraSubscriptionNumber: z.string().nullable(),
	contributionId: z.string(), //f7c7aef7-f12d-476b-ba68-5ae79237cd8f
	paymentId: z.string(), // PAYID-M64KYRY1DX444112D060283M
});
export const AcquisitionProductSchemaKeep = z.object({
	product: z.enum(ProductTypeSchema),
	amount: z.number(),
	currency: z.enum(IsoCurrencySchema),
	source: z.string().nullable(),
	platform: z.string(), // SUPPORT
	labels: z.string().array().nullable(), // one-time-checkout
});
export type AcquisitionProduct = z.infer<
	typeof AcquisitionProductSchemaRelabel & typeof AcquisitionProductSchemaKeep
>;

// Items not required by BigQuery
export const AcquisitionProductDetailSchema = z.object({
	postalCode: z.string().nullable(),
	state: z.string().nullable(),
	email: z.string(),
});
export type AcquisitionProductDetail = z.infer<
	typeof AcquisitionProductDetailSchema
> &
	AcquisitionProduct;

export type AcquisitionProductDetails = {
	details: [AcquisitionProductDetail];
};

export const aquisitionProductDetail: AcquisitionProductDetail = {
	eventTimeStamp: new Date(),
	product: 'CONTRIBUTION',
	amount: 10.0,
	country: 'GB',
	currency: 'GBP',
	componentId: null,
	componentType: null,
	campaignCodes: [''],
	source: null,
	referrerUrl: null,
	abTests: [], //  disabled:  { name: 'oneTimeConfirmEmail', variant: 'variant' }
	paymentFrequency: 'ONE_OFF',
	paymentProvider: 'PAYPAL',
	printOptions: null,
	browserId: null,
	identityId: '200381287',
	pageViewId: 'm7ezxppo1x1Qg5b4q1x8',
	referrerPageViewId: null,
	platform: 'SUPPORT',
	labels: ['one-time-checkout'],
	promoCode: null,
	queryParameters: [],
	reusedExistingPaymentMethod: false,
	acquisitionType: 'Purchase',
	readerType: 'Direct',
	zuoraSubscriptionNumber: null,
	contributionId: 'f7c7aef7-f12d-476b-ba68-5ae89237cd8f',
	paymentId: 'PAYID-M64KYRY1DX444113D060283M',
	postalCode: '',
	state: 'CA',
	email: '',
};

export const existingQuery = {
	messageId: '4748da49-9a76-4858-8f52-7af50682960c',
	receiptHandle:
		'AQEBEV6BazCHj+vXouBnJAMwttfVLVy5fp2Bxh1VrSN47UOIhgfIXyCl1AykuORX5zs7qZpvpENxwkpKQoCfdexFCwOSy8Hr5p2/UZUK3nTI2NFjAFWk0AdT1gdJSqBZGzhH+ppJ6hx0ZNs82qsEvBjpbKDsQS/vayY5ZqJbCeBuf3Ag5uiXRXMaYZ6KgQBPOE5a+CZgomXGg83bLv/3wOkj6YKfVHEzsMJ8qVh77LFyRzLouC5sDkPZNvh0ZK19ARpoccsqenYd8Ip0UwO8R/laCli+HK/rwWAYir+fyCY54TBtKSBXjUBjImXuWagOBhXnZb4X/o4lUQTIB692iPszm1GKhD3eY8pCDerqbnUx+H+bnkb/JG3KVMpQsESnrUblRKAKiNRbsc9WYsO7SWQ5fTMkVu88dOgGyNoY1yedAp4=',
	body: `{"version":"0","id":"47bcfca8-2d17-ba32-e5d6-e5896be64279","detail-type":"AcquisitionsEvent","source":"payment-api.1","account":"865473395570","time":"${new Date()}","region":"eu-west-1","resources":[],"detail": {"eventTimeStamp":"${new Date()}","product":"CONTRIBUTION","amount":100.0,"country":"US","currency":"AUD","componentId":null,"componentType":null,"campaignCode":null,"source":null,"referrerUrl":null,"abTests": [{"name":"oneTimeConfirmEmail","variant":"variant",},],"paymentFrequency":"ONE_OFF","paymentProvider":"PAYPAL","printOptions":null,"browserId":null,"identityId":"200381287","pageViewId":"m7ezxppo1x1qg5b4q1x8","referrerPageViewId":null,"labels":["one-time-checkout"],"promoCode":null,"reusedExistingPaymentMethod":false,"readerType":"Direct","acquisitionType":"Purchase","zuoraSubscriptionNumber":null,"contributionId":"f7c7aef7-f12d-476b-ba68-5ae79237cd8f","paymentId":"PAYID-M64KYRY1DX444112D060283M","queryParameters":[],"platform":"SUPPORT","postalCode":"N1 9GU","state":null,"email": "support.e2e+6gerBpOyBVGSYxYZrXyKo@thegulocal.com",},}`,
	attributes: [],
	messageAttributes: {},
	md5OfBody: '70c6396320815afbd841afe650311c21',
	eventSource: 'aws:sqs',
	eventSourceARN:
		'arn:aws:sqs:eu-west-1:865473395570:bigquery-acquisitions-publisher-queue-CODE',
	awsRegion: 'eu-west-1',
};
