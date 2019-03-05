// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { newspaperCountries } from 'helpers/internationalisation/country';
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';

import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';

import postcodeFinderFor from './postcodeFinderFor';
import { type PostcodeFinderState } from './postcodeFinderStore';
import { type Address } from '../helpers/addresses';
import { type State as PageState } from '../paperSubscriptionCheckoutReducer';

import { type FormField, getFormFields, type FormFields, type AddressActionCreators, type AddressState, addressActionCreatorsFor } from './addressStore';

type PropTypes = {
  ...AddressActionCreators,
  ...FormFields,
  scope: Address,
  traverseState: PageState => AddressState,
  formErrors: FormError<FormField>[],
}

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);

class AddressFor extends Component<PropTypes> {
  constructor(props) {
    super(props);
    const { scope, traverseState } = props;
    this.ScopedPostcodeFinder = postcodeFinderFor(scope, state => traverseState(state).postcode);
  }
  componentDidUpdate(prevProps: PropTypes) {
    const { scope, traverseState } = this.props;
    if (prevProps.scope !== scope) {
      this.ScopedPostcodeFinder = postcodeFinderFor(scope, state => traverseState(state).postcode);
    }
  }
  ScopedPostcodeFinder: ?$Call<typeof postcodeFinderFor, Address, () => PostcodeFinderState>;

  render() {
    const { scope, traverseState, ...props } = this.props;
    const { ScopedPostcodeFinder } = this;
    return (
      <div>
        {ScopedPostcodeFinder &&
          <ScopedPostcodeFinder
            id={`${scope}-postcode`}
            onPostcodeUpdate={(val) => {
              props.setPostcode(val);
            }}
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
        }
        <InputWithError
          id={`${scope}-lineOne`}
          label="Address Line 1"
          type="text"
          value={props.lineOne}
          setValue={val => props.setAddressLineOne(val)}
          error={firstError('lineOne', props.formErrors)}
        />
        <InputWithError
          id={`${scope}-lineTwo`}
          label="Address Line 2"
          optional
          type="text"
          value={props.lineTwo}
          setValue={val => props.setAddressLineTwo(val)}
          error={firstError('lineTwo', props.formErrors)}
        />
        <InputWithError
          id={`${scope}-city`}
          label="Town/City"
          type="text"
          value={props.city}
          setValue={val => props.setTownCity(val)}
          error={firstError('city', props.formErrors)}
        />
        <SelectWithError
          id={`${scope}-country`}
          label="Country"
          value={props.country}
          setValue={val => props.setCountry(val)}
          error={firstError('country', props.formErrors)}
        >
          <option value="">--</option>
          {sortedOptions(newspaperCountries)}
        </SelectWithError>
      </div>
    );
  }
}

export default (scope: Address, traverseState: PageState => AddressState) =>
  connect(
    (state: PageState) => ({
      ...getFormFields(traverseState(state).address),
      formErrors: traverseState(state).address.formErrors,
      traverseState,
      scope,
    }),
    addressActionCreatorsFor(scope),
  )(AddressFor);
