import { execSync } from 'child_process';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import type { Handler } from 'aws-lambda';

const cloudWatchClient = new CloudWatchClient({});
const stage = process.env.Stage ?? 'CODE';

interface TestResult {
	success: boolean;
	testsSucceeded: number;
	testsFailed: number;
	output: string;
}

async function putMetric(metricName: string, value: number): Promise<void> {
	const command = new PutMetricDataCommand({
		Namespace: 'support-frontend',
		MetricData: [
			{
				MetricName: metricName,
				Value: value,
				Unit: 'Count',
				Dimensions: [
					{
						Name: 'Stage',
						Value: stage,
					},
				],
			},
		],
	});

	await cloudWatchClient.send(command);
}

function runTests(): TestResult {
	try {
		console.log('Starting IT tests...');
		console.log('Current working directory:', process.cwd());
		console.log('Environment:', JSON.stringify(process.env, null, 2));

		// Change to the support-workers directory
		const workDir = '/var/task/support-workers';
		console.log('Changing to directory:', workDir);

		// Run the tests - this will throw if tests fail
		const output = execSync('cd /var/task && pnpm --filter support-workers it-test', {
			encoding: 'utf-8',
			stdio: 'pipe',
			maxBuffer: 10 * 1024 * 1024, // 10MB buffer
			env: {
				...process.env,
				NODE_ENV: 'test',
				CI: 'true',
			},
		});

		console.log('Test output:', output);

		// Parse the Jest output to extract test counts
		// Jest typically outputs something like "Tests: 5 passed, 5 total"
		const passedMatch = output.match(/(\d+)\s+passed/);
		const testsSucceeded = passedMatch ? parseInt(passedMatch[1], 10) : 0;

		return {
			success: true,
			testsSucceeded,
			testsFailed: 0,
			output,
		};
	} catch (error) {
		// execSync throws on non-zero exit code
		console.error('Test execution failed:', error);

		const output = error instanceof Error && 'stdout' in error
			? String(error.stdout)
			: '';
		const stderr = error instanceof Error && 'stderr' in error
			? String(error.stderr)
			: '';

		console.log('Test output:', output);
		console.error('Test errors:', stderr);

		// Try to parse failure count from output
		const failedMatch = output.match(/(\d+)\s+failed/);
		const testsFailed = failedMatch ? parseInt(failedMatch[1], 10) : 1;

		return {
			success: false,
			testsSucceeded: 0,
			testsFailed,
			output: output + '\n' + stderr,
		};
	}
}

export const handler: Handler = async (event) => {
	console.log('IT Test Runner Lambda started');
	console.log('Stage:', stage);
	console.log('Event:', JSON.stringify(event));

	try {
		const result = runTests();

		if (result.success) {
			console.log(`All tests passed! ${result.testsSucceeded} tests succeeded`);
			await putMetric('it-test-succeeded', result.testsSucceeded);
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: 'Tests completed successfully',
					testsSucceeded: result.testsSucceeded,
				}),
			};
		} else {
			console.error(`Tests failed! ${result.testsFailed} tests failed`);
			await putMetric('it-test-failed', result.testsFailed);
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: 'Tests failed',
					testsFailed: result.testsFailed,
				}),
			};
		}
	} catch (error) {
		console.error('Unexpected error running tests:', error);
		await putMetric('it-test-failed', 999999);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Unexpected error running tests',
				error: error instanceof Error ? error.message : String(error),
			}),
		};
	}
};
