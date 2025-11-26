// ----- Imports ----- //

import type { JSDOM } from 'jsdom';
import {
	addQueryParamsToURL,
	getAllQueryParams,
	getAllQueryParamsWithExclusions,
	getOriginAndForceSubdomain,
	getPaperOrigin,
} from '../urls/url';

// ----- Tests ----- //

// @ts-expect-error -- This is added to the global scope by the test setup
const jsdom = global.jsdom as JSDOM;

describe('url', () => {
	describe('addQueryParamsToURL', () => {
		it('should add a query param to an absolute URL', () => {
			const startingUrl = 'https://www.theguardian.com/index?hello=world';
			const params = {
				spam: 'eggs',
			};
			const expectedUrl = `${startingUrl}&spam=eggs`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should add a query param to an absolute URL [undefined case]', () => {
			const startingUrl = 'https:///www.theguardian.com/index?hello=world';
			const params = {
				spam: 'eggs',
				homer: undefined,
			};
			const expectedUrl = `${startingUrl}&spam=eggs`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should add multiple query params to an absolute URL', () => {
			const startingUrl = 'https:///www.theguardian.com/index?hello=world';
			const params = {
				spam: 'eggs',
				answer: '42',
			};
			const expectedUrl = `${startingUrl}&spam=eggs&answer=42`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should add multiple query params to an absolute URL [null case]', () => {
			const startingUrl = 'https:///www.theguardian.com/index?hello=world';
			const params = {
				spam: 'eggs',
				homer: null,
				answer: '42',
			};
			const expectedUrl = `${startingUrl}&spam=eggs&answer=42`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should add a query param to a relative URL', () => {
			const startingUrl = 'https:///www.theguardian.com?hello=world';
			const params = {
				spam: 'eggs',
			};
			const expectedUrl = `${startingUrl}&spam=eggs`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should not change a URL with null params', () => {
			const startingUrl = 'https:///www.theguardian.com?hello=world';
			const params = {
				spam: null,
			};
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(startingUrl);
		});

		it('should add multiple query params to a relative URL', () => {
			const startingUrl = '/index?hello=world';
			const params = {
				spam: 'eggs',
				answer: '42',
			};
			const expectedUrl = `${startingUrl}&spam=eggs&answer=42`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});

		it('should return the existing URL if no params are passed', () => {
			const startingUrl = '/index?hello=world';
			const params = {};
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(startingUrl);
		});

		it('should add params if none exist', () => {
			const startingUrl = 'https://gu.com/index';
			const params = {
				spam: 'eggs',
				answer: '42',
			};
			const expectedUrl = `${startingUrl}?spam=eggs&answer=42`;
			expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);
		});
	});

	describe('getAllQueryParams', () => {
		const baseUrl = 'https://support.thegulocal.com/uk';

		it('should return an array of query params', () => {
			jsdom.reconfigure({
				url: `${baseUrl}?foo=bar&spam=eggs`,
			});
			expect(getAllQueryParams()).toEqual([
				['foo', 'bar'],
				['spam', 'eggs'],
			]);
		});

		it('should return an empty array if there are no params', () => {
			jsdom.reconfigure({
				url: `${baseUrl}`,
			});
			expect(getAllQueryParams()).toEqual([]);
			jsdom.reconfigure({
				url: `${baseUrl}?`,
			});
			expect(getAllQueryParams()).toEqual([]);
		});

		it('should ignore malformed params', () => {
			jsdom.reconfigure({
				url: `${baseUrl}?foo&spam=eggs`,
			});
			expect(getAllQueryParams()).toEqual([['spam', 'eggs']]);
		});
	});

	describe('getAllQueryParamsWithExclusions', () => {
		const baseUrl = 'https://support.thegulocal.com/uk';
		it('should exclude query params', () => {
			jsdom.reconfigure({
				url: `${baseUrl}?foo=bar&spam=eggs`,
			});
			expect(getAllQueryParamsWithExclusions(['foo'])).toEqual([
				['spam', 'eggs'],
			]);
		});
	});

	describe('getPaperOrigin', () => {
		it('should return Observer origin for Sunday paper', () => {
			jsdom.reconfigure({
				url: `https://support.thegulocal.com/uk/subscribe/paper`,
			});

			expect(getPaperOrigin('Sunday')).toBe('https://observer.thegulocal.com');
		});
		it('should return Guardian origin for Everyday paper', () => {
			jsdom.reconfigure({
				url: `https://support.thegulocal.com/uk/subscribe/paper`,
			});
			expect(getPaperOrigin('Everyday')).toBe('https://support.thegulocal.com');
		});
	});

	describe('getOriginAndForceSubdomain', () => {
		it('returns the current origin with the subdomain specified', () => {
			jsdom.reconfigure({
				url: `https://observer.theguardian.com/uk/subscribe/paper`,
			});

			expect(getOriginAndForceSubdomain('support')).toBe(
				'https://support.theguardian.com',
			);
		});
	});
});
