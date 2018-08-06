// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import Page from 'components/page/page';
import CustomerService from 'components/customerService/customerService';
import Footer from 'components/footer/footer';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import countrySwitcherHeaderContainer from 'components/headers/countrySwitcherHeader/countrySwitcherHeaderContainer';

import StageSelection, { type PropTypes } from './stageSelection';
import { type Stage } from '../digitalSubscriptionCheckoutReducer';


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const CountrySwitcherHeader = countrySwitcherHeaderContainer(
  '/subscribe/digital',
  [
    'GBPCountries',
    'UnitedStates',
    'AUDCountries',
    'International',
  ],
);

function mapStateToProps(state): PropTypes<Stage> {

  return {
    stage: state.page.stage,
  };

}


// ----- Component ----- //

const CheckoutStage = StageSelection({
  checkout: (
    <Page
      header={<CountrySwitcherHeader />}
      footer={<Footer><CustomerService selectedCountryGroup={countryGroupId} /></Footer>}
    >
      <LeftMarginSection modifierClasses={['grey']}>
        <p>Placeholder</p>
      </LeftMarginSection>
    </Page>
  ),
  thankyou: <div>Thank you page</div>,
});


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
