import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
	CloudWatchClient,
	PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';

const cloudWatchClient = new CloudWatchClient({});
const stage = process.env.Stage ?? 'CODE';

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

// Regex to extract test results from the output
export const testResultsRegex = /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/;

export async function handler(event: { branch?: string }) {
	const workDir = path.join('/tmp', `run-${Date.now()}`);
	fs.mkdirSync(workDir);
	process.chdir(workDir);

	const branch = event.branch ?? 'main';
	const repoUrl = 'https://github.com/guardian/support-frontend.git';

	try {
		console.log(`Cloning repo (${branch})...`);
		execSync(`git clone --depth 1 --branch ${branch} ${repoUrl} .`, {
			stdio: 'inherit',
		});

		console.log('Installing...');
		execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });

		console.log('Running tests...');

		// add '2>&1' to the command to capture stderr (test summary) in the output
		const output = execSync('pnpm --filter support-workers run it-test 2>&1', {
			encoding: 'utf-8',
			stdio: 'pipe',
			env: { ...process.env, CI: 'true' },
			// eslint-disable-next-line no-control-regex -- strips ANSI color codes to make regex matching easier
		}).replace(/\u001b\[[0-9;]*m/g, '');

		console.log(`Test output: ${output}`);

		// Try to extract test results from the output
		const testResultsMatch = output.match(testResultsRegex);
		const testsSucceeded = testResultsMatch?.[1]
			? parseInt(testResultsMatch[1], 10)
			: 0;
		const testsTotal = testResultsMatch?.[2]
			? parseInt(testResultsMatch[2], 10)
			: 0;
		const testsFailed = testsTotal - testsSucceeded;

		console.log(
			`Tests succeeded: ${testsSucceeded}, failed: ${testsFailed}, total: ${testsTotal}`,
		);

		await putMetric('it-test-succeeded', testsSucceeded);
		await putMetric('it-test-failed', testsFailed);

		return { success: true, output };
	} catch (error) {
		console.error(error);
		await putMetric('it-test-failed', 99999);
		return {
			success: false,
		};
	} finally {
		// Clean up to keep /tmp from filling up on warm starts
		fs.rmSync(workDir, { recursive: true, force: true });
	}
}
