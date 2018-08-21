// @flow

// ----- Imports ----- //

import React from 'react';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect } from 'helpers/internationalisation/countryGroup';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { contributionSelectionActionsFor } from 'components/contributionSelection/contributionSelectionActions';
import HorizontalLandingLayout from './pagesVersions/horizontalLayoutLandingPage';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));


const reactElementId: {
  [CountryGroupId]: string
} = {
  GBPCountries: 'contributions-landing-page-uk',
  EURCountries: 'contributions-landing-page-eu',
  UnitedStates: 'contributions-landing-page-us',
  AUDCountries: 'contributions-landing-page-au',
  International: 'contributions-landing-page-int',
  NZDCountries: 'contributions-landing-page-nz',
  Canada: 'contributions-landing-page-ca',
};


// ----- Render ----- //

const content = <HorizontalLandingLayout store={store} countryGroupId={countryGroupId} />;

renderPage(content, reactElementId[countryGroupId]);


const annualTestVariant = store.getState().common.abParticipations.annualContributionsRoundTwo;
if (annualTestVariant === 'higherAmounts' && (countryGroupId === 'NZDCountries' || countryGroupId === 'AUDCountries')) {
  store.dispatch(contributionSelectionActionsFor('CONTRIBUTE_SECTION').setAmountForContributionType('ANNUAL', 100));
}
