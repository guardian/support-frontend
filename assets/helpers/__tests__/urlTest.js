// @flow

// ----- Imports ----- //

import { addQueryParamsToURL, getAbsoluteURL } from '../url';


// ----- Tests ----- //

describe('url', () => {

  describe('addQueryParamsToURL', () => {

    it('should add a query param to an absolute URL', () => {

      const startingUrl = 'https://gu.com/index?hello=world';
      const params = { spam: 'eggs' };
      const expectedUrl = `${startingUrl}&spam=eggs`;

      expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);

    });

    it('should add multiple query params to an absolute URL', () => {

      const startingUrl = 'https://gu.com/index?hello=world';
      const params = { spam: 'eggs', answer: '42' };
      const expectedUrl = `${startingUrl}&spam=eggs&answer=42`;

      expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);

    });

    it('should add a query param to a relative URL', () => {

      const startingUrl = 'https://gu.com?hello=world';
      const params = { spam: 'eggs' };
      const expectedUrl = `${startingUrl}&spam=eggs`;

      expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);

    });

    it('should add multiple query params to a relative URL', () => {

      const startingUrl = '/index?hello=world';
      const params = { spam: 'eggs', answer: '42' };
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
      const params = { spam: 'eggs', answer: '42' };
      const expectedUrl = `${startingUrl}?spam=eggs&answer=42`;

      expect(addQueryParamsToURL(startingUrl, params)).toEqual(expectedUrl);

    });

  });

  describe('getAbsoluteURL', () => {

    it('should return the absolute URL if you call it without any path (with path in the original URL)', () => {
      const origin = 'https://support.theguardian.com';
      const path = 'uk';

      jsdom.reconfigure({
        url: `${origin}/${path}`,
      });

      expect(getAbsoluteURL()).toEqual(origin);
    });

    it('should return the absolute URL (including path) if you call it wit a path', () => {
      const origin = 'https://support.theguardian.com';
      const path = 'uk';
      const expectedURL = `${origin}/example`;

      jsdom.reconfigure({
        url: `${origin}/${path}`,
      });

      expect(getAbsoluteURL('/example')).toEqual(expectedURL);
    });

    it('should return the absolute URL if you call it without any path (no path in the original URL)', () => {
      const origin = 'https://support.theguardian.com/';
      const expected = 'https://support.theguardian.com';

      jsdom.reconfigure({
        url: `${origin}`,
      });

      expect(getAbsoluteURL()).toEqual(expected);
    });

    it('should return the absolute URL (including path) if you call it wit a path', () => {
      const origin = 'https://support.theguardian.com';
      const expectedURL = `${origin}/example`;

      jsdom.reconfigure({
        url: `${origin}`,
      });

      expect(getAbsoluteURL('/example')).toEqual(expectedURL);
    });
  });

});
