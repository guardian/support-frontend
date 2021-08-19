// @flow

// ----- Imports ----- //

import React from 'react';
import Page from 'components/page/page';
import { EmptyContributionFormContainer } from './components/ContributionFormContainer';
import { RoundelHeader } from 'components/headers/roundelHeader/header';
import { countryGroups } from 'helpers/internationalisation/countryGroup';

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

/**
 * This must be in a separate file (not contributionsLanding.jsx) because we do not want to initialise the redux store
 */
export function EmptyContributionsLandingPage() {

  // const key = "foo";
  // const cache = createCache({ key });
  // let cssText = "";
  // cache.sheet.insert = (rule) => {
  //   cssText += rule;
  // };

  return (
    <Page header={<RoundelHeader selectedCountryGroup={countryGroups.GBPCountries} />}>
      {/*<CacheProvider value={cache}>*/}
        <EmptyContributionFormContainer />
      {/*</CacheProvider>*/}
    </Page>
  );
}
