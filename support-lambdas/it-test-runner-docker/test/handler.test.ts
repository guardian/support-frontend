import * as fs from 'fs';
import * as path from 'path';
import { handler, testResultsRegex } from '../src/handler';

test('test runner lambda works', async () => {
	const result = await handler({ branch: 'rb/it-test-runner-docker2' });
	expect(result.success).toBe(true);
}, 300000); // increase timeout to 5 minutes

test('testNumber regex works', () => {
	const filePath = path.join(__dirname, 'output.txt');
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const testResults = fileContent.match(testResultsRegex);
	expect(testResults?.[1]).toBe('27');
	expect(testResults?.[2]).toBe('27');
});
