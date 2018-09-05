// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type Participations } from 'helpers/abTests/abtest';
import { setupStripeCheckout, openDialogBox, createTokenCallback } from 'helpers/paymentIntegrations/stripeCheckout';

import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import { type State } from '../contributionsLandingReducer';
import { type Action } from '../contributionsLandingActions';

// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  isTestUser: boolean,
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  selectedCountryGroupDetails: CountryMetaData,
  abParticipations: Participations,
  dispatch: Dispatch<Action>,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  isTestUser: state.page.user.isTestUser || false,
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  abParticipations: state.common.abParticipations,
  optimizeExperiments: state.common.optimizeExperiments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  dispatch,
});

// ----- Functions ----- //

const getAmount = formElements =>
  parseFloat(formElements.contributionAmount.value === 'other'
      ? formElements.contributionOther.value
      : formElements.contributionAmount.value);

// ----- Event handlers ----- //

const onSubmit = (props: PropTypes) => (e) => {
  e.preventDefault();

  const { elements } = e.target;
  const amount = getAmount(elements);
  const email = elements.contributionEmail.value;

  stripeReady.then(() => {
    openDialogBox(amount, email);
  });
};


// ----- Render ----- //

let stripeReady = null;

function ContributionForm(props: PropTypes) {
  const { 
    abParticipations, 
    countryGroupId, 
    selectedCountryGroupDetails, 
    referrerAcquisitionData,
    optimizeExperiments,
    currency,
  } = props;

  let formElement = null;

  const callback = createTokenCallback({
    abParticipations, 
    currency, 
    referrerAcquisitionData, 
    optimizeExperiments,
    getData: () => {
      const elements = formElement.elements;
      const firstName = elements.contributionFirstName.value;
      const lastName = elements.contributionLastName.value;
      const email = elements.contributionEmail.value;
      const amount = getAmount(elements);
        
      return {
        user: {
          fullName: `${firstName} ${lastName}`,
          email
        },
        amount
      };
    },
    onSuccess: () => {
      trackConversion(abParticipations, routes.oneOffContribThankyou);
      console.log('payment successful');
    },
    onError: error => {
      console.error(`payment failed with ${error}`);
    }
  });

  stripeReady = setupStripeCheckout(callback, null, currency, props.isTestUser);

  return (
    <div className="gu-content__content">
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form ref={el => formElement = el} className={classNameWithModifiers('form', ['contribution'])} onSubmit={onSubmit(props)}>
        <NewContributionType />
        <NewContributionAmount
          countryGroupId={countryGroupId}
          countryGroupDetails={selectedCountryGroupDetails}
          currency={currency}
        />
        <NewContributionTextInput id="contributionFirstName" name="contribution-fname" label="First Name" icon={<SvgUser />} required />
        <NewContributionTextInput id="contributionLastName" name="contribution-lname" label="Last Name" icon={<SvgUser />} required />
        <NewContributionTextInput
          id="contributionEmail"
          name="contribution-email"
          label="Email address"
          type="email"
          placeholder="example@domain.com"
          icon={<SvgEnvelope />}
          required
        />
        <NewContributionState countryGroupId={countryGroupId} />
        <NewContributionPayment />
        <NewContributionSubmit countryGroupId={countryGroupId} currency={currency} />
      </form>
    </div>
  );
}

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
