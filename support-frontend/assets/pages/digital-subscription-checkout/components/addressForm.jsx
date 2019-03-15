// @flow

import React from 'react';
import { compose } from 'redux';

// helpers
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { isPostcodeOptional } from 'pages/digital-subscription-checkout/helpers/validation';
import { auStates, caStates, countries, type IsoCountry, usStates } from 'helpers/internationalisation/country';
import type { Option } from 'helpers/types/option';

// hocs
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';
import { canShow } from 'hocs/canShow';

// components
import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';

const InputWithLabel = withLabel(Input);
const Input1 = compose(asControlled, withError)(InputWithLabel);
const Select1 = compose(asControlled, withError, withLabel)(Select);
const Select2 = canShow(Select1);

import { type FormFields, type FormField } from '../digitalSubscriptionCheckoutReducer';
import { type Action } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';
import { type StateProvince } from 'helpers/internationalisation/country';

type PropTypes = {|
  addressLine1: string,
  addressLine2: Option<string>,
  townCity: string,
  country: Option<IsoCountry>,
  postcode: string,
  formErrors: FormError<FormField>[],
  stateProvince: Option<StateProvince>,
  setPostcode: (postcode: string) => Function,
  setAddressLine1: (addressLine1: string) => Function,
  setAddressLine2: (addressLine2: string) => Action,
  setTownCity: (townCity: string) => Function,
  setBillingCountry: (countryRaw: string) => Function,
  setStateProvince: (stateProvince: string) => Function
|};

function statesForCountry(country: Option<IsoCountry>): React$Node {
  switch (country) {
    case 'US':
      return sortedOptions(usStates);
    case 'CA':
      return sortedOptions(caStates);
    case 'AU':
      return sortedOptions(auStates);
    default:
      return null;
  }
}

const AddressForm = (props: PropTypes) => (
  <>
    <Input1
      id="address-line-1"
      label="Address Line 1"
      type="text"
      value={props.addressLine1}
      setValue={props.setAddressLine1}
      error={firstError('addressLine1', props.formErrors)}
    />
    <Input1
      id="address-line-2"
      label="Address Line 2"
      optional
      type="text"
      value={props.addressLine2}
      setValue={props.setAddressLine2}
      error={firstError('addressLine2', props.formErrors)}
    />
    <Input1
      id="town-city"
      label="Town/City"
      type="text"
      value={props.townCity}
      setValue={props.setTownCity}
      error={firstError('townCity', props.formErrors)}
    />
    <Select1
      id="country"
      label="Country"
      value={props.country}
      setValue={props.setBillingCountry}
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
      isShown={props.country === 'US' || props.country === 'CA' || props.country === 'AU'}
    >
      <option value="">--</option>
      {statesForCountry(props.country)}
    </Select2>
    <Input1
      id="postcode"
      label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
      type="text"
      optional={isPostcodeOptional(props.country)}
      value={props.postcode}
      setValue={props.setPostcode}
      error={firstError('postcode', props.formErrors)}
    />
  </>
);

export default AddressForm;
