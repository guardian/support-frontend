// ----- Imports ----- //

import type { JSDOM } from 'jsdom';
import { CountryGroupHelper } from '../classes/countryGroup';
import {
	AUDCountries,
	EURCountries,
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
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/us',
		});
		expect(CountryGroupHelper.detect()).toEqual(UnitedStates);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/au',
		});
		expect(CountryGroupHelper.detect()).toEqual(AUDCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		expect(CountryGroupHelper.detect()).toEqual(EURCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/int',
		});
		expect(CountryGroupHelper.detect()).toEqual(International);
	});

	it('should return the correct country group from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=GBPCountries',
		});
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=UnitedStates',
		});
		expect(CountryGroupHelper.detect()).toEqual(UnitedStates);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=AUDCountries',
		});
		expect(CountryGroupHelper.detect()).toEqual(AUDCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=EURCountries',
		});
		expect(CountryGroupHelper.detect()).toEqual(EURCountries);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=International',
		});
		expect(CountryGroupHelper.detect()).toEqual(International);
	});

	it('should return the correct country group from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=UK';
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		document.cookie = 'GU_country=GB';
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		document.cookie = 'GU_country=US';
		expect(CountryGroupHelper.detect()).toEqual(UnitedStates);
		document.cookie = 'GU_country=AU';
		expect(CountryGroupHelper.detect()).toEqual(AUDCountries);
		document.cookie = 'GU_country=FR';
		expect(CountryGroupHelper.detect()).toEqual(EURCountries);
		document.cookie = 'GU_country=CI';
		expect(CountryGroupHelper.detect()).toEqual(International);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=42',
		});
		document.cookie = 'GU_country=BR';
		expect(CountryGroupHelper.detect()).toEqual(International);
	});

	it('should return the correct country group from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=UK';
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		document.cookie = 'GU_geo_country=GB';
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
		document.cookie = 'GU_geo_country=US';
		expect(CountryGroupHelper.detect()).toEqual(UnitedStates);
		document.cookie = 'GU_geo_country=AU';
		expect(CountryGroupHelper.detect()).toEqual(AUDCountries);
		document.cookie = 'GU_geo_country=FR';
		expect(CountryGroupHelper.detect()).toEqual(EURCountries);
		document.cookie = 'GU_geo_country=CI';
		expect(CountryGroupHelper.detect()).toEqual(International);
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?countryGroup=42',
		});
		document.cookie = 'GU_geo_country=BR';
		expect(CountryGroupHelper.detect()).toEqual(International);
	});

	it('should return the GBPCountries by default', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(CountryGroupHelper.detect()).toEqual(GBPCountries);
	});

	it('should find the correct country group from the name', () => {
		expect(
			CountryGroupHelper.fromCountryGroupName('United Kingdom').name,
		).toEqual('United Kingdom');
	});
});
