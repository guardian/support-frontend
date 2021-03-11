// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useEffect } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { RadioGroup, Radio } from '@guardian/src-radio';
import { TextArea } from '@guardian/src-text-area';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import { routes } from 'helpers/routes';

import Rows from 'components/base/rows';
import Text from 'components/text/text';
import Form, { FormSection, FormSectionHiddenUntilSelected } from 'components/checkoutForm/checkoutForm';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/paperProductPrices';
import { getTitle } from '../../paper-subscription-landing/helpers/products';
import { HomeDelivery, Collection } from 'helpers/productPrice/fulfilmentOptions';
import { formatMachineDate, formatUserDate } from 'helpers/dateConversions';
import {
  type FormField,
  type FormFields,
  getFormFields,
} from 'helpers/subscriptionsForms/formFields';

import type { Action } from 'helpers/subscriptionsForms/formActions';
import {
  type FormActionCreators,
  formActionCreators,
} from 'helpers/subscriptionsForms/formActions';

import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import GridImage from 'components/gridImage/gridImage';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { newspaperCountries } from 'helpers/internationalisation/country';
import { signOut } from 'helpers/user/user';
import { getDays } from 'pages/paper-subscription-checkout/helpers/options';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddress,
  getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { submitWithDeliveryForm } from 'helpers/subscriptionsForms/submit';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Stripe, DirectDebit, PayPal } from 'helpers/paymentMethods';
import { validateWithDeliveryForm } from 'helpers/subscriptionsForms/formValidation';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { withDeliveryFormIsValid } from 'helpers/subscriptionsForms/formValidation';
import { setupSubscriptionPayPalPayment } from 'helpers/paymentIntegrations/payPalRecurringCheckout';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import { type Option } from 'helpers/types/option';
import { Paper } from 'helpers/subscriptions';
import OrderSummary from 'pages/paper-subscription-checkout/components/orderSummary/orderSummary';
import type { ActivePaperProducts } from 'helpers/productPrice/productOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import EndSummaryMobile from 'pages/paper-subscription-checkout/components/endSummary/endSummaryMobile';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import { getPaymentStartDate, getFormattedStartDate } from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { titles } from 'helpers/user/details';
import { Select, Option as OptionForSelect } from '@guardian/src-select';
import { options } from 'components/forms/customFields/options';


const marginBottom = css`
  margin-bottom: ${space[6]}px;
`;

const controlTextAreaResizing = css`
  resize: vertical;
`;

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  ...FormActionCreators,
  submitForm: Function,
  billingAddressErrors: Array<Object>,
  deliveryAddressErrors: Array<Object>,
  country: IsoCountry,
  isTestUser: boolean,
  validateForm: () => Function,
  csrf: Csrf,
  currencyId: IsoCurrency,
  payPalHasLoaded: boolean,
  formIsValid: Function,
  setupRecurringPayPalPayment: Function,
  amount: number,
  useDigitalVoucher: Option<boolean>,
  productOption: ActivePaperProducts,
  fulfilmentOption: FulfilmentOptions,
|};

// ----- Map State/Props ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    ...getFormFields(state),
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
    billingAddressErrors: state.page.deliveryAddress.fields.formErrors,
    deliveryAddressErrors: state.page.billingAddress.fields.formErrors,
    isTestUser: state.page.checkout.isTestUser,
    country: state.common.internationalisation.countryId,
    csrf: state.page.csrf,
    currencyId: state.common.internationalisation.currencyId,
    payPalHasLoaded: state.page.checkout.payPalHasLoaded,
    useDigitalVoucher: state.common.settings.useDigitalVoucher,
    amount: getProductPrice(
      state.page.checkout.productPrices,
      state.page.checkout.fulfilmentOption,
      state.page.checkout.productOption,
    ).price,
  };
}

