// @flow

// ----- Imports ----- //

import { addQueryParamsToURL } from '../url';


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

});
