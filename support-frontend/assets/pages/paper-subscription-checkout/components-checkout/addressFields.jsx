// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { auStates, caStates, newspaperCountries, usStates } from 'helpers/internationalisation/country';
import { firstError, type FormError } from 'helpers/subscriptionsForms/validation';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { InputWithError, SelectWithError, SelectWithIsShown } from 'components/subscriptionCheckouts/formFields';
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
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { isPostcodeOptional } from 'pages/paper-subscription-checkout/components-checkout/addressFieldsStore';

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

function CommonAddressFields<GlobalState>(props: PropTypes<GlobalState>) {
  return (
    <div>
      <InputWithError
        id={`${props.scope}-lineOne`}
        label="Address Line 1"
        type="text"
        value={props.lineOne}
        setValue={props.setAddressLineOne}
        error={firstError('lineOne', props.formErrors)}
      />
      <InputWithError
        id={`${props.scope}-lineTwo`}
        label="Address Line 2"
        optional
        type="text"
        value={props.lineTwo}
        setValue={props.setAddressLineTwo}
        error={firstError('lineTwo', props.formErrors)}
      />
      <InputWithError
        id={`${props.scope}-city`}
        label="Town/City"
        type="text"
        value={props.city}
        setValue={props.setTownCity}
        error={firstError('city', props.formErrors)}
      />
      <SelectWithError
        id={`${props.scope}-country`}
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

class DomesticAddress<GlobalState> extends Component<PropTypes<GlobalState>> {

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
        <CommonAddressFields {...this.props} />
      </div>
    );
  }
}

class InternationalAddress<GlobalState> extends Component<PropTypes<GlobalState>> {

  constructor(props: PropTypes<GlobalState>) {
    super(props);
  }

  render() {
    const { ...props } = this.props;
    return (
      <div>
        <CommonAddressFields {...props} />
        <SelectWithIsShown
          id="stateProvince"
          label={props.country === 'CA' ? 'Province/Territory' : 'State'}
          value={props.state}
          setValue={(state) => props.setState(state, props.country)}
          error={firstError('state', props.formErrors)}
          isShown={props.country === 'US' || props.country === 'CA' || props.country === 'AU'}
        >
          <option value="">--</option>
          {statesForCountry(props.country)}
        </SelectWithIsShown>
        <InputWithError
          id="postcode"
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

export const domesticAddressWithStore = <GlobalState>(scope: Address, traverseState: GlobalState => AddressState) => connect(
  (state: GlobalState) => ({
    ...getFormFields(traverseState(state)),
    formErrors: getStateFormErrors(traverseState(state)),
    traverseState,
    scope,
  }),
  addressActionCreatorsFor(scope),
)(DomesticAddress);

export const internationalAddressWithStore = <GlobalState>(scope: Address, traverseState: GlobalState => AddressState) => connect(
  (state: GlobalState) => ({
    ...getFormFields(traverseState(state)),
    formErrors: getStateFormErrors(traverseState(state)),
    traverseState,
    scope,
  }),
  addressActionCreatorsFor(scope),
)(InternationalAddress);


export default DomesticAddress;
