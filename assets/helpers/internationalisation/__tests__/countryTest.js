// @flow

// ----- Imports ----- //

import { detect } from '../country';


// ----- Tests ----- //

describe('detect country', () => {

  it('should return, under eu case (path case), the correct country from the query parameter', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu?country=FR',
    });
    expect(detect()).toEqual('FR');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu?country=be',
    });
    expect(detect()).toEqual('BE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu?country=IE',
    });
    expect(detect()).toEqual('IE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu?country=DE',
    });
    expect(detect()).toEqual('DE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu?country=AR',
    });
    expect(detect()).toEqual('DE');
  });

  it('should return, under eu case (path case), the correct country from GU_country cookie', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu',
    });
    document.cookie = 'GU_country=FR';
    expect(detect()).toEqual('FR');

    document.cookie = 'GU_country=be';
    expect(detect()).toEqual('BE');

    document.cookie = 'GU_country=IE';
    expect(detect()).toEqual('IE');

    document.cookie = 'GU_country=DE';
    expect(detect()).toEqual('DE');

    document.cookie = 'GU_country=AR';
    expect(detect()).toEqual('DE');
  });

  it('should return, under eu case (path case), the correct country from GU_geo_country cookie', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/eu',
    });
    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=FR';
    expect(detect()).toEqual('FR');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=BE';
    expect(detect()).toEqual('BE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=IE';
    expect(detect()).toEqual('IE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=DE';
    expect(detect()).toEqual('DE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=AR';
    expect(detect()).toEqual('DE');
  });

  it('should return, under eu case (country group), the correct country from the query parameter', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=FR',
    });
    expect(detect('EURCountries')).toEqual('FR');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=be',
    });
    expect(detect('EURCountries')).toEqual('BE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=IE',
    });
    expect(detect('EURCountries')).toEqual('IE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=DE',
    });
    expect(detect('EURCountries')).toEqual('DE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=AR',
    });
    expect(detect('EURCountries')).toEqual('DE');
  });

  it('should return, under eu case (country group), the correct country from GU_country cookie', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example',
    });
    document.cookie = 'GU_country=FR';
    expect(detect('EURCountries')).toEqual('FR');

    document.cookie = 'GU_country=be';
    expect(detect('EURCountries')).toEqual('BE');

    document.cookie = 'GU_country=IE';
    expect(detect('EURCountries')).toEqual('IE');

    document.cookie = 'GU_country=DE';
    expect(detect('EURCountries')).toEqual('DE');

    document.cookie = 'GU_country=AR';
    expect(detect('EURCountries')).toEqual('DE');
  });

  it('should return, under eu case (country group), the correct country from GU_geo_country cookie', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example',
    });
    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=FR';
    expect(detect('EURCountries')).toEqual('FR');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=BE';
    expect(detect('EURCountries')).toEqual('BE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=IE';
    expect(detect('EURCountries')).toEqual('IE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=DE';
    expect(detect('EURCountries')).toEqual('DE');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=AR';
    expect(detect('EURCountries')).toEqual('DE');
  });

  it('should return the correct country from the country group (non EU case)', () => {
    expect(detect('GBPCountries')).toEqual('GB');
    expect(detect('UnitedStates')).toEqual('US');
    expect(detect('AUDCountries')).toEqual('AU');
  });

  it('should return the correct country from path (non EU case)', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/uk',
    });
    expect(detect()).toEqual('GB');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/us',
    });
    expect(detect()).toEqual('US');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/au',
    });
    expect(detect()).toEqual('AU');
  });

  it('should return the correct country from query parameter (non EU case)', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=uk',
    });
    expect(detect()).toEqual('GB');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=Gb',
    });
    expect(detect()).toEqual('GB');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=BR',
    });
    expect(detect()).toEqual('BR');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=IE',
    });
    expect(detect()).toEqual('IE');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/example?country=uS',
    });
    expect(detect()).toEqual('US');
  });

  it('should return the correct country from GU_country cookie (non EU case)', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath',
    });

    document.cookie = 'GU_country=UK';
    expect(detect()).toEqual('GB');

    document.cookie = 'GU_country=GB';
    expect(detect()).toEqual('GB');

    document.cookie = 'GU_country=US';
    expect(detect()).toEqual('US');

    document.cookie = 'GU_country=AU';
    expect(detect()).toEqual('AU');

    document.cookie = 'GU_country=FR';
    expect(detect()).toEqual('FR');

    document.cookie = 'GU_country=CI';
    expect(detect()).toEqual('CI');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath?country=42',
    });
    document.cookie = 'GU_country=BR';
    expect(detect()).toEqual('BR');
  });

  it('should return the correct country from GU_geo_country cookie (non EU case)', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath',
    });

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=UK';
    expect(detect()).toEqual('GB');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=GB';
    document.cookie = 'GU_country=GB';
    expect(detect()).toEqual('GB');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=US';
    expect(detect()).toEqual('US');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=AU';
    expect(detect()).toEqual('AU');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=FR';
    expect(detect()).toEqual('FR');

    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=CI';
    expect(detect()).toEqual('CI');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath?country=42',
    });
    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=BR';
    expect(detect()).toEqual('BR');
  });

  it('should return GB as default country', () => {

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath',
    });
    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=42';
    expect(detect()).toEqual('GB');

    jsdom.reconfigure({
      url: 'https://support.theguardian.com/examplePath?country=42',
    });
    document.cookie = 'GU_country=42';
    document.cookie = 'GU_geo_country=42';
    expect(detect()).toEqual('GB');
  });
});

