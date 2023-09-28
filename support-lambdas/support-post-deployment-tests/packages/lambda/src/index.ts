import { readdir } from 'node:fs/promises';
import { getConfig } from './config';

export async function main() {
	const { stage, app } = getConfig();
	const msg = `Hello from ${app} in ${stage}! The time is ${new Date().toString()}`;
	console.log(msg);

	console.log('Current directory:', __dirname);

	try {
		const files = await readdir(__dirname);
		for (const file of files) console.log(file);
	} catch (err) {
		console.error(err);
	}

	return Promise.resolve(msg);
}
