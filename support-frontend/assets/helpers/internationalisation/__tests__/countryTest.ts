// ----- Imports ----- //

import type { JSDOM } from 'jsdom';
import { CountryHelper } from '../classes/country';
import type { IsoCountry } from '../country';
import {
	AUDCountries,
	EURCountries,
	GBPCountries,
	UnitedStates,
} from '../countryGroup';

// @ts-expect-error -- This is added to the global scope by the test setup
const jsdom = global.jsdom as JSDOM;

// ----- Tests ----- //

describe('detect country', () => {
	it('should return, under eu case (path case), the correct country from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=FR',
		});
		expect(CountryHelper.detect()).toEqual('FR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=be',
		});
		expect(CountryHelper.detect()).toEqual('BE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=IE',
		});
		expect(CountryHelper.detect()).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=DE',
		});
		expect(CountryHelper.detect()).toEqual('DE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=AR',
		});
		expect(CountryHelper.detect()).toEqual('DE');
	});

	it('should return, under eu case (path case), the correct country from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		document.cookie = 'GU_country=FR';
		expect(CountryHelper.detect()).toEqual('FR');
		document.cookie = 'GU_country=be';
		expect(CountryHelper.detect()).toEqual('BE');
		document.cookie = 'GU_country=IE';
		expect(CountryHelper.detect()).toEqual('IE');
		document.cookie = 'GU_country=DE';
		expect(CountryHelper.detect()).toEqual('DE');
		document.cookie = 'GU_country=AR';
		expect(CountryHelper.detect()).toEqual('DE');
	});

	it('should return, under eu case (path case), the correct country from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(CountryHelper.detect()).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BE';
		expect(CountryHelper.detect()).toEqual('BE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=IE';
		expect(CountryHelper.detect()).toEqual('IE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=DE';
		expect(CountryHelper.detect()).toEqual('DE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AR';
		expect(CountryHelper.detect()).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=FR',
		});
		expect(CountryHelper.detect(EURCountries)).toEqual('FR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=be',
		});
		expect(CountryHelper.detect(EURCountries)).toEqual('BE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=IE',
		});
		expect(CountryHelper.detect(EURCountries)).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=DE',
		});
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=AR',
		});
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example',
		});
		document.cookie = 'GU_country=FR';
		expect(CountryHelper.detect(EURCountries)).toEqual('FR');
		document.cookie = 'GU_country=be';
		expect(CountryHelper.detect(EURCountries)).toEqual('BE');
		document.cookie = 'GU_country=IE';
		expect(CountryHelper.detect(EURCountries)).toEqual('IE');
		document.cookie = 'GU_country=DE';
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
		document.cookie = 'GU_country=AR';
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(CountryHelper.detect(EURCountries)).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BE';
		expect(CountryHelper.detect(EURCountries)).toEqual('BE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=IE';
		expect(CountryHelper.detect(EURCountries)).toEqual('IE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=DE';
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AR';
		expect(CountryHelper.detect(EURCountries)).toEqual('DE');
	});

	it('should return the correct country from the country group (non EU case)', () => {
		expect(CountryHelper.detect(GBPCountries)).toEqual('GB');
		expect(CountryHelper.detect(UnitedStates)).toEqual('US');
		expect(CountryHelper.detect(AUDCountries)).toEqual('AU');
	});

	it('should return the correct country from path (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/uk',
		});
		expect(CountryHelper.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/us',
		});
		expect(CountryHelper.detect()).toEqual('US');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/au',
		});
		expect(CountryHelper.detect()).toEqual('AU');
	});

	it('should return the correct country from query parameter (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=uk',
		});
		expect(CountryHelper.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=Gb',
		});
		expect(CountryHelper.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=BR',
		});
		expect(CountryHelper.detect()).toEqual('BR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=IE',
		});
		expect(CountryHelper.detect()).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=uS',
		});
		expect(CountryHelper.detect()).toEqual('US');
	});

	it('should return the correct country from GU_country cookie (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=UK';
		expect(CountryHelper.detect()).toEqual('GB');
		document.cookie = 'GU_country=GB';
		expect(CountryHelper.detect()).toEqual('GB');
		document.cookie = 'GU_country=US';
		expect(CountryHelper.detect()).toEqual('US');
		document.cookie = 'GU_country=AU';
		expect(CountryHelper.detect()).toEqual('AU');
		document.cookie = 'GU_country=FR';
		expect(CountryHelper.detect()).toEqual('FR');
		document.cookie = 'GU_country=CI';
		expect(CountryHelper.detect()).toEqual('CI');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=BR';
		expect(CountryHelper.detect()).toEqual('BR');
	});

	it('should return the correct country from GU_geo_country cookie (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=UK';
		expect(CountryHelper.detect()).toEqual('GB');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=GB';
		document.cookie = 'GU_country=GB';
		expect(CountryHelper.detect()).toEqual('GB');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=US';
		expect(CountryHelper.detect()).toEqual('US');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AU';
		expect(CountryHelper.detect()).toEqual('AU');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(CountryHelper.detect()).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=CI';
		expect(CountryHelper.detect()).toEqual('CI');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BR';
		expect(CountryHelper.detect()).toEqual('BR');
	});

	it('should return GB as default country', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(CountryHelper.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(CountryHelper.detect()).toEqual('GB');
	});
});

