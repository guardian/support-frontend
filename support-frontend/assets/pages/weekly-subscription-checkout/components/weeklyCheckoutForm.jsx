// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose, type Dispatch } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import { weeklyBillingPeriods } from 'helpers/billingPeriods';
import Rows from 'components/base/rows';
import Text from 'components/text/text';
import { Select } from 'components/forms/select';
import { Fieldset } from 'components/forms/fieldset';
import { options } from 'components/forms/customFields/options';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';
import Form, { FormSection, FormSectionHiddenUntilSelected } from 'components/checkoutForm/checkoutForm';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import Summary from 'components/subscriptionCheckouts/summary';
import type { ErrorReason } from 'helpers/errorReasons';
import {
  getProductPrice,
  type ProductPrices,
} from 'helpers/productPrice/productPrices';
import { titles } from 'helpers/user/details';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import GridImage from 'components/gridImage/gridImage';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import type {
  FormField as PersonalDetailsFormField,
  FormField,
  FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import PersonalDetailsGift
  from 'components/subscriptionCheckouts/personalDetailsGift';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countries } from 'helpers/internationalisation/country';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import CancellationSection
  from 'components/subscriptionCheckouts/cancellationSection';
import { GuardianWeekly } from 'helpers/subscriptions';
import { signOut } from 'helpers/user/user';
import type {
  Action,
  FormActionCreators,
} from 'helpers/subscriptionsForms/formActions';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddress,
  getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { submitWithDeliveryForm } from 'helpers/subscriptionsForms/submit';
import { formatMachineDate, formatUserDate } from 'helpers/dateConversions';
import { routes } from 'helpers/routes';
import { BillingPeriodSelector } from 'components/subscriptionCheckouts/billingPeriodSelector';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { CheckboxInput } from 'components/forms/customFields/checkbox';
import { addressActionCreatorsFor, type SetCountryChangedAction } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { type SetCountryAction } from 'helpers/page/commonActions';
import { SubscriptionSubmitButton } from 'components/subscriptionCheckouts/subscriptionSubmitButton';
import { DirectDebit, Stripe } from 'helpers/paymentMethods';
import { validateWithDeliveryForm } from 'helpers/subscriptionsForms/formValidation';
import GeneralErrorMessage
  from 'components/generalErrorMessage/generalErrorMessage';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import { getGlobal } from 'helpers/globals';

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  billingCountry: IsoCountry,
  deliveryCountry: IsoCountry,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  ...FormActionCreators,
  submitForm: Function,
  setBillingCountry: Function,
  billingAddressErrors: Array<Object>,
  deliveryAddressErrors: Array<Object>,
  country: IsoCountry,
  isTestUser: boolean,
  validateForm: () => Function,
  stripeSetupIntentEndpoint: string
|};

// ----- Map State/Props ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
  const { billingAddress, deliveryAddress } = state.page;
  const { billingAddressIsSame } = state.page.checkout;
  return {
    ...getFormFields(state),
    billingCountry: billingAddressIsSame ? deliveryAddress.fields.country : billingAddress.fields.country,
    deliveryCountry: deliveryAddress.fields.country,
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
    deliveryAddressErrors: state.page.deliveryAddress.fields.formErrors,
    billingAddressErrors: state.page.billingAddress.fields.formErrors,
    isTestUser: state.page.checkout.isTestUser,
    country: state.common.internationalisation.countryId,
    stripeSetupIntentEndpoint: getGlobal('stripeSetupIntentEndpoint'),
  };
}