function mapDispatchToProps() {
  return {
    ...formActionCreators,
    formIsValid: () =>
      (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) => withDeliveryFormIsValid(getState()),
    submitForm: () => (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
      submitWithDeliveryForm(dispatch, getState()),
    validateForm: () => (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) => {
      const state = getState();
      validateWithDeliveryForm(dispatch, state);
    },
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
    signOut,
  };
}

// ----- Form Fields ----- //

const DeliveryAddress = withStore(newspaperCountries, 'delivery', getDeliveryAddress);
const BillingAddress = withStore(newspaperCountries, 'billing', getBillingAddress);

// ----- Lifecycle hooks ----- //

// Updated to use useEffect so it only fires once (like componentDidMount)
function setSubsCardStartDateInState(setStartDate, startDate) {
  useEffect(() => {
    setStartDate(formatMachineDate(startDate));
  }, []);
}

// ----- Component ----- //

function PaperCheckoutForm(props: PropTypes) {
  const collectionOption = props.useDigitalVoucher ? 'Subscription card' : 'Voucher booklet';
  const collectionOptionDescription = props.useDigitalVoucher ? 'subscription card' : 'vouchers';
  const days = getDays(props.fulfilmentOption, props.productOption);
  const fulfilmentOptionDescriptor = props.fulfilmentOption === HomeDelivery ? 'Newspaper' : collectionOption;
  const deliveryTitle = props.fulfilmentOption === HomeDelivery ? 'Where should we deliver your newspaper?' : `Where should we deliver your ${collectionOptionDescription}?`;
  const submissionErrorHeading = props.submissionError === 'personal_details_incorrect' ? 'Sorry there was a problem' :
    'Sorry we could not process your payment';
  const title = `${getTitle(props.productOption)} ${fulfilmentOptionDescriptor.toLowerCase()}`;
  const productPrice = getProductPrice(
    props.productPrices,
    props.fulfilmentOption,
    props.productOption,
  );
  const paymentMethods = supportedPaymentMethods(props.country);
  const isSubscriptionCard = props.useDigitalVoucher && props.fulfilmentOption === Collection;
  let formattedStartDate = '';
  if (isSubscriptionCard) {
    const timeNow = Date.now();
    const startDate = getPaymentStartDate(timeNow, props.productOption);
    formattedStartDate = getFormattedStartDate(getPaymentStartDate(timeNow, props.productOption));
    setSubsCardStartDateInState(props.setStartDate, startDate);
  }

  const subsCardOrderSummary = (<OrderSummary
    image={
      <GridImage
        gridId="printCampaignDigitalVoucher"
        srcSizes={[500]}
        sizes="(max-width: 740px) 50vw, 696"
        imgType="png"
        altText=""
      />}
    title={title}
    productPrice={productPrice}
    billingPeriod="Monthly"
    changeSubscription={routes.paperSubscriptionProductChoices}
    productType={Paper}
    paymentStartDate={formattedStartDate}
  />);

  const homeDeliveryOrderSummary = (<OrderSummary
    image={
      <GridImage
        gridId="printCampaignHDdigitalVoucher"
        srcSizes={[500]}
        sizes="(max-width: 740px) 50vw, 696"
        imgType="png"
        altText=""
      />
    }
    title={title}
    productPrice={productPrice}
    billingPeriod="Monthly"
    changeSubscription={routes.paperSubscriptionDeliveryProductChoices}
    product={Paper}
  />);

  return (
    <Content modifierClasses={['your-details']}>
      <Layout aside={isSubscriptionCard ? subsCardOrderSummary : homeDeliveryOrderSummary}>
        <Form onSubmit={(ev) => {
          ev.preventDefault();
          props.submitForm();
        }}
        >
          <FormSection title="Your details">
            <Select
              css={marginBottom}
              id="title"
              label="Title"
              optional
              value={props.title}
              onChange={e => props.setTitle(e.target.value)}
            >
              <OptionForSelect>Select a title</OptionForSelect>
              {options(titles)}
            </Select>
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

          <FormSection title={deliveryTitle}>
            <DeliveryAddress />
            {
              props.fulfilmentOption === HomeDelivery ?
                <TextArea
                  css={controlTextAreaResizing}
                  id="delivery-instructions"
                  label="Delivery instructions"
                  autocomplete="new-password" // Using "new-password" here because "off" isn't working in chrome
                  supporting="Please let us know any details to help us find your property (door colour, any access issues) and the best place to leave your newspaper. For example, 'Front door - red - on Crinan Street, put through letterbox'"
                  maxlength={250}
                  value={props.deliveryInstructions}
                  onChange={e => props.setDeliveryInstructions(e.target.value)}
                  optional
                />
                : null
            }
          </FormSection>

          <FormSection title="Is the billing address the same as the delivery address?">
            <Rows>
              <RadioGroup
                label="Is the billing address the same as the delivery address?"
                hideLabel
                id="billingAddressIsSame"
                name="billingAddressIsSame"
                orienntation="vertical"
                error={firstError('billingAddressIsSame', props.formErrors)}
              >
                <Radio
                  inputId="qa-billing-address-same"
                  value="yes"
                  label="Yes"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === true}
                  onChange={() => props.setBillingAddressIsSame(true)}
                />

                <Radio
                  id="qa-billing-address-different"
                  label="No"
                  value="no"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === false}
                  onChange={() => props.setBillingAddressIsSame(false)}
                />
              </RadioGroup>
            </Rows>
          </FormSection>
          {
            props.billingAddressIsSame === false ?
              <FormSection title="Your billing address">
                <BillingAddress />
              </FormSection>
              : null
          }
          {!isSubscriptionCard ? (
            <FormSection title="When would you like your subscription to start?">
              <Rows>
                <RadioGroup
                  label="When would you like your subscription to start?"
                  hideLabel
                  id="startDate"
                  error={firstError('startDate', props.formErrors)}
                  legend="When would you like your subscription to start?"
                >
                  {days.map((day) => {
                    const [userDate, machineDate] = [formatUserDate(day), formatMachineDate(day)];
                    return (
                      <Radio
                        label={userDate}
                        value={userDate}
                        name={machineDate}
                        checked={machineDate === props.startDate}
                        onChange={() => props.setStartDate(machineDate)}
                      />
                    );
                  })
                  }
                </RadioGroup>
                <Text className="component-text__paddingTop">
                  <p>
                  We will take the first payment on the
                  date you receive your first {fulfilmentOptionDescriptor.toLowerCase()}.
                  </p>
                  <p>
                Subscription start dates are automatically selected to be the earliest we can fulfil your order.
                  </p>
                </Text>
              </Rows>
            </FormSection>) : null}
          {paymentMethods.length > 1 ?
            <FormSection title="How would you like to pay?">
              <PaymentMethodSelector
                country="GB"
                paymentMethod={props.paymentMethod}
                setPaymentMethod={props.setPaymentMethod}
                validationError={firstError('paymentMethod', props.formErrors)}
              />
            </FormSection> : null}
          <FormSectionHiddenUntilSelected
            id="stripeForm"
            show={props.paymentMethod === Stripe}
            title="Your card details"
          >
            <StripeProviderForCountry
              country={props.country}
              isTestUser={props.isTestUser}
              submitForm={props.submitForm}
              allErrors={[...props.billingAddressErrors, ...props.deliveryAddressErrors, ...props.formErrors]}
              setStripePaymentMethod={props.setStripePaymentMethod}
              name={`${props.firstName} ${props.lastName}`}
              validateForm={props.validateForm}
              buttonText="Pay now"
              csrf={props.csrf}
            />
          </FormSectionHiddenUntilSelected>
          <FormSectionHiddenUntilSelected
            id="directDebitForm"
            show={props.paymentMethod === DirectDebit}
            title="Your account details"
          >
            <DirectDebitForm
              buttonText="Subscribe"
              submitForm={props.submitForm}
              allErrors={[...props.billingAddressErrors, ...props.deliveryAddressErrors, ...props.formErrors]}
              submissionError={props.submissionError}
              submissionErrorHeading={submissionErrorHeading}
            />
          </FormSectionHiddenUntilSelected>
          {props.paymentMethod === PayPal ? (
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
              allErrors={[...props.billingAddressErrors, ...props.deliveryAddressErrors, ...props.formErrors]}
            />) : null}
          <GeneralErrorMessage
            errorReason={props.submissionError}
            errorHeading={submissionErrorHeading}
          />
          <EndSummaryMobile paymentStartDate={formattedStartDate} />
          <DirectDebitPaymentTerms paymentMethod={props.paymentMethod} />
        </Form>
      </Layout>
    </Content>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(PaperCheckoutForm);
