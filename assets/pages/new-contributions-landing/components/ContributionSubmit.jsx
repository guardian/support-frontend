// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type ContributionType, type PaymentMethod } from 'helpers/contributions';
import { getPaymentDescription } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { CaState, UsState } from 'helpers/internationalisation/country';
import SvgArrowRight from 'components/svgs/arrowRightStraight';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { hiddenIf } from 'helpers/utilities';
import { checkoutFormShouldSubmit } from 'helpers/checkoutForm/checkoutForm';
import { type UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { type State } from '../contributionsLandingReducer';
import { formatAmount } from './ContributionAmount';
import { PayPalRecurringButton } from './PayPalRecurringButton';
import {
  sendFormSubmitEventForPayPalRecurring,
  setupRecurringPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //

type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  currency: IsoCurrency,
  isWaiting: boolean,
  selectedAmounts: SelectedAmounts,
  otherAmount: string | null,
  currencyId: IsoCurrency,
  csrf: CsrfState,
  sendFormSubmitEventForPayPalRecurring: () => void,
  setupRecurringPayPalPayment: (
    resolve: string => void,
    reject: Error => void,
    IsoCurrency,
    CsrfState,
    contributionType: ContributionType
  ) => void,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  isSignedIn: boolean,
  userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
  isRecurringContributor: boolean,
  otherAmounts: OtherAmounts,
  countryGroupId: CountryGroupId,
  state: UsState | CaState | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
|};

const mapStateToProps = (state: State) =>
  ({
    currency: state.common.internationalisation.currencyId,
    contributionType: state.page.form.contributionType,
    isWaiting: state.page.form.isWaiting,
    paymentMethod: state.page.form.paymentMethod,
    selectedAmounts: state.page.form.selectedAmounts,
    otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
    currencyId: state.common.internationalisation.currencyId,
    csrf: state.page.csrf,
    payPalHasLoaded: state.page.form.payPalHasLoaded,
    isTestUser: state.page.user.isTestUser,
    isSignedIn: state.page.user.isSignedIn,
    isRecurringContributor: state.page.user.isRecurringContributor,
    userTypeFromIdentityResponse: state.page.form.userTypeFromIdentityResponse,
    otherAmounts: state.page.form.formData.otherAmounts,
    countryGroupId: state.common.internationalisation.countryGroupId,
    state: state.page.form.formData.state,
    firstName: state.page.form.formData.firstName,
    lastName: state.page.form.formData.lastName,
    email: state.page.form.formData.email,
  });

const mapDispatchToProps = (dispatch: Function) => ({
  sendFormSubmitEventForPayPalRecurring: () => { dispatch(sendFormSubmitEventForPayPalRecurring()); },
  setupRecurringPayPalPayment: (
    resolve: Function,
    reject: Function,
    currencyId: IsoCurrency,
    csrf: CsrfState,
    contributionType: ContributionType,
  ) => { dispatch(setupRecurringPayPalPayment(resolve, reject, currencyId, csrf, contributionType)); },
});


// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {

  // if all payment methods are switched off, do not display the button
  if (props.paymentMethod !== 'None') {
    const frequency = getFrequency(props.contributionType);
    const otherAmount = props.otherAmount ? {
      value: props.otherAmount,
      spoken: '',
      isDefault: false,
    } : null;
    const amount = props.selectedAmounts[props.contributionType] === 'other' ? otherAmount : props.selectedAmounts[props.contributionType];
    const formClassName = 'form--contribution';
    const showPayPalRecurringButton = props.paymentMethod === 'PayPal' && props.contributionType !== 'ONE_OFF';

    const formIsValidParameters = {
      selectedAmounts: props.selectedAmounts,
      otherAmounts: props.otherAmounts,
      countryGroupId: props.countryGroupId,
      contributionType: props.contributionType,
      state: props.state,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
    };

    // We have to show/hide PayPalRecurringButton rather than conditionally rendering it
    // because we don't want to destroy and replace the iframe each time.
    // See PayPalRecurringButton.jsx for more info.
    return (
      <div className="form__submit">
        <div
          id="component-paypal-button-checkout"
          className={hiddenIf(!showPayPalRecurringButton, 'component-paypal-button-checkout')}
        >
          <PayPalRecurringButton
            onPaymentAuthorisation={props.onPaymentAuthorisation}
            csrf={props.csrf}
            currencyId={props.currencyId}
            hasLoaded={props.payPalHasLoaded}
            canOpen={() =>
              checkoutFormShouldSubmit(
                props.contributionType,
                props.isSignedIn,
                props.isRecurringContributor,
                props.userTypeFromIdentityResponse,
                formIsValidParameters,
              )
            }
            onClick={() => props.sendFormSubmitEventForPayPalRecurring()}
            formClassName={formClassName}
            isTestUser={props.isTestUser}
            setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
            contributionType={props.contributionType}
          />
        </div>
        <button
          disabled={props.isWaiting}
          type="submit"
          className={hiddenIf(showPayPalRecurringButton, 'form__submit-button')}
        >
          <span className="form__submit-button__inner">
            Contribute&nbsp;
            {amount ? formatAmount(
              currencies[props.currency],
              spokenCurrencies[props.currency],
              amount,
              false,
            ) : null}&nbsp;
            {frequency ? `${frequency} ` : null}
            {getPaymentDescription(props.contributionType, props.paymentMethod)}&nbsp;
            <SvgArrowRight />
          </span>
        </button>
      </div>
    );
  }

  return null;
}

const NewContributionSubmit = connect(mapStateToProps, mapDispatchToProps)(ContributionSubmit);

export { NewContributionSubmit };
