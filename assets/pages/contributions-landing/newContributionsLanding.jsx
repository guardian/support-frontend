// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));


const reactElementId: {
  [CountryGroupId]: string
} = {
  GBPCountries: 'new-contributions-landing-page-uk',
  EURCountries: 'new-contributions-landing-page-eu',
  UnitedStates: 'new-contributions-landing-page-us',
  AUDCountries: 'new-contributions-landing-page-au',
  International: 'new-contributions-landing-page-int',
  NZDCountries: 'new-contributions-landing-page-nz',
  Canada: 'new-contributions-landing-page-ca',
};

// ----- Internationalisation ----- //

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a monthly commitment to support The Guardian long term or a one-off contribution 
  as and when you feel like it – choose the option that suits you best.
`;

const countryGroupSpecificDetails: {
  [CountryGroupId]: {headerCopy: string, contributeCopy: string}
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
  },
};


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page header={<header />} footer={<footer />}>
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
