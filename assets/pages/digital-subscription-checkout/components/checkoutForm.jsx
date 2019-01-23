// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { caStates, countries, type IsoCountry, usStates } from 'helpers/internationalisation/country';
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { type Option } from 'helpers/types/option';
import { type CountryGroupId, fromCountry } from 'helpers/internationalisation/countryGroup';
import { Annual, type DigitalBillingPeriod, Monthly } from 'helpers/billingPeriods';
import { getDigitalPrice } from 'helpers/subscriptions';
import { showPrice } from 'helpers/internationalisation/price';

import ProductPageContentBlockOutset from 'components/productPage/productPageContentBlock/productPageContentBlockOutset';
import CheckoutCopy from 'components/checkoutCopy/checkoutCopy';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { Fieldset } from 'components/forms/standardFields/fieldset';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withFooter } from 'components/forms/formHOCs/withFooter';
import { withError } from 'components/forms/formHOCs/withError';
import { asControlled } from 'components/forms/formHOCs/asControlled';
import { canShow } from 'components/forms/formHOCs/canShow';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import Checkout from 'components/checkout/checkout';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import type { ErrorReason } from 'helpers/errorReasons';
import {
  type FormActionCreators,
  formActionCreators,
  signOut,
  type FormField,
  type FormFields,
  getFormFields,
  type State,
} from '../digitalSubscriptionCheckoutReducer';
import { countrySupportsDirectDebit } from '../helpers/paymentProviders';


// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  signOut: typeof signOut,
  formErrors: FormError<FormField>[],
  submissionError: ErrorReason | null,
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...getFormFields(state),
    formErrors: state.page.checkout.formErrors,
    submissionError: state.page.checkout.submissionError,
  };
}


// ----- Functions ----- //

function getPrice(country: Option<IsoCountry>, frequency: DigitalBillingPeriod): string {

  const cgId: ?CountryGroupId = fromCountry(country || '');

  if (cgId) {

    const price = getDigitalPrice(cgId, frequency);
    return `${showPrice(price, true)} `;

  }

  return '';

}


// ----- Form Fields ----- //

const InputWithLabel = withLabel(Input);
const InputWithFooter = withFooter(InputWithLabel);
const Input1 = compose(asControlled, withError)(InputWithLabel);
const Select1 = compose(asControlled, withError, withLabel)(Select);
const Select2 = canShow(Select1);

function statesForCountry(country: Option<IsoCountry>): React$Node {

  switch (country) {
    case 'US':
      return sortedOptions(usStates);
    case 'CA':
      return sortedOptions(caStates);
    default:
      return null;
  }

}


// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  const errorHeading = props.submissionError === 'personal_details_incorrect' ? 'Failed to Create Subscription' :
    'Payment Attempt Failed';
  const errorState = props.submissionError ?
    <GeneralErrorMessage errorReason={props.submissionError} errorHeading={errorHeading} /> :
    null;

  return (
    <ProductPageContentBlock modifierClasses={['your-details']}>
      <ProductPageContentBlockOutset>
        <Checkout>
          <Form onSubmit={(ev) => { ev.preventDefault(); props.submitForm(); }}>
            <FormSection title="Your details" >
              <Input1
                id="first-name"
                label="First name"
                type="text"
                value={props.firstName}
                setValue={props.setFirstName}
                error={firstError('firstName', props.formErrors)}
              />
              <Input1
                id="last-name"
                label="Last name"
                type="text"
                value={props.lastName}
                setValue={props.setLastName}
                error={firstError('lastName', props.formErrors)}
              />
              <InputWithFooter
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
                        <Button appearance="greyHollow" icon={null} type="button" aria-label={null} onClick={() => props.signOut()}>Sign out</Button> and create a new account.
                      </p>
                    </CheckoutExpander>
                  </span>
              )}
              />
              <Select1
                id="country"
                label="Country"
                value={props.country}
                setValue={props.setCountry}
                error={firstError('country', props.formErrors)}
              >
                <option value="">--</option>
                {sortedOptions(countries)}
              </Select1>
              <Select2
                id="stateProvince"
                label={props.country === 'CA' ? 'Province/Territory' : 'State'}
                value={props.stateProvince}
                setValue={props.setStateProvince}
                error={firstError('stateProvince', props.formErrors)}
                isShown={props.country === 'US' || props.country === 'CA'}
              >
                <option value="">--</option>
                {statesForCountry(props.country)}
              </Select2>
              <Input1
                id="telephone"
                label="Telephone (optional)"
                type="tel"
                value={props.telephone}
                setValue={props.setTelephone}
                error={firstError('telephone', props.formErrors)}
              />
            </FormSection>
            <FormSection title="How often would you like to pay?">
              <Fieldset>
                <RadioInput
                  text={`${getPrice(props.country, Monthly)}Every month`}
                  name="billingPeriod"
                  checked={props.billingPeriod === Monthly}
                  onChange={() => props.setBillingPeriod(Monthly)}
                />
                <RadioInput
                  text={`${getPrice(props.country, Annual)}Every year`}
                  name="billingPeriod"
                  checked={props.billingPeriod === Annual}
                  onChange={() => props.setBillingPeriod(Annual)}
                />
              </Fieldset>
            </FormSection>
            <FormSection title={countrySupportsDirectDebit(props.country) ? 'How would you like to pay?' : null}>
              {countrySupportsDirectDebit(props.country) &&
              <div>
                <Fieldset>
                  <RadioInput
                    text="Direct debit"
                    name="paymentMethod"
                    checked={props.paymentMethod === 'DirectDebit'}
                    onChange={() => props.setPaymentMethod('DirectDebit')}
                  />
                  <RadioInput
                    text="Credit/Debit card"
                    name="paymentMethod"
                    checked={props.paymentMethod === 'Stripe'}
                    onChange={() => props.setPaymentMethod('Stripe')}
                  />
                </Fieldset>
              </div>
          }
              <CheckoutCopy
                strong="Money Back Guarantee "
                copy="If you wish to cancel your subscription, we will send you a refund of the unexpired part of your subscription."
              />
              <CheckoutCopy
                strong="Cancel any time you want. "
                copy="There is no set time on your agreement so you can stop your subscription anytime."
              />
              <DirectDebitPopUpForm
                onPaymentAuthorisation={(pa: PaymentAuthorisation) => { props.onPaymentAuthorised(pa); }}
              />
            </FormSection>
            <FormSection>
              {errorState}
              <Button aria-label={null} type="submit">Continue to payment</Button>
            </FormSection>
          </Form>
        </Checkout>
      </ProductPageContentBlockOutset>
    </ProductPageContentBlock>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, { ...formActionCreators, signOut })(CheckoutForm);
