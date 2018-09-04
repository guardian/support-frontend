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
import { setupStripeCheckout, openDialogBox } from 'helpers/paymentIntegrations/stripeCheckout';

import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import postCheckout from '../../oneoff-contributions/helpers/ajax';
import { type State } from '../contributionsLandingReducer';
import { type Action } from '../contributionsLandingActions';

// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  selectedCountryGroupDetails: CountryMetaData,
  abParticipations: Participations,
  dispatch: Dispatch<Action>,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments
|};

const mapStateToProps = (state: State) => ({
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  abParticipations: state.common.abParticipations,
  optimizeExperiments: state.common.optimizeExperiments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  dispatch,
});

// ----- Event handlers ----- //

const onSubmit = (props: PropTypes) => (e) => {
  e.preventDefault();

  const { elements } = e.target;
  const amount = elements.contributionAmount === 'other' ? elements.contributionOther : elements.contributionAmount;
  const email = elements.contributionEmail;

  if (window.StripeCheckout === undefined) {
    const firstName = elements.contributionFirstName;
    const lastName = elements.contributionLastName;
    const callback = postCheckout(
      props.abParticipations,
      props.dispatch,
      amount,
      props.currency,
      props.referrerAcquisitionData,
      () => ({ page: { user: { fullName: `${firstName} ${lastName}`, email } } }),
      props.optimizeExperiments,
    );

    setupStripeCheckout(callback, () => {}, props.currency, false);
  }

  openDialogBox(amount, email);
};


// ----- Render ----- //

function ContributionForm(props: PropTypes) {
  const { countryGroupId, selectedCountryGroupDetails, currency } = props;
  return (
    <div className="gu-content__content">
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form className={classNameWithModifiers('form', ['contribution'])} onSubmit={onSubmit(props)}>
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