function mapDispatchToProps() {
  const { setCountry } = addressActionCreatorsFor('billing');
  return {
    ...formActionCreators,
    submitForm: () => (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
      submitWithDeliveryForm(dispatch, getState()),
    signOut,
    setBillingCountry: country => (dispatch: Dispatch<SetCountryChangedAction | SetCountryAction>) =>
      setCountry(country)(dispatch),
    validateForm: () => (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) => {
      const state = getState();
      validateWithDeliveryForm(dispatch, state);
    },
  };
}

// ----- Form Fields ----- //

const SelectWithLabel = compose(asControlled, withLabel)(Select);
const FieldsetWithError = withError(Fieldset);

const DeliveryAddress = withStore(countries, 'delivery', getDeliveryAddress);
const BillingAddress = withStore(countries, 'billing', getBillingAddress);
const days = getWeeklyDays();

// ----- Component ----- //

function WeeklyCheckoutForm(props: PropTypes) {
  const fulfilmentOption = getWeeklyFulfilmentOption(props.deliveryCountry);
  const price = getProductPrice(props.productPrices, props.billingCountry, props.billingPeriod, fulfilmentOption);
  const subscriptionStart = `When would you like ${props.orderIsAGift ? 'the' : 'your'} subscription to start?`;
  const submissionErrorHeading = props.submissionError === 'personal_details_incorrect' ? 'Sorry there was a problem' :
    'Sorry we could not process your payment';

  const setBillingAddressIsSameHandler = (newState) => {
    props.setBillingAddressIsSame(newState);
    props.setBillingCountry(props.deliveryCountry);
  };

  return (
    <Content modifierClasses={['your-details']}>
      <Layout aside={(
        <Summary
          image={
            <GridImage
              gridId="checkoutPackshotWeekly"
              srcSizes={[696, 500]}
              sizes="(max-width: 740px) 50vw, 696"
              imgType="png"
              altText=""
            />
          }
          title="Guardian Weekly"
          description=""
          productPrice={price}
          dataList={[
            {
              title: 'Delivery method',
              value: 'Home delivery',
            },
          ]}
          billingPeriod={props.billingPeriod}
          changeSubscription={routes.guardianWeeklySubscriptionLanding}
          product={props.product}
        />
      )}
      >
        <Form onSubmit={(ev) => {
          ev.preventDefault();
          props.submitForm();
        }}
        >
          <FormSection title="Your details">
            <SelectWithLabel
              id="title"
              label="Title"
              optional
              value={props.title}
              setValue={props.setTitle}
            >
              <option value="">--</option>
              {options(titles)}
            </SelectWithLabel>
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
          <FormSection title="Where should we deliver your magazine?">
            <CheckboxInput
              id="qa-gift-checkbox"
              text="This is a gift"
              checked={props.orderIsAGift}
              onChange={() => props.setGiftStatus(!props.orderIsAGift)}
            />
            {!props.orderIsAGift ? <DeliveryAddress /> : null}
          </FormSection>
          {props.orderIsAGift ? (
            <span>
              <FormSection title="Gift recipient's details">
                <SelectWithLabel
                  id="title"
                  label="Title"
                  optional
                  value={props.titleGiftRecipient}
                  setValue={props.setTitleGift}
                >
                  <option value="">--</option>
                  {options(titles)}
                </SelectWithLabel>
                <PersonalDetailsGift
                  firstNameGiftRecipient={props.firstNameGiftRecipient || ''}
                  setFirstNameGift={props.setFirstNameGift}
                  lastNameGiftRecipient={props.lastNameGiftRecipient || ''}
                  setLastNameGift={props.setLastNameGift}
                  emailGiftRecipient={props.emailGiftRecipient || ''}
                  setEmailGift={props.setEmailGift}
                  formErrors={((props.formErrors: any): FormError<PersonalDetailsFormField>[])}
                  isGiftRecipient
                />
              </FormSection>
              <FormSection title="Gift recipient's address">
                <DeliveryAddress />
              </FormSection>
            </span>)
          : null}
          <FormSection title={props.orderIsAGift ?
            'Is the billing address the same as the recipient\'s address?'
            : 'Is the billing address the same as the delivery address?'}
          >
            <Rows>
              <FieldsetWithError
                id="billingAddressIsSame"
                error={firstError('billingAddressIsSame', props.formErrors)}
                legend="Is the billing address the same as the delivery address?"
              >
                <RadioInput
                  text="Yes"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === true}
                  onChange={() => setBillingAddressIsSameHandler(true)}
                />
                <RadioInput
                  inputId="qa-billing-address-different"
                  text="No"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === false}
                  onChange={() => setBillingAddressIsSameHandler(false)}
                />
              </FieldsetWithError>
            </Rows>
          </FormSection>
          {
            props.billingAddressIsSame === false ?
              <FormSection title="Your billing address">
                <BillingAddress />
              </FormSection>
            : null
          }
          <FormSection title={subscriptionStart}>
            <Rows>
              <FieldsetWithError id="startDate" error={firstError('startDate', props.formErrors)} legend={subscriptionStart}>
                {days.map((day) => {
                  const [userDate, machineDate] = [formatUserDate(day), formatMachineDate(day)];
                  return (
                    <RadioInput
                      appearance="group"
                      text={userDate}
                      name={machineDate}
                      checked={machineDate === props.startDate}
                      onChange={() => props.setStartDate(machineDate)}
                    />
                  );
                })
                }
              </FieldsetWithError>
              <Text className="component-text__paddingTop">
                <p className="component-text__sans">
                We will take the first payment on the
                date you receive your first Guardian Weekly.
                </p>
                <p className="component-text__sans">
                Subscription starts dates are automatically selected to be the earliest we can fulfil your order.
                </p>
              </Text>
            </Rows>
          </FormSection>
          <BillingPeriodSelector
            fulfilmentOption={fulfilmentOption}
            onChange={billingPeriod => props.setBillingPeriod(billingPeriod)}
            billingPeriods={weeklyBillingPeriods}
            billingCountry={props.billingCountry}
            productPrices={props.productPrices}
            selected={props.billingPeriod}
          />
          <PaymentMethodSelector
            country={props.billingCountry}
            product={GuardianWeekly}
            paymentMethod={props.paymentMethod}
            setPaymentMethod={props.setPaymentMethod}
            onPaymentAuthorised={props.onPaymentAuthorised}
            validationError={firstError('paymentMethod', props.formErrors)}
          />
          <SubscriptionSubmitButton
            paymentMethod={props.paymentMethod}
            allErrors={[...props.billingAddressErrors, ...props.deliveryAddressErrors, ...props.formErrors]}
            className={DirectDebit}
            text="Pay now"
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
              allErrors={[...props.billingAddressErrors, ...props.deliveryAddressErrors, ...props.formErrors]}
              setStripeToken={props.setStripeToken}
              setStripePaymentMethod={props.setStripePaymentMethod}
              stripeSetupIntentEndpoint={props.stripeSetupIntentEndpoint}
              name={`${props.firstName} ${props.lastName}`}
              validateForm={props.validateForm}
              buttonText="Pay now"
            />
          </FormSectionHiddenUntilSelected>
          <GeneralErrorMessage
            errorReason={props.submissionError}
            errorHeading={submissionErrorHeading}
          />
          <CancellationSection />
        </Form>
      </Layout>
    </Content>
  );
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(WeeklyCheckoutForm);
