// @flow

import React from 'react';
import { compose } from 'redux';

// helpers
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { isPostcodeOptional } from 'pages/digital-subscription-checkout/helpers/validation';
import { auStates, caStates, countries, type IsoCountry, usStates } from 'helpers/internationalisation/country';

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

import { type FormFields } from '../digitalSubscriptionCheckoutReducer';
import { type FormActionCreators } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutActions';

type PropTypes = {|
  ...FormFields,
  formErrors: FormError<FormField>[],
  ...FormActionCreators,
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
