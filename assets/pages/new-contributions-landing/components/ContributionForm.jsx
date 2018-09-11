// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import type { Dispatch } from 'redux';

import { countryGroupSpecificDetails, type CountryMetaData } from 'helpers/internationalisation/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { bracketP } from 'helpers/promise';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type ReferrerAcquisitionData, derivePaymentApiAcquisitionData, getSupportAbTests, getOphanIds } from 'helpers/tracking/acquisitions';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';
import { type Contrib } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type Participations } from 'helpers/abTests/abtest';
import { setupStripeCheckout, openDialogBox } from 'helpers/paymentIntegrations/newStripeCheckout';
import { createPaymentCallback, type PaymentFields, type PaymentResult, type PaymentCallback, type Token } from 'helpers/paymentIntegrations/paymentApi';
import trackConversion from 'helpers/tracking/conversions';

import ErrorMessage from 'components/errorMessage/errorMessage';
import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';
import ProgressMessage from 'components/progressMessage/progressMessage';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import { type State } from '../contributionsLandingReducer';
import { type Action, paymentSuccess, paymentFailure, paymentWaiting } from '../contributionsLandingActions';

// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  done: boolean,
  error: string | null,
  isWaiting: boolean,
  csrf: CsrfState,
  isTestUser: boolean,
  countryGroupId: CountryGroupId,
  countryId: IsoCountry,
  currency: IsoCurrency,
  selectedCountryGroupDetails: CountryMetaData,
  abParticipations: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments,
  contributionType: Contrib,
  thankYouRoute: string,
  initialFirstName: string,
  initialLastName: string,
  initialEmail: string,
  onSuccess: () => void,
  onError: string => void,
  onWaiting: boolean => void,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  done: state.page.form.done,
  isWaiting: state.page.form.isWaiting,
  csrf: state.page.csrf,
  countryId: state.common.internationalisation.countryId,
  isTestUser: state.page.user.isTestUser || false,
  initialFirstName: state.page.user.firstName,
  initialLastName: state.page.user.lastName,
  initialEmail: state.page.user.email,
  contributionType: state.page.form.contributionType,
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  abParticipations: state.common.abParticipations,
  optimizeExperiments: state.common.optimizeExperiments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  onSuccess: () => { dispatch(paymentSuccess()); },
  onError: (error) => { dispatch(paymentFailure(error)); },
  onWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
});

// ----- Functions ----- //

const getAmount = (formElements: Object) =>
  parseFloat(formElements.contributionAmount.value === 'other'
    ? formElements.contributionOther.value
    : formElements.contributionAmount.value);

function getData(props: PropTypes, formElement: Object): (Contrib, Token) => PaymentFields {
  return (contributionType, token) => {
    const {
      countryGroupId,
      countryId,
      currency,
      abParticipations,
      referrerAcquisitionData,
      optimizeExperiments,
    } = props;
    const contributionState = countryGroupId === 'UnitedStates' || countryGroupId === 'Canada'
      ? formElement.elements.contributionState.value
      : null;
    const billingPeriod = formElement.elements.contributionType.value === 'MONTHLY'
      ? 'Monthly'
      : 'Annual';
    const ophanIds = getOphanIds();

    switch (contributionType) {
      case 'ONE_OFF':
        return {
          contributionType: 'oneoff',
          fields: {
            paymentData: {
              currency,
              amount: getAmount(formElement.elements),
              token: token.paymentMethod === 'Stripe' ? token.token : '',
              email: formElement.elements.contributionEmail.value,
            },
            acquisitionData: derivePaymentApiAcquisitionData(
              referrerAcquisitionData,
              abParticipations,
              optimizeExperiments,
            ),
          },
        };

      default:
        return {
          contributionType: 'regular',
          fields: {
            firstName: formElement.elements.contributionFirstName.value,
            lastName: formElement.elements.contributionLastName.value,
            country: countryId,
            state: contributionState,
            email: formElement.elements.contributionEmail.value,
            contribution: {
              amount: getAmount(formElement.elements),
              currency,
              billingPeriod,
            },
            paymentFields: token.paymentMethod === 'Stripe'
              ? { stripeToken: token.token }
              : { baid: '' },
            ophanIds,
            referrerAcquisitionData,
            supportAbTests: getSupportAbTests(abParticipations, optimizeExperiments),
          },
        };
    }
  };
}

// ----- Event handlers ----- //

const onSubmit = stripeHandler => (e) => {
  e.preventDefault();

  const { elements } = (e.target: any);
  const amount = getAmount(elements);
  const email = elements.namedItem('contributionEmail').value;

  openDialogBox(stripeHandler, amount, email);
};


// ----- Render ----- //

function setupStripe(formElement: Object, props: PropTypes) {
  const {
    csrf,
    currency,
    contributionType,
    abParticipations,
    isTestUser,
  } = props;

  const callback: PaymentCallback = bracketP(
    () => { props.onWaiting(true); return Promise.resolve(); },
    () => { props.onWaiting(false); return Promise.resolve(); },
    createPaymentCallback(
      getData(props, formElement),
      contributionType,
      abParticipations,
      csrf,
    ),
  );

  const onSuccess: PaymentResult => void = (result) => {
    switch (result.paymentStatus) {
      case 'success':
        trackConversion(abParticipations, '/contribute/thankyou.new');
        props.onSuccess();
        break;

      default:
        props.onError(result.error);
    }
  };

  return setupStripeCheckout(callback, contributionType, currency, isTestUser, onSuccess);
}

function ContributionForm(props: PropTypes) {
  const {
    countryGroupId,
    selectedCountryGroupDetails,
    currency,
    thankYouRoute,
    initialFirstName,
    initialLastName,
    initialEmail,
  } = props;

  return props.done ?
    <Redirect to={thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
        <ErrorMessage message={props.error} />
        <form
          ref={(el) => {
          if (el) {
            setupStripe(el, props)
              .then((stripeHandler) => {
                el.addEventListener('submit', onSubmit(stripeHandler));
              });
          }
        }}
          className={classNameWithModifiers('form', ['contribution'])}
        >
          <NewContributionType />
          <NewContributionAmount
            countryGroupId={countryGroupId}
            countryGroupDetails={selectedCountryGroupDetails}
            currency={currency}
          />
          <NewContributionTextInput
            id="contributionFirstName"
            name="contribution-fname"
            label="First Name"
            value={initialFirstName}
            icon={<SvgUser />}
            required
          />
          <NewContributionTextInput
            id="contributionLastName"
            name="contribution-lname"
            label="Last Name"
            value={initialLastName}
            icon={<SvgUser />}
            required
          />
          <NewContributionTextInput
            id="contributionEmail"
            name="contribution-email"
            label="Email address"
            value={initialEmail}
            type="email"
            placeholder="example@domain.com"
            icon={<SvgEnvelope />}
            required
          />
          <NewContributionState countryGroupId={countryGroupId} />
          <NewContributionPayment countryGroupId={countryGroupId} />
          <NewContributionSubmit countryGroupId={countryGroupId} currency={currency} />
          {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </form>
      </div>
    );
}

ContributionForm.defaultProps = {
  error: null,
};

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
