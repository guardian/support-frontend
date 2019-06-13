// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, type Dispatch } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import { weeklyBillingPeriods } from 'helpers/billingPeriods';
import Rows from 'components/base/rows';
import Text from 'components/text/text';
import Button from 'components/button/button';
import { Select } from 'components/forms/select';
import { Fieldset } from 'components/forms/fieldset';
import { options } from 'components/forms/customFields/options';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import Summary from 'components/subscriptionCheckouts/summary';
import DirectDebitPopUpForm
  from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { ErrorReason } from 'helpers/errorReasons';
import {
  getProductPrice,
  type ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { titles } from 'helpers/user/details';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import GridImage from 'components/gridImage/gridImage';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import type { FormField as PersonalDetailsFormField } from 'helpers/subscriptionsForms/formFields';
import PersonalDetailsGift
  from 'components/subscriptionCheckouts/personalDetailsGift';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { countries } from 'helpers/internationalisation/country';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import CancellationSection
  from 'components/subscriptionCheckouts/cancellationSection';
import { GuardianWeekly } from 'helpers/subscriptions';
import type {
  FormField,
  FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
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
import { CheckboxInput } from 'components/forms/customFields/checkbox';

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
  };
}

function mapDispatchToProps() {
  return {
    ...formActionCreators,
    submitForm: () => (dispatch: Dispatch<Action>, getState: () => WithDeliveryCheckoutState) =>
      submitWithDeliveryForm(dispatch, getState()),
    signOut,
  };
}

// ----- Form Fields ----- //

const SelectWithLabel = compose(asControlled, withLabel)(Select);
const FieldsetWithError = withError(Fieldset);

const DeliveryAddress = withStore(countries, 'delivery', getDeliveryAddress);
const BillingAddress = withStore(countries, 'billing', getBillingAddress);
const days = getWeeklyDays();

// ----- Component ----- //

class WeeklyCheckoutForm extends Component<PropTypes> {
  componentDidMount() {
    const { props } = this;
    // The localStorage solution is a temporary fix until we have a url builder for weekly checkout
    const billingPeriodSelected = window.localStorage.getItem('billingPeriodSelected');
    props.setBillingPeriod(billingPeriodSelected);
    props.setSixWeeklySelected(billingPeriodSelected === 'SixWeekly');
  }

  componentWillUnmount() {
    window.localStorage.removeItem('billingPeriodSelected');
  }

  render() {
    const { props } = this;
    const {
      deliveryCountry,
      billingAddressIsSame,
      billingPeriod,
      billingCountry,
      productPrices,
      orderIsAGift,
      product,
      submitForm,
    } = props;

    const fulfilmentOption = getWeeklyFulfilmentOption(deliveryCountry);
    const price = getProductPrice(productPrices, billingCountry, billingPeriod, fulfilmentOption);
    const subscriptionStart = `When would you like ${orderIsAGift ? 'the' : 'your'} subscription to start?`;

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
            billingPeriod={billingPeriod}
            changeSubscription={routes.guardianWeeklySubscriptionLanding}
            product={product}
          />
        )}
        >
          <Form onSubmit={(ev) => {
            ev.preventDefault();
            submitForm();
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
                text="This is a gift"
                checked={orderIsAGift}
                onChange={() => props.setGiftStatus(!orderIsAGift)}
              />
              {!orderIsAGift ? <DeliveryAddress /> : null}
            </FormSection>
            {orderIsAGift ? (
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
                    firstNameGiftRecipient={props.firstNameGiftRecipient}
                    setFirstNameGift={props.setFirstNameGift}
                    lastNameGiftRecipient={props.lastNameGiftRecipient}
                    setLastNameGift={props.setLastNameGift}
                    emailGiftRecipient={props.emailGiftRecipient}
                    setEmailGift={props.setEmailGift}
                    formErrors={((props.formErrors: any): FormError<PersonalDetailsFormField>[])}
                  />
                </FormSection>
                <FormSection title="Gift recipient's address">
                  <DeliveryAddress />
                </FormSection>
              </span>)
            : null}
            <FormSection title={orderIsAGift ?
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
                    checked={billingAddressIsSame === true}
                    onChange={() => props.setBillingAddressIsSame(true)}
                  />
                  <RadioInput
                    text="No"
                    name="billingAddressIsSame"
                    checked={billingAddressIsSame === false}
                    onChange={() => props.setBillingAddressIsSame(false)}
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
              onChange={() => props.setBillingPeriod(billingPeriod)}
              billingPeriods={weeklyBillingPeriods}
              billingCountry={props.billingCountry}
              productPrices={props.productPrices}
              selected={props.billingPeriod}
              sixWeeklySelected={props.sixWeeklySelected}
            />
            <PaymentMethodSelector
              country={props.billingCountry}
              product={GuardianWeekly}
              paymentMethod={props.paymentMethod}
              setPaymentMethod={props.setPaymentMethod}
              onPaymentAuthorised={props.onPaymentAuthorised}
              validationError={firstError('paymentMethod', props.formErrors)}
              submissionError={props.submissionError}
            />
            <FormSection noBorder>
              <Button aria-label={null} type="submit">Continue to payment</Button>
              <DirectDebitPopUpForm
                buttonText="Subscribe with Direct Debit"
                onPaymentAuthorisation={(pa: PaymentAuthorisation) => {
                  props.onPaymentAuthorised(pa);
                }}
              />
            </FormSection>
            <CancellationSection />
          </Form>
        </Layout>
      </Content>
    );
  }
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(WeeklyCheckoutForm);
