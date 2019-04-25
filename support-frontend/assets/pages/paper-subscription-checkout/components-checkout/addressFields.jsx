// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';

import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';

import { withStore as postcodeFinderWithStore } from './postcodeFinder';
import { type PostcodeFinderState } from './postcodeFinderStore';
import { type Address } from '../helpers/addresses';

import {
  type ActionCreators as AddressActionCreators,
  addressActionCreatorsFor,
  type FormField,
  type FormFields,
  getFormFields,
  getPostcodeForm,
  getStateFormErrors,
  type State as AddressState,
} from './addressFieldsStore';
import { canShow } from 'hocs/canShow';
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { auStates, caStates, usStates } from 'helpers/internationalisation/country';
import { isPostcodeOptional } from 'pages/paper-subscription-checkout/components-checkout/addressFieldsStore';

type StatePropTypes<GlobalState> = {|
  ...FormFields,
  countries: { [string]: string },
  scope: Address,
  traverseState: GlobalState => AddressState,
  formErrors: FormError<FormField>[],
|}

type PropTypes<GlobalState> = {|
  ...AddressActionCreators,
  ...StatePropTypes<GlobalState>,
|}

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);
const MaybeSelect = canShow(SelectWithError);
const MaybeInput = canShow(InputWithError);

class AddressFields<GlobalState> extends Component<PropTypes<GlobalState>> {

  constructor(props: PropTypes<GlobalState>) {
    super(props);
    this.regeneratePostcodeFinder();
  }

  componentDidUpdate(prevProps: PropTypes<GlobalState>) {
    if (prevProps.scope !== this.props.scope) {
      this.regeneratePostcodeFinder();
    }
  }

  static shouldShowStateDropdown(country: Option<IsoCountry>): boolean {
    return  country === 'US' || country === 'CA' || country === 'AU';
  }

  static shouldShowStateInput(country: Option<IsoCountry>): boolean {
    return  country !== 'GB' && !AddressFields.shouldShowStateDropdown(country);
  }

  statesForCountry(country: Option<IsoCountry>): React$Node {
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

  regeneratePostcodeFinder() {
    /*
    this is done to prevent preact from re-rendering the whole component on each keystroke sadface
    */
    const { scope, traverseState } = this.props;
    this.MaybePostcodeFinder = canShow(postcodeFinderWithStore(scope, state => getPostcodeForm(traverseState(state))));
  }
  MaybePostcodeFinder: $Call<typeof postcodeFinderWithStore, Address, () => PostcodeFinderState>;

  render() {
    const { scope, ...props } = this.props;
    const { MaybePostcodeFinder } = this;
    return (
      <div>
        <SelectWithError
          id={`${scope}-country`}
          label="Select Country"
          value={props.country}
          setValue={props.setCountry}
          error={firstError('country', props.formErrors)}
        >
          <option value="">--</option>
          {sortedOptions(props.countries)}
        </SelectWithError>
        <MaybePostcodeFinder
          id={`${scope}-postcode`}
          onPostcodeUpdate={props.setPostcode}
          onAddressUpdate={({ lineOne, lineTwo, city }) => {
            if (lineOne) {
              props.setAddressLineOne(lineOne);
            }
            if (lineTwo) {
              props.setAddressLineTwo(lineTwo);
            }
            if (city) {
              props.setTownCity(city);
            }
          }}
          isShown={props.country === 'GB'}
        />
        <InputWithError
          id={`${scope}-lineOne`}
          label="Address Line 1"
          type="text"
          value={props.lineOne}
          setValue={props.setAddressLineOne}
          error={firstError('lineOne', props.formErrors)}
        />
        <InputWithError
          id={`${scope}-lineTwo`}
          label="Address Line 2"
          optional
          type="text"
          value={props.lineTwo}
          setValue={props.setAddressLineTwo}
          error={firstError('lineTwo', props.formErrors)}
        />
        <InputWithError
          id={`${scope}-city`}
          label="Town/City"
          type="text"
          value={props.city}
          setValue={props.setTownCity}
          error={firstError('city', props.formErrors)}
        />
        <MaybeSelect
          id="stateProvince"
          label={props.country === 'CA' ? 'Province/Territory' : 'State'}
          value={props.stateProvince}
          setValue={props.setStateProvince}
          error={firstError('stateProvince', props.formErrors)}
          isShown={AddressFields.shouldShowStateDropdown(props.country)}
        >
          <option value="">--</option>
          {this.statesForCountry(props.country)}
        </MaybeSelect>
        <MaybeInput
          id="stateProvince"
          label="State"
          value={props.stateProvince}
          setValue={props.setStateProvince}
          error={firstError('stateProvince', props.formErrors)}
          optional
          isShown={AddressFields.shouldShowStateInput(props.country)}
        />
        <InputWithError
          id={`${scope}-postcode`}
          label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
          type="text"
          optional={isPostcodeOptional(props.country)}
          value={props.postCode}
          setValue={props.setPostcode}
          error={firstError('postCode', props.formErrors)}
        />
      </div>
    );
  }
}

export const withStore = <GlobalState>(countries: { [string]: string }, scope: Address, traverseState: GlobalState => AddressState) => connect(
  (state: GlobalState) => ({
    countries,
    ...getFormFields(traverseState(state)),
    formErrors: getStateFormErrors(traverseState(state)) || [],
    traverseState,
    scope,
  }),
  addressActionCreatorsFor(scope),
)(AddressFields);


export default AddressFields;
