import { getStage } from './stage';
import { buildAuthClient, createBigQueryClient } from './bigQuery';
import { BigQuery } from '@google-cloud/bigquery';
import { getGCPCredentialsFromSSM } from './ssm';
import type { SQSEvent } from 'aws-lambda';
import {
	AcquisitionProductDetail,
	aquisitionProductDetail,
	AcquisitionProductSchemaRelabel,
	AcquisitionProductSchemaKeep,
	// existingQuery,
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
	const parsedAquisitionProductRelabel = AcquisitionProductSchemaRelabel.parse(
		aquisitionProductDetail,
	);
	const parsedAquisitionProduct = AcquisitionProductSchemaKeep.parse(
		aquisitionProductDetail,
	);
	const acquisitionEvent = {
		event_timestamp: parsedAquisitionProductRelabel.eventTimeStamp,
		// amount_in_gbp: null,
		// annualised_value: null,
		country_code: parsedAquisitionProductRelabel.country,
		component_id: parsedAquisitionProductRelabel.componentId,
		component_type: parsedAquisitionProductRelabel.componentType,
		campaign_codes: parsedAquisitionProductRelabel.campaignCodes,
		// device_type: null,
		// total_visit_days: null,
		// average_days_between_recent_visits: null,
		// regular: null,
		referrer_url: parsedAquisitionProductRelabel.referrerUrl,
		ab_tests: parsedAquisitionProductRelabel.abTests,
		payment_frequency: parsedAquisitionProductRelabel.paymentFrequency,
		payment_provider: parsedAquisitionProductRelabel.paymentProvider,
		print_options: parsedAquisitionProductRelabel.printOptions,
		browser_id: parsedAquisitionProductRelabel.browserId,
		identity_id: parsedAquisitionProductRelabel.identityId,
		page_view_id: parsedAquisitionProductRelabel.pageViewId,
		referrer_page_view_id: parsedAquisitionProductRelabel.referrerPageViewId,
		// received_timestamp: null,
		promo_code: parsedAquisitionProductRelabel.promoCode,
		// discount_percentage: null,
		// discount_length_in_months: null,
		// annualised_value_in_gbp: null,
		// received_date: null,
		// meta_created_at: null,
		// meta_produced_at: null,
		query_parameters: parsedAquisitionProductRelabel.queryParameters,
		reused_existing_payment_method:
			parsedAquisitionProductRelabel.reusedExistingPaymentMethod,
		acquisition_type: parsedAquisitionProductRelabel.acquisitionType,
		reader_type: parsedAquisitionProductRelabel.readerType,
		zuora_subscription_number:
			parsedAquisitionProductRelabel.zuoraSubscriptionNumber,
		// zuora_account_number: null,
		contribution_id: parsedAquisitionProductRelabel.contributionId,
		payment_id: parsedAquisitionProductRelabel.paymentId,
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
