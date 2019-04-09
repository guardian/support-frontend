// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { type FormError } from 'helpers/subscriptionsForms/validation';
import type { BillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import AddressForm from './addressForm';
import type { ErrorReason } from 'helpers/errorReasons';
import {
  finalPrice as dpFinalPrice,
  promotion as digitalPackPromotion,
  regularPrice as dpRegularPrice,
} from 'helpers/productPrice/digitalProductPrices';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import { PromotionSummary } from 'components/promotionSummary/promotionSummary';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import Summary from 'components/subscriptionCheckouts/summary';
import {
  type Action,
  type FormActionCreators,
  formActionCreators,
} from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { setupSubscriptionPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { SubscriptionSubmitButtons } from 'components/subscriptionCheckouts/subscriptionSubmitButtons';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';
import { signOut } from 'helpers/user/user';
import { formIsValid, validateForm } from 'pages/digital-subscription-checkout/helpers/validation';
import GridImage from 'components/gridImage/gridImage';

import {
  type FormField,
  type FormFields,
  getFormFields,
  type State,
  submitForm,
} from '../digitalSubscriptionCheckoutReducer';
import type { FormField as PersonalDetailsFormField } from '../../../components/subscriptionCheckouts/personalDetails';
import PersonalDetails from '../../../components/subscriptionCheckouts/personalDetails';
import CancellationSection from 'components/subscriptionCheckouts/cancellationSection';

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
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
    signOut,
  };
}


// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

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

  return (
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
          productPrice={dpRegularPrice(
            props.productPrices,
            props.billingPeriod,
            props.country,
          )}
          promotion={digitalPackPromotion(
            props.productPrices,
            props.billingPeriod,
            props.country,
          )}
          billingPeriod={props.billingPeriod}
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
              formErrors={((props.formErrors: any): FormError<PersonalDetailsFormField>[])}
              signOut={props.signOut}
            />
          </FormSection>
          <FormSection title="Address">
            <AddressForm
              addressLine1={props.addressLine1}
              addressLine2={props.addressLine2}
              townCity={props.townCity}
              country={props.country}
              postcode={props.postcode}
              setAddressLine1={props.setAddressLine1}
              setAddressLine2={props.setAddressLine2}
              setTownCity={props.setTownCity}
              setBillingCountry={props.setBillingCountry}
              stateProvince={props.stateProvince}
              setPostcode={props.setPostcode}
              setStateProvince={props.setStateProvince}
              formErrors={props.formErrors}
            />
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
            submissionError={props.submissionError}
          />
          <FormSection>
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
          <CancellationSection />
        </Form>
      </CheckoutLayout>
    </Content>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(CheckoutForm);
