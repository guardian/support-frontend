// ----- Imports ----- //

import type { JSDOM } from 'jsdom';
import {
	AUDCountries,
	detect,
	EURCountries,
	fromCountryGroupName,
	GBPCountries,
	International,
	UnitedStates,
} from '../countryGroup';

// @ts-expect-error -- This is added to the global scope by the test setup
const jsdom = global.jsdom as JSDOM;

// ----- Tests ----- //

describe('detect countryGroup', () => {
	it('should return the correct country group from the path', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/uk',
		});
		expect(detect()).toEqual(GBPCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/us',
		});
		expect(detect()).toEqual(UnitedStates);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/au',
		});
		expect(detect()).toEqual(AUDCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		expect(detect()).toEqual(EURCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/int',
		});
		expect(detect()).toEqual(International);
	});

	it('should return the correct country group from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=GBPCountries',
		});
		expect(detect()).toEqual(GBPCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=UnitedStates',
		});
		expect(detect()).toEqual(UnitedStates);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=AUDCountries',
		});
		expect(detect()).toEqual(AUDCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=EURCountries',
		});
		expect(detect()).toEqual(EURCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=International',
		});
		expect(detect()).toEqual(International);
	});

	it('should return the correct country group from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=UK';
		expect(detect()).toEqual(GBPCountries);
		document.cookie = 'GU_country=GB';
		expect(detect()).toEqual(GBPCountries);
		document.cookie = 'GU_country=US';
		expect(detect()).toEqual(UnitedStates);
		document.cookie = 'GU_country=AU';
		expect(detect()).toEqual(AUDCountries);
		document.cookie = 'GU_country=FR';
		expect(detect()).toEqual(EURCountries);
		document.cookie = 'GU_country=CI';
		expect(detect()).toEqual(International);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=42',
		});
		document.cookie = 'GU_country=BR';
		expect(detect()).toEqual(International);
	});

	it('should return the correct country group from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=UK';
		expect(detect()).toEqual(GBPCountries);
		document.cookie = 'GU_geo_country=GB';
		expect(detect()).toEqual(GBPCountries);
		document.cookie = 'GU_geo_country=US';
		expect(detect()).toEqual(UnitedStates);
		document.cookie = 'GU_geo_country=AU';
		expect(detect()).toEqual(AUDCountries);
		document.cookie = 'GU_geo_country=FR';
		expect(detect()).toEqual(EURCountries);
		document.cookie = 'GU_geo_country=CI';
		expect(detect()).toEqual(International);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=42',
		});
		document.cookie = 'GU_geo_country=BR';
		expect(detect()).toEqual(International);
	});

	it('should return the GBPCountries by default', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(detect()).toEqual(GBPCountries);
	});

	it('should find the correct country group from the name', () => {
		expect(fromCountryGroupName('United Kingdom').name).toEqual(
			'United Kingdom',
		);
	});
});
