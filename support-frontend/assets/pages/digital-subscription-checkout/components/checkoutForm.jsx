// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { Annual, Monthly } from 'helpers/billingPeriods';

import { Outset } from 'components/content/content';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import Button from 'components/button/button';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import Layout from 'components/subscriptionCheckouts/layout';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import Content from 'components/content/content';
import type { ErrorReason } from 'helpers/errorReasons';
import {
  regularPrice as dpRegularPrice,
  promotion as digitalPackPromotion,
  finalPrice as dpFinalPrice,
} from 'helpers/productPrice/digitalProductPrices';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import { PromotionSummary } from 'components/promotionSummary/promotionSummary';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { type Action, type FormActionCreators, formActionCreators } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { setupRecurringPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { SubscriptionSubmitButtons } from 'components/subscriptionCheckouts/subscriptionSubmitButtons';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';
import { signOut } from 'helpers/user/user';
import { formIsValid, validateForm } from 'pages/digital-subscription-checkout/helpers/validation';

import {
  submitForm,
  type FormField,
  type FormFields,
  getFormFields,
  type State,
} from '../digitalSubscriptionCheckoutReducer';
import { InputWithError, StaticInputWithLabel } from 'components/subscriptionCheckouts/formFields';
import { internationalAddressWithStore } from 'pages/paper-subscription-checkout/components-checkout/addressFields';
import { getAddress } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  signOut: typeof signOut,
  submitForm: Function,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  currencyId: IsoCurrency,
  ...FormActionCreators,
  csrf: Csrf,
  payPalHasLoaded: boolean,
  isTestUser: boolean,
  amount: number,
  billingPeriod: BillingPeriod,
  setupRecurringPayPalPayment: Function,
  validateForm: () => Function,
  formIsValid: Function,
  optimizeExperiments: OptimizeExperiments,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...getFormFields(state),
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
    currencyId: state.common.internationalisation.currencyId,
    csrf: state.page.csrf,
    payPalHasLoaded: state.page.checkout.payPalHasLoaded,
    paymentMethod: state.page.checkout.paymentMethod,
    isTestUser: state.page.checkout.isTestUser,
    amount: dpFinalPrice(
      state.page.checkout.productPrices,
      state.page.checkout.billingPeriod,
      state.common.internationalisation.countryId,
    ).price,
    billingPeriod: state.page.checkout.billingPeriod,
    optimizeExperiments: state.common.optimizeExperiments,
  };
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
  return {
    ...formActionCreators,
    formIsValid: () => (dispatch: Dispatch<Action>, getState: () => State) => formIsValid(getState()),
    submitForm: () => (dispatch: Dispatch<Action>, getState: () => State) => submitForm(dispatch, getState()),
    validateForm: () => (dispatch: Dispatch<Action>, getState: () => State) => validateForm(dispatch, getState()),
    setupRecurringPayPalPayment,
    signOut,
  };
}

// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  const errorHeading = props.submissionError === 'personal_details_incorrect' ? 'Failed to Create Subscription' :
    'Payment Attempt Failed';
  const errorState = props.submissionError ?
    <GeneralErrorMessage errorReason={props.submissionError} errorHeading={errorHeading} /> :
    null;

  const monthlyPriceLabel = props.country !== null ?
    (<PriceLabel
      country={props.country}
      productPrice={dpRegularPrice(props.productPrices, Monthly, props.country)}
      promotion={digitalPackPromotion(props.productPrices, Monthly, props.country)}
      billingPeriod={Monthly}
    />) : '';

  const annualPriceLabel = props.country !== null ?
    (<PriceLabel
      country={props.country}
      productPrice={dpRegularPrice(props.productPrices, Annual, props.country)}
      promotion={digitalPackPromotion(props.productPrices, Annual, props.country)}
      billingPeriod={Annual}
    />) : '';

  const Address = internationalAddressWithStore('billing', getAddress);

  return (
    <Content modifierClasses={['your-details']}>
      <Outset>
        <Layout>
          <Form onSubmit={(ev) => {
            ev.preventDefault();
            props.submitForm();
          }}
          >
            <FormSection title="Your details">
              <InputWithError
                id="first-name"
                label="First name"
                type="text"
                value={props.firstName}
                setValue={props.setFirstName}
                error={firstError('firstName', props.formErrors)}
              />
              <InputWithError
                id="last-name"
                label="Last name"
                type="text"
                value={props.lastName}
                setValue={props.setLastName}
                error={firstError('lastName', props.formErrors)}
              />
              <StaticInputWithLabel
                id="email"
                label="Email"
                type="email"
                disabled
                value={props.email}
                footer={(
                  <span>
                    <CheckoutExpander copy="Want to use a different email address?">
                      <p>You will be able to edit this in your account once you have completed this checkout.</p>
                    </CheckoutExpander>
                    <CheckoutExpander copy="Not you?">
                      <p>
                        <Button
                          appearance="greyHollow"
                          icon={null}
                          type="button"
                          aria-label={null}
                          onClick={() => props.signOut()}
                        >
                          Sign out
                        </Button> and create a new account.
                      </p>
                    </CheckoutExpander>
                  </span>
                )}
              />
              <InputWithError
                id="telephone"
                label="Telephone"
                optional
                type="tel"
                value={props.telephone}
                setValue={props.setTelephone}
                footer="We may use this to get in touch with you about your subscription."
                error={firstError('telephone', props.formErrors)}
              />
            </FormSection>
            <FormSection title="Address">
              <Address />
            </FormSection>
            <FormSection title="How often would you like to pay?">
              <Fieldset legend="How often would you like to pay?">
                <RadioInput
                  text={monthlyPriceLabel}
                  name="billingPeriod"
                  checked={props.billingPeriod === Monthly}
                  onChange={() => props.setBillingPeriod(Monthly)}
                />
                <RadioInput
                  text={annualPriceLabel}
                  name="billingPeriod"
                  checked={props.billingPeriod === Annual}
                  onChange={() => props.setBillingPeriod(Annual)}
                />
                <PromotionSummary
                  country={props.country}
                  productPrices={props.productPrices}
                  billingPeriod={props.billingPeriod}
                />
              </Fieldset>
            </FormSection>
            <PaymentMethodSelector
              countrySupportsDirectDebit={props.countrySupportsDirectDebit}
              paymentMethod={props.paymentMethod}
              setPaymentMethod={props.setPaymentMethod}
              onPaymentAuthorised={props.onPaymentAuthorised}
              optimizeExperiments={props.optimizeExperiments}
            />
            <FormSection>
              {errorState}
              <SubscriptionSubmitButtons
                paymentMethod={props.paymentMethod}
                onPaymentAuthorised={props.onPaymentAuthorised}
                csrf={props.csrf}
                currencyId={props.currencyId}
                payPalHasLoaded={props.payPalHasLoaded}
                formIsValid={props.formIsValid}
                validateForm={props.validateForm}
                isTestUser={props.isTestUser}
                setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
                amount={props.amount}
                billingPeriod={props.billingPeriod}
              />
            </FormSection>
          </Form>
        </Layout>
      </Outset>
    </Content>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(CheckoutForm);
