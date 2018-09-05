// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import { type IsoCurrency, detect as detectCurrency } from 'helpers/internationalisation/currency';
import * as user from 'helpers/user/user';

import GridImage from 'components/gridImage/gridImage';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';
import SvgContributionsBgMobile from 'components/svgs/contributionsBgMobile';
import SvgContributionsBgDesktop from 'components/svgs/contributionsBgDesktop';

import { NewHeader } from 'components/headers/new-header/Header';
import { NewContributionForm } from './components/ContributionForm';

import { initReducer } from './contributionsLandingReducer';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();
const currency: IsoCurrency = detectCurrency(countryGroupId);

const store = pageInit(initReducer(countryGroupId));

user.init(store.dispatch);

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];
const selectedCountryGroup = countryGroups[countryGroupId];

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<NewHeader selectedCountryGroup={selectedCountryGroup} />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <NewContributionForm
        countryGroupId={countryGroupId}
        currency={currency}
        selectedCountryGroupDetails={selectedCountryGroupDetails}
      />
      <div className="gu-content__bg">
        <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-a']} />
        <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-b']} />
        <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-c']} />
        <SvgContributionsBgMobile />
        <SvgContributionsBgDesktop />
      </div>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
