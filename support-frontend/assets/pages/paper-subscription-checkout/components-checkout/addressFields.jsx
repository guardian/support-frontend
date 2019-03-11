// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { newspaperCountries } from 'helpers/internationalisation/country';
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

import { getPostcodeForm,
  getFormFields,
  getStateFormErrors,
  addressActionCreatorsFor,
  type FormField,
  type FormFields,
  type ActionCreators as AddressActionCreators,
  type State as AddressState } from './addressFieldsStore';

type StatePropTypes<GlobalState> = {|
  ...FormFields,
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

  regeneratePostcodeFinder() {
    /*
    this is done to prevent preact from rerendering the whole component on each keystroke sadface
    */
    const { scope, traverseState } = this.props;
    this.ScopedPostcodeFinder = postcodeFinderWithStore(scope, state => getPostcodeForm(traverseState(state)));
  }
  ScopedPostcodeFinder: $Call<typeof postcodeFinderWithStore, Address, () => PostcodeFinderState>;

  render() {
    const { scope, ...props } = this.props;
    const { ScopedPostcodeFinder } = this;
    return (
      <div>
        <ScopedPostcodeFinder
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
        <InputWithError
          id={`${scope}-postcode`}
          label="Postcode"
          type="text"
          value={props.postCode}
          setValue={props.setPostcode}
          error={firstError('postCode', props.formErrors)}
        />
        <SelectWithError
          id={`${scope}-country`}
          label="Country"
          value={props.country}
          setValue={props.setCountry}
          error={firstError('country', props.formErrors)}
        >
          <option value="">--</option>
          {sortedOptions(newspaperCountries)}
        </SelectWithError>
      </div>
    );
  }
}

export const withStore = <GlobalState>(scope: Address, traverseState: GlobalState => AddressState) => connect(
  (state: GlobalState) => ({
    ...getFormFields(traverseState(state)),
    formErrors: getStateFormErrors(traverseState(state)),
    traverseState,
    scope,
  }),
  addressActionCreatorsFor(scope),
)(AddressFields);


export default AddressFields;
