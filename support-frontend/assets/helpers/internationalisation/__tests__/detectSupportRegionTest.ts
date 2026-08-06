// ----- Imports ----- //

import type { JSDOM } from 'jsdom';
import { DetectSupportRegion } from '../classes/detectSupportRegion';

// @ts-expect-error -- This is added to the global scope by the test setup
const jsdom = global.jsdom as JSDOM;

// ----- Tests ----- //

describe('detect supportRegion', () => {
	it('should return the correct support region id from the path', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/uk',
		});
		expect(DetectSupportRegion.detect()).toEqual('uk');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/us',
		});
		expect(DetectSupportRegion.detect()).toEqual('us');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/au',
		});
		expect(DetectSupportRegion.detect()).toEqual('au');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		expect(DetectSupportRegion.detect()).toEqual('eu');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/int',
		});
		expect(DetectSupportRegion.detect()).toEqual('int');
	});

	it('should return the correct country group from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=UK';
		expect(DetectSupportRegion.detect()).toEqual('uk');
		document.cookie = 'GU_country=GB';
		expect(DetectSupportRegion.detect()).toEqual('uk');
		document.cookie = 'GU_country=US';
		expect(DetectSupportRegion.detect()).toEqual('us');
		document.cookie = 'GU_country=AU';
		expect(DetectSupportRegion.detect()).toEqual('au');
		document.cookie = 'GU_country=FR';
		expect(DetectSupportRegion.detect()).toEqual('eu');
		document.cookie = 'GU_country=CI';
		expect(DetectSupportRegion.detect()).toEqual('int');
	});

	it('should return the correct country group from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=UK';
		expect(DetectSupportRegion.detect()).toEqual('uk');
		document.cookie = 'GU_geo_country=GB';
		expect(DetectSupportRegion.detect()).toEqual('uk');
		document.cookie = 'GU_geo_country=US';
		expect(DetectSupportRegion.detect()).toEqual('us');
		document.cookie = 'GU_geo_country=AU';
		expect(DetectSupportRegion.detect()).toEqual('au');
		document.cookie = 'GU_geo_country=FR';
		expect(DetectSupportRegion.detect()).toEqual('eu');
		document.cookie = 'GU_geo_country=CI';
		expect(DetectSupportRegion.detect()).toEqual('int');
		document.cookie = 'GU_geo_country=BR';
		expect(DetectSupportRegion.detect()).toEqual('int');
	});

	it('should return the GBPCountries by default', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(DetectSupportRegion.detect()).toEqual('uk');
	});
});
