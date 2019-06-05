// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose, type Dispatch } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';
import { routes } from 'helpers/routes';

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
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion, regularPrice } from 'helpers/productPrice/paperProductPrices';
import {
  getShortDescription,
  getTitle,
} from '../../paper-subscription-landing/helpers/products';
import { HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { titles } from 'helpers/user/details';
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
import { type FormField as PersonalDetailsFormField } from 'helpers/subscriptionsForms/formFields';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import CancellationSection
  from 'components/subscriptionCheckouts/cancellationSection';
import { newspaperCountries } from 'helpers/internationalisation/country';
import { Paper } from 'helpers/subscriptions';
import { signOut } from 'helpers/user/user';
import { getDays } from 'pages/paper-subscription-checkout/helpers/options';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import {
  getBillingAddress,
  getDeliveryAddress,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { submitWithDeliveryForm } from 'helpers/subscriptionsForms/submit';

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  ...FormActionCreators,
  submitForm: Function,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
  return {
    ...getFormFields(state),
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

const DeliveryAddress = withStore(newspaperCountries, 'delivery', getDeliveryAddress);
const BillingAddress = withStore(newspaperCountries, 'billing', getBillingAddress);

// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  const days = getDays(props.fulfilmentOption, props.productOption);
  const fulfilmentOptionDescriptor = props.fulfilmentOption === HomeDelivery ? 'Paper' : 'Voucher booklet';
  const fulfilmentOptionName = props.fulfilmentOption === HomeDelivery ? 'Home delivery' : 'Voucher booklet';

  return (
    <Content modifierClasses={['your-details']}>
      <Layout aside={(
        <Summary
          image={
            <GridImage
              gridId="checkoutPackshotPaperGraunVoucher"
              srcSizes={[696, 500]}
              sizes="(max-width: 740px) 50vw, 696"
              imgType="png"
              altText=""
            />
          }
          title={`${getTitle(props.productOption)} ${fulfilmentOptionDescriptor.toLowerCase()}`}
          description={getShortDescription(props.productOption)}
          productPrice={regularPrice(
            props.productPrices,
            props.fulfilmentOption,
            props.productOption,
          )}
          promotion={getPromotion(
            props.productPrices,
            props.fulfilmentOption,
            props.productOption,
          )}
          dataList={[
            {
              title: 'Delivery method',
              value: fulfilmentOptionName,
            },
          ]}
          billingPeriod="Monthly"
          changeSubscription={routes.paperSubscriptionProductChoices}
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
              formErrors={((props.formErrors: any): FormError<PersonalDetailsFormField>[])}
              signOut={props.signOut}
            />
          </FormSection>
          <FormSection title="Where should we deliver your vouchers?">
            <DeliveryAddress />
          </FormSection>
          <FormSection title="Is the billing address the same as the delivery address?">
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
                  onChange={() => props.setBillingAddressIsSame(true)}
                />
                <RadioInput
                  text="No"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === false}
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
          <FormSection title="When would you like your subscription to start?">
            <Rows>
              <FieldsetWithError
                id="startDate"
                error={firstError('startDate', props.formErrors)}
                legend="When would you like your subscription to start?"
              >
                {days.map((day) => {
                  const [userDate, machineDate] = [formatUserDate(day), formatMachineDate(day)];
                  return (
                    <RadioInput
                      appearance="group"
                      text={userDate}
                      name={machineDate}
                      checked={props.startDate === machineDate}
                      onChange={() => props.setStartDate(machineDate)}
                    />
                  );
                })}
              </FieldsetWithError>
              <Text className="component-text__paddingTop">
                <p>
                  We will take the first payment on the
                  date you receive your first {fulfilmentOptionDescriptor.toLowerCase()}.
                </p>
                <p>
                  Subscription starts dates are automatically selected to be the earliest we can fulfil your order.
                </p>
              </Text>
            </Rows>
          </FormSection>
          <PaymentMethodSelector
            country="GB"
            product={Paper}
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


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(CheckoutForm);
