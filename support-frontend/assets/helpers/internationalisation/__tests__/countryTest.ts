// ----- Imports ----- //

import type { IsoCountry } from '@modules/internationalisation/country';
import {
	AUDCountries,
	EURCountries,
	GBPCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { JSDOM } from 'jsdom';
import { Country } from '../classes/country';

// @ts-expect-error -- This is added to the global scope by the test setup
const jsdom = global.jsdom as JSDOM;

// ----- Tests ----- //

describe('detect country', () => {
	it('should return, under eu case (path case), the correct country from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=FR',
		});
		expect(Country.detect()).toEqual('FR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=be',
		});
		expect(Country.detect()).toEqual('BE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=IE',
		});
		expect(Country.detect()).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=DE',
		});
		expect(Country.detect()).toEqual('DE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu?country=AR',
		});
		expect(Country.detect()).toEqual('DE');
	});

	it('should return, under eu case (path case), the correct country from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		document.cookie = 'GU_country=FR';
		expect(Country.detect()).toEqual('FR');
		document.cookie = 'GU_country=be';
		expect(Country.detect()).toEqual('BE');
		document.cookie = 'GU_country=IE';
		expect(Country.detect()).toEqual('IE');
		document.cookie = 'GU_country=DE';
		expect(Country.detect()).toEqual('DE');
		document.cookie = 'GU_country=AR';
		expect(Country.detect()).toEqual('DE');
	});

	it('should return, under eu case (path case), the correct country from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/eu',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(Country.detect()).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BE';
		expect(Country.detect()).toEqual('BE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=IE';
		expect(Country.detect()).toEqual('IE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=DE';
		expect(Country.detect()).toEqual('DE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AR';
		expect(Country.detect()).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from the query parameter', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=FR',
		});
		expect(Country.detect(EURCountries)).toEqual('FR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=be',
		});
		expect(Country.detect(EURCountries)).toEqual('BE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=IE',
		});
		expect(Country.detect(EURCountries)).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=DE',
		});
		expect(Country.detect(EURCountries)).toEqual('DE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=AR',
		});
		expect(Country.detect(EURCountries)).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from GU_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example',
		});
		document.cookie = 'GU_country=FR';
		expect(Country.detect(EURCountries)).toEqual('FR');
		document.cookie = 'GU_country=be';
		expect(Country.detect(EURCountries)).toEqual('BE');
		document.cookie = 'GU_country=IE';
		expect(Country.detect(EURCountries)).toEqual('IE');
		document.cookie = 'GU_country=DE';
		expect(Country.detect(EURCountries)).toEqual('DE');
		document.cookie = 'GU_country=AR';
		expect(Country.detect(EURCountries)).toEqual('DE');
	});

	it('should return, under eu case (country group), the correct country from GU_geo_country cookie', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(Country.detect(EURCountries)).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BE';
		expect(Country.detect(EURCountries)).toEqual('BE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=IE';
		expect(Country.detect(EURCountries)).toEqual('IE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=DE';
		expect(Country.detect(EURCountries)).toEqual('DE');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AR';
		expect(Country.detect(EURCountries)).toEqual('DE');
	});

	it('should return the correct country from the country group (non EU case)', () => {
		expect(Country.detect(GBPCountries)).toEqual('GB');
		expect(Country.detect(UnitedStates)).toEqual('US');
		expect(Country.detect(AUDCountries)).toEqual('AU');
	});

	it('should return the correct country from path (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/uk',
		});
		expect(Country.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/us',
		});
		expect(Country.detect()).toEqual('US');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/au',
		});
		expect(Country.detect()).toEqual('AU');
	});

	it('should return the correct country from query parameter (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=uk',
		});
		expect(Country.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=Gb',
		});
		expect(Country.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=BR',
		});
		expect(Country.detect()).toEqual('BR');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=IE',
		});
		expect(Country.detect()).toEqual('IE');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/example?country=uS',
		});
		expect(Country.detect()).toEqual('US');
	});

	it('should return the correct country from GU_country cookie (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=UK';
		expect(Country.detect()).toEqual('GB');
		document.cookie = 'GU_country=GB';
		expect(Country.detect()).toEqual('GB');
		document.cookie = 'GU_country=US';
		expect(Country.detect()).toEqual('US');
		document.cookie = 'GU_country=AU';
		expect(Country.detect()).toEqual('AU');
		document.cookie = 'GU_country=FR';
		expect(Country.detect()).toEqual('FR');
		document.cookie = 'GU_country=CI';
		expect(Country.detect()).toEqual('CI');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=BR';
		expect(Country.detect()).toEqual('BR');
	});

	it('should return the correct country from GU_geo_country cookie (non EU case)', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=UK';
		expect(Country.detect()).toEqual('GB');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=GB';
		document.cookie = 'GU_country=GB';
		expect(Country.detect()).toEqual('GB');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=US';
		expect(Country.detect()).toEqual('US');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=AU';
		expect(Country.detect()).toEqual('AU');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=FR';
		expect(Country.detect()).toEqual('FR');
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=CI';
		expect(Country.detect()).toEqual('CI');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=BR';
		expect(Country.detect()).toEqual('BR');
	});

	it('should return GB as default country', () => {
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(Country.detect()).toEqual('GB');
		jsdom.reconfigure({
			url: 'https://support.theguardian.com/examplePath?country=42',
		});
		document.cookie = 'GU_country=42';
		document.cookie = 'GU_geo_country=42';
		expect(Country.detect()).toEqual('GB');
	});
});

