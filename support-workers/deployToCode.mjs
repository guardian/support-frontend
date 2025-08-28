import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
	LambdaClient,
	UpdateFunctionCodeCommand,
} from '@aws-sdk/client-lambda';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const S3_BUCKET = 'membership-dist';
const S3_KEY = 'support/CODE/support-workers-typescript/support-workers.zip';
const LAMBDA_FUNCTIONS = [
	'CreatePaymentMethodLambda',
	'CreateSalesforceContactLambda',
	'CreateZuoraSubscriptionTSLambda',
];

const s3Client = new S3Client({
	region: 'eu-west-1',
});

const lambdaClient = new LambdaClient({
	region: 'eu-west-1',
});

async function uploadToS3() {
	console.log(
		'Uploading target/typescript/support-workers.zip to S3 (to update the zipfile before upload use the `pnpm --filter support-workers package` command)',
	);

	const zipFilePath = join(__dirname, 'target/typescript/support-workers.zip');
	const fileStream = createReadStream(zipFilePath);

	const uploadCommand = new PutObjectCommand({
		Bucket: S3_BUCKET,
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

async function updateLambdaFunctions() {
	for (const functionName of LAMBDA_FUNCTIONS) {
		console.log(`Updating ${functionName}...`);

		const updateCommand = new UpdateFunctionCodeCommand({
			FunctionName: `support-${functionName}-CODE`,
			S3Bucket: S3_BUCKET,
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
		await uploadToS3();
		await updateLambdaFunctions();
		console.log('Deployment completed successfully');
	} catch (error) {
		console.error('Deployment failed:', error);
		process.exit(1);
	}
}

main();
