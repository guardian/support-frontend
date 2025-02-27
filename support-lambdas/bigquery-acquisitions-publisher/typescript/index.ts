import { getStage } from './stage';
import { buildAuthClient, createBigQueryClient } from './bigQuery';
import { BigQuery } from '@google-cloud/bigquery';
import { getGCPCredentialsFromSSM } from './ssm';
import type { SQSEvent } from 'aws-lambda';
import {
	AcquisitionProductDetail,
	aquisitionProductDetail,
	AcquisitionProductSchema,
} from './acquisitions';

// const exampleReadFromBigQuery = async (bigQueryClient: BigQuery) => {
// 	const query: Query = {
// 		query: 'SELECT COUNT(*) FROM datalake.fact_acquisition_event',
// 		location: 'europe-west2',
// 	};
// 	const [job] = await bigQueryClient.createQueryJob(query);
// 	console.log(`Job ${job.id} started.`);

// 	const [rows] = await job.getQueryResults();
// 	console.log('Rows:');
// 	rows.forEach((row) => console.log(row));
// };

const exampleWriteToBigQuery = async (
	bigQueryClient: BigQuery,
	aquisitionProductDetail: AcquisitionProductDetail,
) => {
	const parsedAquisitionProduct = AcquisitionProductSchema.parse(
		aquisitionProductDetail,
	);

	const acquisitionEvent = {
		event_timestamp: parsedAquisitionProduct.eventTimeStamp,
		amount_in_gbp: null,
		annualised_value: null,
		country_code: parsedAquisitionProduct.country,
		component_id: parsedAquisitionProduct.componentId,
		component_type: parsedAquisitionProduct.componentType,
		campaign_codes: parsedAquisitionProduct.campaignCodes,
		device_type: null,
		total_visit_days: null,
		average_days_between_recent_visits: null,
		regular: null,
		referrer_url: parsedAquisitionProduct.referrerUrl,
		ab_tests: parsedAquisitionProduct.abTests,
		payment_frequency: parsedAquisitionProduct.paymentFrequency,
		payment_provider: parsedAquisitionProduct.paymentProvider,
		print_options: parsedAquisitionProduct.printOptions,
		browser_id: parsedAquisitionProduct.browserId,
		identity_id: parsedAquisitionProduct.identityId,
		page_view_id: parsedAquisitionProduct.pageViewId,
		referrer_page_view_id: parsedAquisitionProduct.referrerPageViewId,
		received_timestamp: null,
		promo_code: parsedAquisitionProduct.promoCode,
		discount_percentage: null,
		discount_length_in_months: null,
		annualised_value_in_gbp: null,
		received_date: null,
		meta_created_at: null,
		meta_produced_at: null,
		query_parameters: parsedAquisitionProduct.queryParameters,
		reused_existing_payment_method:
			parsedAquisitionProduct.reusedExistingPaymentMethod,
		acquisition_type: parsedAquisitionProduct.acquisitionType,
		reader_type: parsedAquisitionProduct.readerType,
		zuora_subscription_number: parsedAquisitionProduct.zuoraSubscriptionNumber,
		zuora_account_number: null,
		contribution_id: parsedAquisitionProduct.contributionId,
		payment_id: parsedAquisitionProduct.paymentId,
		...parsedAquisitionProduct,
	};

	const acquisitionEventRows = [acquisitionEvent];
	console.log('Inserting rows... :', acquisitionEventRows);
	await bigQueryClient
		.dataset('datalake')
		.table('fact_acquisition_event')
		.insert(acquisitionEventRows);
	console.log('Inserted rows:', acquisitionEventRows);
};

export const handler = async (event: SQSEvent) => {
	const stage = getStage();
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	const bigQueryClient = createBigQueryClient(authClient, stage);
	exampleWriteToBigQuery(bigQueryClient, aquisitionProductDetail);
};
