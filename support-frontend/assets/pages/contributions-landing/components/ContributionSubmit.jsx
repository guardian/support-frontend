// @flow

// ----- Imports ----- //

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';
import { connect } from 'react-redux';

import { billingPeriodFromContrib, type ContributionType, getAmount } from 'helpers/contributions';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { SelectedAmounts } from 'helpers/contributions';
import { getContributeButtonCopyWithPaymentType } from 'helpers/checkouts';
import { hiddenIf } from 'helpers/utilities';
import { setupRecurringPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { PayPalExpressButton } from 'components/paypalExpressButton/PayPalExpressButton';
import { type State } from '../contributionsLandingReducer';
import { sendFormSubmitEventForPayPalRecurring } from '../contributionsLandingActions';
import { ButtonWithRightArrow } from './ButtonWithRightArrow/ButtonWithRightArrow';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { PayPal } from 'helpers/paymentMethods';

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
  setupRecurringPayPalPayment: Function,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  formIsSubmittable: boolean,
  amount: number,
  billingPeriod: BillingPeriod,
|};

function mapStateToProps(state: State) {
  const { contributionType } = state.page.form;
  return ({
    currency: state.common.internationalisation.currencyId,
    contributionType,
    isWaiting: state.page.form.isWaiting,
    paymentMethod: state.page.form.paymentMethod,
    selectedAmounts: state.page.form.selectedAmounts,
    otherAmount: state.page.form.formData.otherAmounts[contributionType].amount,
    currencyId: state.common.internationalisation.currencyId,
    csrf: state.page.csrf,
    payPalHasLoaded: state.page.form.payPalHasLoaded,
    isTestUser: state.page.user.isTestUser,
    formIsSubmittable: state.page.form.formIsSubmittable,
    amount: getAmount(
      state.page.form.selectedAmounts,
      state.page.form.formData.otherAmounts,
      contributionType,
    ),
    billingPeriod: billingPeriodFromContrib(contributionType),
  });
}

const mapDispatchToProps = (dispatch: Function) => ({
  sendFormSubmitEventForPayPalRecurring: () => { dispatch(sendFormSubmitEventForPayPalRecurring()); },
  setupRecurringPayPalPayment: (
    resolve: Function,
    reject: Function,
    currencyId: IsoCurrency,
    csrf: CsrfState,
  ) => {
    dispatch(setupRecurringPayPalPayment(resolve, reject, currencyId, csrf));
  },
});


// ----- Render ----- //


function ContributionSubmit(props: PropTypes) {

  if (props.paymentMethod !== 'None') {
    // if all payment methods are switched off, do not display the button
    const formClassName = 'form--contribution';
    const showPayPalRecurringButton = props.paymentMethod === PayPal && props.contributionType !== 'ONE_OFF';

    const submitButtonCopy = getContributeButtonCopyWithPaymentType(
      props.contributionType,
      props.otherAmount,
      props.selectedAmounts,
      props.currency,
      props.paymentMethod,
    );

    // We have to show/hide PayPalExpressButton rather than conditionally rendering it
    // because we don't want to destroy and replace the iframe each time.
    // See PayPalExpressButton for more info.
    return (
      <div className="form__submit">
        <div
          id="component-paypal-button-checkout"
          className={hiddenIf(!showPayPalRecurringButton, 'component-paypal-button-checkout')}
        >
          <PayPalExpressButton
            onPaymentAuthorisation={props.onPaymentAuthorisation}
            csrf={props.csrf}
            currencyId={props.currencyId}
            hasLoaded={props.payPalHasLoaded}
            canOpen={() => props.formIsSubmittable}
            onClick={() => props.sendFormSubmitEventForPayPalRecurring()}
            formClassName={formClassName}
            isTestUser={props.isTestUser}
            setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
            amount={props.amount}
            billingPeriod={props.billingPeriod}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContributionSubmit);