describe('find iso country', () => {
	it('should return the isoCountry for a country name as a string, if it is in the list of countries', () => {
		expect(Country.findIsoCountry('France')).toBe('FR');
	});

	it('should return null for a country name as a string that is not in the list of countries', () => {
		expect(Country.findIsoCountry('Simple And Coherent Land')).toBe(null);
	});
});

describe('find a state for a given country using stateProvinceFromString', () => {
	it('should return null if no country or state', () => {
		expect(Country.stateProvinceFromString(null)).toBe(null);
		expect(Country.stateProvinceFromString('US')).toBe(null);
		expect(Country.stateProvinceFromString('US', '')).toBe(null);
		expect(Country.stateProvinceFromString(null, 'NY')).toBe(null);
		expect(Country.stateProvinceFromString('' as IsoCountry, 'NY')).toBe(null);
	});

	it("should return the StateCode that's within a given country's set", () => {
		expect(Country.stateProvinceFromString('US', 'AL')).toBe('AL'); // Alabama

		expect(Country.stateProvinceFromString('CA', 'AL')).toBe(null); // No state called 'AL' in Canada

		expect(Country.stateProvinceFromString('AU', 'AL')).toBe(null); // No state called 'AL' in Australia

		expect(Country.stateProvinceFromString('US', 'AB')).toBe(null); // No state called 'AB' in USA

		expect(Country.stateProvinceFromString('CA', 'AB')).toBe('AB'); // Alberta

		expect(Country.stateProvinceFromString('AU', 'AB')).toBe(null); // No state called 'AB' in Australia

		expect(Country.stateProvinceFromString('US', 'NT')).toBe(null); // No state called 'NT' in USA

		expect(Country.stateProvinceFromString('CA', 'NT')).toBe('NT'); // Northwest Territories

		expect(Country.stateProvinceFromString('AU', 'NT')).toBe('NT'); // Northern Territory

		expect(Country.stateProvinceFromString('CA', 'ON')).toBe('ON'); // Ontario

		expect(Country.stateProvinceFromString('CA', 'Ontario')).toBe('ON'); // Ontario

		expect(Country.stateProvinceFromString('CA', 'YT')).toBe('YT'); // Yukon does not start with 2 letter code

		expect(Country.stateProvinceFromString('CA', 'Yukon')).toBe('YT');
	});
});
