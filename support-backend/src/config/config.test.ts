import { parseConfig } from './config';

const basePath = '/CODE/support/support-backend';

describe('parseConfig', () => {
	it('maps SSM parameter paths to a typed nested config', () => {
		const params = [
			{ Name: `${basePath}/ideal-postcodes-api/key`, Value: 'ideal-key' },
			{ Name: `${basePath}/paper-round-api/key`, Value: 'paper-key' },
			{
				Name: `${basePath}/paper-round-api/url`,
				Value: 'https://paper.example',
			},
		];

		const config = parseConfig(basePath, params);

		expect(config).toEqual({
			idealPostcodesApi: { key: 'ideal-key' },
			paperRoundApi: { key: 'paper-key', url: 'https://paper.example' },
		});
	});

	it('ignores parameters that are not part of the schema', () => {
		const params = [
			{ Name: `${basePath}/ideal-postcodes-api/key`, Value: 'ideal-key' },
			{ Name: `${basePath}/paper-round-api/key`, Value: 'paper-key' },
			{
				Name: `${basePath}/paper-round-api/url`,
				Value: 'https://paper.example',
			},
			{ Name: `${basePath}/something-else/value`, Value: 'x' },
			{ Name: `${basePath}/legacy.key`, Value: 'x' },
		];

		const config = parseConfig(basePath, params);

		expect(config).not.toHaveProperty('somethingElse');
	});

	it('throws when a required parameter is missing', () => {
		const params = [
			{ Name: `${basePath}/ideal-postcodes-api/key`, Value: 'ideal-key' },
			{ Name: `${basePath}/paper-round-api/key`, Value: 'paper-key' },
		];

		expect(() => parseConfig(basePath, params)).toThrow(/paperRoundApi/);
	});
});
