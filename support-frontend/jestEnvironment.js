import TestEnvironment from 'jest-environment-jsdom-global';

// See: https://www.wheresrhys.co.uk/fetch-mock/docs/wrappers/jest#jsdom-compatibility

// eslint-disable-next-line import/no-default-export -- Jest needs this to be a default export
export default class CustomTestEnvironment extends TestEnvironment {
	async setup() {
		await super.setup();

		this.global.Request = Request;
		this.global.Response = Response;
		this.global.ReadableStream = ReadableStream;
	}
}
