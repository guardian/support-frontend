import { createReadStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
	LambdaClient,
	UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const S3_KEY = 'support/CODE/support-workers-typescript/support-workers.zip';
const LAMBDA_FUNCTIONS = [
	'CreatePaymentMethodLambda',
	'CreateSalesforceContactLambda',
	'CreateZuoraSubscriptionTSLambda',
	'SendThankYouEmailLambda',
	'UpdateSupporterProductDataLambda',
];

const ssmClient = new SSMClient({
	region: 'eu-west-1',
});

const s3Client = new S3Client({
	region: 'eu-west-1',
});

const lambdaClient = new LambdaClient({
	region: 'eu-west-1',
});

async function getS3BucketName() {
	const getParameterCommand = new GetParameterCommand({
		Name: '/account/services/artifact.bucket',
	});

	try {
		const result = await ssmClient.send(getParameterCommand);
		return result.Parameter?.Value;
	} catch (error) {
		console.error(
			'Error retrieving S3 bucket name from Parameter Store:',
			error,
		);
		throw error;
	}
}

async function uploadToS3(bucketName) {
	console.log('Uploading target/typescript/support-workers.zip to S3');

	const zipFilePath = join(__dirname, 'target/typescript/support-workers.zip');
	const fileStream = createReadStream(zipFilePath);

	const uploadCommand = new PutObjectCommand({
		Bucket: bucketName,
		Key: S3_KEY,
		Body: fileStream,
	});

	try {
		await s3Client.send(uploadCommand);
		console.log('Successfully uploaded to S3');
	} catch (error) {
		console.error('Error uploading to S3:', error);
		throw error;
	}
}

async function updateLambdaFunctions(bucketName) {
	for (const functionName of LAMBDA_FUNCTIONS) {
		console.log(`Updating ${functionName}...`);

		const updateCommand = new UpdateFunctionCodeCommand({
			FunctionName: `support-${functionName}-CODE`,
			S3Bucket: bucketName,
			S3Key: S3_KEY,
		});

		try {
			await lambdaClient.send(updateCommand);
			console.log(`Finished updating ${functionName}`);
		} catch (error) {
			console.error(`Error updating ${functionName}:`, error);
			throw error;
		}
	}
}

async function main() {
	try {
		const bucketName = await getS3BucketName();
		console.log(`Using S3 bucket: ${bucketName}`);

		await uploadToS3(bucketName);
		await updateLambdaFunctions(bucketName);
		console.log('Deployment completed successfully');
	} catch (error) {
		console.error('Deployment failed:', error);
		process.exit(1);
	}
}

await main();
