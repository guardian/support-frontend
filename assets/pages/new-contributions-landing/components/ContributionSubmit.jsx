// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';
import { connect } from 'react-redux';

import { getFrequency, type ContributionType, type PaymentMethod } from 'helpers/contributions';
import { getPaymentDescription } from 'helpers/checkouts';
import { type IsoCurrency, currencies, spokenCurrencies } from 'helpers/internationalisation/currency';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { SelectedAmounts } from 'helpers/contributions';
import { hiddenIf } from 'helpers/utilities';
import { type State } from '../contributionsLandingReducer';
import { formatAmount } from './ContributionAmount';
import { PayPalRecurringButton } from './PayPalRecurringButton';
import {
  sendFormSubmitEventForPayPalRecurring,
  setupRecurringPayPalPayment,
} from '../contributionsLandingActions';
import { ButtonWithRightArrow } from './ButtonWithRightArrow';


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
  setupRecurringPayPalPayment: (resolve: string => void, reject: Error => void, IsoCurrency, CsrfState) => void,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  formIsSubmittable: boolean,
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
    formIsSubmittable: state.page.form.formIsSubmittable,
  });

const mapDispatchToProps = (dispatch: Function) => ({
  sendFormSubmitEventForPayPalRecurring: () => { dispatch(sendFormSubmitEventForPayPalRecurring()); },
  setupRecurringPayPalPayment: (
    resolve: Function,
    reject: Function,
    currencyId: IsoCurrency,
    csrf: CsrfState,
  ) => { dispatch(setupRecurringPayPalPayment(resolve, reject, currencyId, csrf)); },
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

    const amountCopy = amount ?
      formatAmount(
        currencies[props.currency],
        spokenCurrencies[props.currency],
        amount,
        false,
      ) : '';

    const paymentDescriptionCopy = getPaymentDescription(props.contributionType, props.paymentMethod);

    const submitButtonCopy = `Contribute ${amountCopy} ${frequency} ${paymentDescriptionCopy}`;


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
            canOpen={() => props.formIsSubmittable}
            onClick={() => props.sendFormSubmitEventForPayPalRecurring()}
            formClassName={formClassName}
            isTestUser={props.isTestUser}
            setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
          />
        </div>
        <ButtonWithRightArrow
          accessibilityHintId="accessibility-hint-submit-contribution"
          disabled={props.isWaiting}
          type="submit"
          componentClassName="form__submit--contribution"
          buttonClassName={hiddenIf(showPayPalRecurringButton, 'form__submit-button')}
          buttonCopy={submitButtonCopy}
        />
      </div>
    );
  }

  return null;
}

const NewContributionSubmit = connect(mapStateToProps, mapDispatchToProps)(ContributionSubmit);

export { NewContributionSubmit };
