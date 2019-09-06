// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import Form, { FormSection, FormSectionHidden } from 'components/checkoutForm/checkoutForm';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import {
  finalPrice,
  getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import Summary from 'components/subscriptionCheckouts/summary';
import {
  type Action,
  type FormActionCreators,
  formActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { setupSubscriptionPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { SubscriptionSubmitButton } from 'components/subscriptionCheckouts/subscriptionSubmitButton';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';
import { signOut } from 'helpers/user/user';
import GridImage from 'components/gridImage/gridImage';

import {
  type FormField,
  type FormFields,
  getFormFields,
} from 'helpers/subscriptionsForms/formFields';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import CancellationSection
  from 'components/subscriptionCheckouts/cancellationSection';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countries } from 'helpers/internationalisation/country';
import { DigitalPack } from 'helpers/subscriptions';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getBillingAddress } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  checkoutFormIsValid,
  validateCheckoutForm,
} from 'helpers/subscriptionsForms/formValidation';
import {
  submitCheckoutForm,
  trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { BillingPeriodSelector } from 'components/subscriptionCheckouts/billingPeriodSelector';
import { PayPal, DirectDebit, Stripe } from 'helpers/paymentMethods';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import StripeForm from 'components/subscriptionCheckouts/stripeForm/stripeForm';
import { type Option } from 'helpers/types/option';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';


// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  country: IsoCountry,
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
  addressErrors: Array<Object>,
|};

type StateTypes = {
  stripe: Option<Object>,
}


// ----- Map State/Props ----- //

function mapStateToProps(state: CheckoutState) {
  return {
    ...getFormFields(state),
    country: state.common.internationalisation.countryId,
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
    currencyId: state.common.internationalisation.currencyId,
    csrf: state.page.csrf,
    payPalHasLoaded: state.page.checkout.payPalHasLoaded,
    paymentMethod: state.page.checkout.paymentMethod,
    isTestUser: state.page.checkout.isTestUser,
    amount: finalPrice(
      state.page.checkout.productPrices,
      state.common.internationalisation.countryId,
      state.page.checkout.billingPeriod,
    ).price,
    billingPeriod: state.page.checkout.billingPeriod,
    optimizeExperiments: state.common.optimizeExperiments,
    addressErrors: state.page.billingAddress.fields.formErrors,
  };
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
  return {
    ...formActionCreators,
    formIsValid: () => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => checkoutFormIsValid(getState()),
    submitForm: () => (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
      submitCheckoutForm(dispatch, getState()),
    validateForm: () => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
      const state = getState();
      validateCheckoutForm(dispatch, state);
      // We need to track PayPal payment attempts here because PayPal behaves
      // differently to other payment methods. All others are tracked in submit.js
      const { paymentMethod } = state.page.checkout;
      if (paymentMethod === PayPal) {
        trackSubmitAttempt(PayPal, DigitalPack);
      }
    },
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
    signOut,
  };
}

const Address = withStore(countries, 'billing', getBillingAddress);


// ----- Component ----- //

class DigitalCheckoutForm extends Component<PropTypes, StateTypes> {
  constructor() {
    super();
    this.state = { stripe: null };
  }

  componentDidMount() {
    this.checkStripe();
  }

  checkStripe = () => {
    const stripeKey = getStripeKey('REGULAR', this.props.country, this.props.isTestUser);
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(stripeKey) });
    } else {
      window.onload = () => {
        this.setState({ stripe: window.Stripe(stripeKey) });
      };
    }
  }

  render() {
    const { props } = this;
    const productPrice = getProductPrice(
      props.productPrices,
      props.country,
      props.billingPeriod,
    );
    const offerOnSelected = getAppliedPromoDescription(props.billingPeriod, productPrice);
    const helperSelected = getPriceDescription(productPrice, props.billingPeriod);
    const priceSummary = `${offerOnSelected || 'Enjoy your digital pack free for 14 days, then'} ${helperSelected}.`;

    const PriceSummary = () =>
      <p className="component-credit-card-price">{priceSummary}</p>;

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          <Content>
            <CheckoutLayout aside={(
              <Summary
                image={
                  <GridImage
                    gridId="checkoutPackshotDigitalPack"
                    srcSizes={[1000, 500]}
                    sizes="(max-width: 740px) 50vw, 500"
                    imgType="png"
                    altText=""
                  />
                }
                title="Digital Pack"
                description="Premium App + iPad daily edition + Ad-free"
                productPrice={productPrice}
                billingPeriod={props.billingPeriod}
                product={props.product}
              />)}
            >
              <Form onSubmit={(ev) => {
                  ev.preventDefault();
                  props.submitForm();
                }}
              >
                <FormSection title="Your details">
                  <PersonalDetails
                    firstName={props.firstName}
                    setFirstName={props.setFirstName}
                    lastName={props.lastName}
                    setLastName={props.setLastName}
                    email={props.email}
                    telephone={props.telephone}
                    setTelephone={props.setTelephone}
                    formErrors={props.formErrors}
                    signOut={props.signOut}
                  />
                </FormSection>
                <FormSection title="Address">
                  <Address />
                </FormSection>
                <BillingPeriodSelector
                  billingCountry={props.country}
                  billingPeriods={[Monthly, Annual]}
                  productPrices={props.productPrices}
                  selected={props.billingPeriod}
                  onChange={billingPeriod => props.setBillingPeriod(billingPeriod)}
                />
                <PaymentMethodSelector
                  country={props.country}
                  product={DigitalPack}
                  paymentMethod={props.paymentMethod}
                  setPaymentMethod={props.setPaymentMethod}
                  onPaymentAuthorised={props.onPaymentAuthorised}
                  validationError={firstError('paymentMethod', props.formErrors)}
                  submissionError={props.submissionError}
                />
                <PayPalSubmitButton
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
                  allErrors={[...props.addressErrors, ...props.formErrors]}
                />
                <SubscriptionSubmitButton
                  paymentMethod={props.paymentMethod}
                  allErrors={[...props.addressErrors, ...props.formErrors]}
                  className={DirectDebit}
                  component={<PriceSummary />}
                />
                <FormSectionHidden
                  hidden={props.paymentMethod !== Stripe}
                  title="Your card details"
                >
                  <StripeForm
                    component={<PriceSummary />}
                    submitForm={props.submitForm}
                    paymentMethod={props.paymentMethod}
                    allErrors={[...props.addressErrors]}
                    setStripeToken={this.props.setStripeToken}
                    name={`${props.firstName} ${props.lastName}`}
                    validateForm={props.validateForm}
                  />
                </FormSectionHidden>
                <CancellationSection />
              </Form>
            </CheckoutLayout>
          </Content>
        </Elements>
      </StripeProvider>
    );
  }
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(DigitalCheckoutForm);
