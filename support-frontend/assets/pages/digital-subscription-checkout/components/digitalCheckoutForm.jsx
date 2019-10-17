// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import Form, { FormSection, FormSectionHiddenUntilSelected } from 'components/checkoutForm/checkoutForm';
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
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';


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
  addressErrors: Array<Object>,
|};

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

function DigitalCheckoutForm(props: PropTypes) {
  const productPrice = getProductPrice(
    props.productPrices,
    props.country,
    props.billingPeriod,
  );
  const offerOnSelected = getAppliedPromoDescription(props.billingPeriod, productPrice);
  const helperSelected = getPriceDescription(productPrice, props.billingPeriod);
  const priceSummary = `${offerOnSelected || 'Enjoy your digital subscription free for 14 days, then'} ${helperSelected}.`;
  const submissionErrorHeading = props.submissionError === 'personal_details_incorrect' ? 'Sorry there was a problem' :
    'Sorry we could not process your payment';

  const PriceSummary = () =>
    <p className="component-credit-card-price">{priceSummary}</p>;

  return (
    <Content>
      <CheckoutLayout aside={(
        <Summary
          image={
            <GridImage
              gridId="subscriptionDailyPackshot"
              srcSizes={[1000, 500]}
              sizes="(max-width: 740px) 50vw, 500"
              imgType="png"
              altText=""
            />
            }
          title="Digital Subscription"
          description="Premium App + The Guardian Daily + Ad-free"
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
            text="Start your free trial now"
          />
          <FormSectionHiddenUntilSelected
            id="stripeForm"
            show={props.paymentMethod === Stripe}
            title="Your card details"
          >
            <StripeProviderForCountry
              country={props.country}
              isTestUser={props.isTestUser}
              component={<PriceSummary />}
              submitForm={props.submitForm}
              allErrors={[...props.addressErrors]}
              setStripeToken={props.setStripeToken}
              name={`${props.firstName} ${props.lastName}`}
              validateForm={props.validateForm}
              buttonText="Start your free trial now"
            />
          </FormSectionHiddenUntilSelected>
          <GeneralErrorMessage
            errorReason={props.submissionError}
            errorHeading={submissionErrorHeading}
          />
          <CancellationSection />
        </Form>
      </CheckoutLayout>
    </Content>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(DigitalCheckoutForm);
