// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { amounts, getFrequency, getPaymentType, type Contrib } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

import { NewContributionHeader } from './new_components/ContributionHeader';
import SvgArrowRight from 'components/svgs/arrowRightStraight';
import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';

import { NewContributionType } from './new_components/ContributionType';
import { formatAmount, NewContributionAmount } from './new_components/ContributionAmount';
import { NewContributionTextInput } from './new_components/ContributionTextInput';
import { NewContributionPayment } from './new_components/ContributionPayment';

import { countryGroupSpecificDetails } from './contributionsLandingMetadata';
import { createPageReducerFor } from './contributionsLandingReducer';
import { NewContributionState } from './ContributionState';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const contributionType: Contrib = 'MONTHLY';

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];

const selectedCountryGroup = countryGroups[countryGroupId];

const selectedAmounts = amounts('notintest')[contributionType][countryGroupId];

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<NewContributionHeader selectedCountryGroup={selectedCountryGroup} />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form action="#" method="post" className="form form--contribution">
        <NewContributionType />
        <NewContributionAmount countryGroupDetails={selectedCountryGroupDetails} />
        <NewContributionTextInput id="contributionFirstName" name="contribution-fname" label="First Name" icon={<SvgUser />} required />
        <NewContributionTextInput id="contributionLastName" name="contribution-lname" label="Last Name" icon={<SvgUser />} required />
        <NewContributionTextInput id="contributionEmail" name="contribution-email" label="Email address" type="email" placeholder="example@domain.com" icon={<SvgEnvelope />} required />
        <NewContributionState countryGroupId={countryGroupId} />
        <NewContributionPayment />
        <div className="form__submit">
          <button className="form__submit__button" type="submit">
            Contribute&nbsp;
            {formatAmount(selectedCountryGroupDetails, selectedAmounts[0], false)}&nbsp;
            {getFrequency(contributionType)}&nbsp;
            {getPaymentType(contributionType, 'paypal')}&nbsp;
            <SvgArrowRight />
          </button>
        </div>
      </form>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
