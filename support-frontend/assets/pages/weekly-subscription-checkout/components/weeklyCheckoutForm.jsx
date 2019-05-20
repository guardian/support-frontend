// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { type WeeklyBillingPeriod, Annual, Quarterly, SixForSix } from 'helpers/billingPeriods';
import Rows from 'components/base/rows';
import Text from 'components/text/text';
import Button from 'components/button/button';
import { Select } from 'components/forms/select';
import { Fieldset } from 'components/forms/fieldset';
import { options } from 'components/forms/customFields/options';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { RadioInputWithHelper } from 'components/forms/customFields/radioInputWithHelper';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import Layout, { Content } from 'components/subscriptionCheckouts/layout';
import Summary from 'components/subscriptionCheckouts/summary';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { ErrorReason } from 'helpers/errorReasons';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { titles } from 'helpers/user/details';
import {
  type FormActionCreators,
  formActionCreators,
  type FormField,
  type FormFields,
  getBillingAddress,
  getDeliveryAddress,
  getDays,
  getFormFields,
  signOut,
  type State,
} from '../weeklySubscriptionCheckoutReducer';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import GridImage from 'components/gridImage/gridImage';
import type { FormField as PersonalDetailsFormField } from 'components/subscriptionCheckouts/personalDetails';
import type { IsoCountry } from 'helpers/internationalisation/country';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import CancellationSection from 'components/subscriptionCheckouts/cancellationSection';

import { countries } from 'helpers/internationalisation/country';
import { displayBillingPeriods, getCurrencyAndPrice } from 'helpers/productPrice/weeklyProductPrice';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Option } from 'helpers/types/option';
import { GuardianWeekly } from 'helpers/subscriptions';

// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  country: IsoCountry,
  countryGroupId: CountryGroupId,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  productPrices: ProductPrices,
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...getFormFields(state),
    country: state.common.internationalisation.countryId,
    countryGroupId: state.common.internationalisation.countryGroupId,
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
    productPrices: state.page.checkout.productPrices,
  };
}

function mapDispatchToProps() {
  return {
    ...formActionCreators,
    signOut,
  };
}

// ----- Form Fields ----- //

const SelectWithLabel = compose(asControlled, withLabel)(Select);
const FieldsetWithError = withError(Fieldset);

const DeliveryAddress = withStore(countries, 'delivery', getDeliveryAddress);
const BillingAddress = withStore(countries, 'billing', getBillingAddress);
const days = getDays();

// ----- Component ----- //
type Plans = {
  [WeeklyBillingPeriod]: {
    title: string,
    copy: string,
    offer: Option<string>,
    priceObject: Object,
  }
}

function WeeklyCheckoutForm(props: PropTypes) {
  const plans: Plans = Object.keys(displayBillingPeriods).reduce((ps, billingPeriod) => ({
    ...ps,
    [billingPeriod]: {
      title: displayBillingPeriods[billingPeriod].title,
      copy: displayBillingPeriods[billingPeriod].copy(props.countryGroupId),
      offer: displayBillingPeriods[billingPeriod].offer || null,
      priceObject: getCurrencyAndPrice(props.countryGroupId, billingPeriod),
    },
  }), {});

  const quarterlyPriceLabel = {
    title: plans.Quarterly.title,
    copy: plans.Quarterly.copy,
  };

  const annualPriceLabel = {
    title: plans.Annual.title,
    copy: plans.Annual.copy,
  };

  const sixForSixPriceLabel = {
    title: plans.SixForSix.title,
    copy: plans.SixForSix.copy,
    offer: plans.SixForSix.offer,
  };

  const summaryPrice = { ...plans[props.billingPeriod].priceObject };

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
          productPrice={summaryPrice}
          promotion={undefined}
          dataList={[
            {
              title: 'Delivery method',
              value: 'Home delivery',
            },
          ]}
          billingPeriod={props.billingPeriod}
          changeSubscription="/subscribe/weekly"
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
          <FormSection title="Where should we deliver your magazine?">
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
                  onChange={() => props.setbillingAddressIsSame(true)}
                />
                <RadioInput
                  text="No"
                  name="billingAddressIsSame"
                  checked={props.billingAddressIsSame === false}
                  onChange={() => props.setbillingAddressIsSame(false)}
                />
              </FieldsetWithError>
            </Rows>
          </FormSection>
          {
            props.billingAddressIsSame === false ?
              <FormSection title="Where should we bill you?">
                <BillingAddress />
              </FormSection>
            : null
          }
          <FormSection title="When would you like your subscription to start?">
            <Rows>
              <FieldsetWithError id="startDate" error={firstError('startDate', props.formErrors)} legend="When would you like your subscription to start?">
                {days.map(day => (
                  <RadioInput
                    appearance="group"
                    text={day}
                    name="machineDate"
                    checked={day === props.startDate}
                    onChange={() => props.setStartDate(day)}
                  />))
                }
              </FieldsetWithError>
              <Text className="component-text__paddingTop">
                <p>
                We will take the first payment on the
                date you receive your first Guardian Weekly.
                </p>
                <p>
                Subscription starts dates are automatically selected to be the earliest we can fulfil your order.
                </p>
              </Text>
            </Rows>
          </FormSection>
          <FormSection title="How often would you like to pay?">
            <Fieldset legend="How often would you like to pay?">
              <RadioInputWithHelper
                text={quarterlyPriceLabel.title}
                helper={quarterlyPriceLabel.copy}
                name="billingPeriod"
                checked={props.billingPeriod === Quarterly}
                onChange={() => props.setBillingPeriod(Quarterly)}
              />
              <RadioInputWithHelper
                text={annualPriceLabel.title}
                helper={annualPriceLabel.copy}
                name="billingPeriod"
                checked={props.billingPeriod === Annual}
                onChange={() => props.setBillingPeriod(Annual)}
              />
              <RadioInputWithHelper
                text={sixForSixPriceLabel.title}
                offer={sixForSixPriceLabel.offer || null}
                helper={sixForSixPriceLabel.copy}
                name="billingPeriod"
                checked={props.billingPeriod === SixForSix}
                onChange={() => props.setBillingPeriod(SixForSix)}
              />
            </Fieldset>
          </FormSection>
          <PaymentMethodSelector
            country={props.country}
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


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps())(WeeklyCheckoutForm);