describe('find iso country', () => {
	it('should return the isoCountry for a country name as a string, if it is in the list of countries', () => {
		expect(CountryHelper.findIsoCountry('France')).toBe('FR');
	});

	it('should return null for a country name as a string that is not in the list of countries', () => {
		expect(CountryHelper.findIsoCountry('Simple And Coherent Land')).toBe(null);
	});
});

describe('find a state for a given country using stateProvinceFromString', () => {
	it('should return null if no country or state', () => {
		expect(CountryHelper.stateProvinceFromString(null)).toBe(null);
		expect(CountryHelper.stateProvinceFromString('US')).toBe(null);
		expect(CountryHelper.stateProvinceFromString('US', '')).toBe(null);
		expect(CountryHelper.stateProvinceFromString(null, 'NY')).toBe(null);
		expect(CountryHelper.stateProvinceFromString('' as IsoCountry, 'NY')).toBe(
			null,
		);
	});

	it("should return the StateCode that's within a given country's set", () => {
		expect(CountryHelper.stateProvinceFromString('US', 'AL')).toBe('AL'); // Alabama

		expect(CountryHelper.stateProvinceFromString('CA', 'AL')).toBe(null); // No state called 'AL' in Canada

		expect(CountryHelper.stateProvinceFromString('AU', 'AL')).toBe(null); // No state called 'AL' in Australia

		expect(CountryHelper.stateProvinceFromString('US', 'AB')).toBe(null); // No state called 'AB' in USA

		expect(CountryHelper.stateProvinceFromString('CA', 'AB')).toBe('AB'); // Alberta

		expect(CountryHelper.stateProvinceFromString('AU', 'AB')).toBe(null); // No state called 'AB' in Australia

		expect(CountryHelper.stateProvinceFromString('US', 'NT')).toBe(null); // No state called 'NT' in USA

		expect(CountryHelper.stateProvinceFromString('CA', 'NT')).toBe('NT'); // Northwest Territories

		expect(CountryHelper.stateProvinceFromString('AU', 'NT')).toBe('NT'); // Northern Territory

		expect(CountryHelper.stateProvinceFromString('CA', 'ON')).toBe('ON'); // Ontario

		expect(CountryHelper.stateProvinceFromString('CA', 'Ontario')).toBe('ON'); // Ontario

		expect(CountryHelper.stateProvinceFromString('CA', 'YT')).toBe('YT'); // Yukon does not start with 2 letter code

		expect(CountryHelper.stateProvinceFromString('CA', 'Yukon')).toBe('YT');
	});
});
