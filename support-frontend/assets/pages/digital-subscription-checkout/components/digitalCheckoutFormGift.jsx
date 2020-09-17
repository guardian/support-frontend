// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { type Dispatch, compose } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import Form, { FormSection, FormSectionHiddenUntilSelected } from 'components/checkoutForm/checkoutForm';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import {
  finalPrice,
  getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import OrderSummary from 'pages/digital-subscription-checkout/components/orderSummary/orderSummary';
import {
  type Action,
  type FormActionCreators,
  formActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { setupSubscriptionPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { signOut } from 'helpers/user/user';
import GridImage from 'components/gridImage/gridImage';
import {
  type FormField as PersonalDetailsFormField,
  type FormField,
  type FormFields,
  getFormFields,
} from 'helpers/subscriptionsForms/formFields';
import { PersonalDetailsDigitalGift } from 'components/subscriptionCheckouts/personalDetailsGift';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { DigitalPack } from 'helpers/subscriptions';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  checkoutFormIsValid,
  validateCheckoutForm,
} from 'helpers/subscriptionsForms/formValidation';
import {
  submitCheckoutForm,
  trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { PayPal, Stripe, DirectDebit } from 'helpers/paymentMethods';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import { routes } from 'helpers/routes';
import EndSummaryMobile from 'pages/digital-subscription-checkout/components/endSummary/endSummaryMobile';
import type { Participations } from 'helpers/abTests/abtest';
import { TextArea } from 'components/forms/textArea';
import { asControlled } from 'hocs/asControlled';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import DatePickerFields from './datePicker/datePicker';
import { getBillingAddress } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import { countries } from 'helpers/internationalisation/country';

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
  billingPeriod: DigitalBillingPeriod,
  setupRecurringPayPalPayment: Function,
  validateForm: () => Function,
  formIsValid: Function,
  addressErrors: Array<Object>,
  participations: Participations,
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
    participations: state.common.abParticipations,
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

const TextAreaWithLabel = compose(asControlled, withLabel)(TextArea);
const DatePickerWithError = withError(DatePickerFields);
const Address = withStore(countries, 'billing', getBillingAddress);

// ----- Component ----- //

class DigitalCheckoutFormGift extends Component <PropTypes> {
  componentDidMount() {
    this.props.setGiftStatus(true);
  }

  render() {
    const { props } = this;
    const productPrice = getProductPrice(
      props.productPrices,
      props.country,
      props.billingPeriod,
    );

    const submissionErrorHeading = props.submissionError === 'personal_details_incorrect' ? 'Sorry there was a problem' :
      'Sorry we could not process your payment';
    return (
      <Content>
        <CheckoutLayout aside={(
          <OrderSummary
            image={
              <GridImage
                gridId="subscriptionDailyPackshot"
                srcSizes={[1000, 500]}
                sizes="(max-width: 740px) 50vw, 500"
                imgType="png"
                altText=""
              />
                }
            title="Digital Gift Subscription"
            description="Premium App + The Guardian Daily + Ad-free"
            productPrice={productPrice}
            billingPeriod={props.billingPeriod}
            changeSubscription={routes.digitalSubscriptionLanding}
            orderIsAGift
          />)}
        >
          <Form onSubmit={(ev) => {
                ev.preventDefault();
                props.submitForm();
              }}
          >
            <FormSection title="Gift recipient's details">
              <PersonalDetailsDigitalGift
                firstNameGiftRecipient={props.firstNameGiftRecipient || ''}
                setFirstNameGift={props.setFirstNameGift}
                lastNameGiftRecipient={props.lastNameGiftRecipient || ''}
                setLastNameGift={props.setLastNameGift}
                emailGiftRecipient={props.emailGiftRecipient || ''}
                setEmailGift={props.setEmailGift}
                formErrors={((props.formErrors: any): FormError<PersonalDetailsFormField>[])}
              />
            </FormSection>
            <FormSection title="Gift delivery date">
              <DatePickerWithError
                id="giftDeliveryDate"
                error={firstError('giftDeliveryDate', props.formErrors)}
                value={props.giftDeliveryDate}
                onChange={date => props.setDigitalGiftDeliveryDate(date)}
              />
            </FormSection>
            <FormSection title="Personalise your gift">
              <TextAreaWithLabel
                id="gift-message"
                label="Gift message"
                maxlength={300}
                value={props.giftMessage}
                setValue={props.setGiftMessage}
                optional
              />
            </FormSection>
            <FormSection title="Your details" border="top">
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
            <FormSection title="Billing address">
              <Address />
            </FormSection>
            <PaymentMethodSelector
              country={props.country}
              paymentMethod={props.paymentMethod}
              setPaymentMethod={props.setPaymentMethod}
              onPaymentAuthorised={props.onPaymentAuthorised}
              validationError={firstError('paymentMethod', props.formErrors)}
              csrf={props.csrf}
              currencyId={props.currencyId}
              payPalHasLoaded={props.payPalHasLoaded}
              formIsValid={props.formIsValid}
              validateForm={props.validateForm}
              isTestUser={props.isTestUser}
              setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
              amount={props.amount}
              billingPeriod={props.billingPeriod}
              allErrors={[...props.formErrors, ...props.addressErrors]}
            />
            <FormSectionHiddenUntilSelected
              id="stripeForm"
              show={props.paymentMethod === Stripe}
              title="Your card details"
            >
              <StripeProviderForCountry
                country={props.country}
                isTestUser={props.isTestUser}
                submitForm={props.submitForm}
                allErrors={[...props.formErrors, ...props.addressErrors]}
                setStripePaymentMethod={props.setStripePaymentMethod}
                validateForm={props.validateForm}
                buttonText="Pay for your gift"
                csrf={props.csrf}
              />
            </FormSectionHiddenUntilSelected>
            <FormSectionHiddenUntilSelected
              id="directDebitForm"
              show={props.paymentMethod === DirectDebit}
              title="Your account details"
            >
              <DirectDebitForm
                buttonText="Pay for your gift"
                submitForm={props.submitForm}
                allErrors={[...props.formErrors, ...props.addressErrors]}
                submissionError={props.submissionError}
                submissionErrorHeading={submissionErrorHeading}
              />
            </FormSectionHiddenUntilSelected>
            <GeneralErrorMessage
              errorReason={props.submissionError}
              errorHeading={submissionErrorHeading}
            />
            <EndSummaryMobile orderIsAGift />
            <DirectDebitPaymentTerms
              paymentMethod={props.paymentMethod}
            />
          </Form>
        </CheckoutLayout>
      </Content>
    );

  }
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(DigitalCheckoutFormGift);
