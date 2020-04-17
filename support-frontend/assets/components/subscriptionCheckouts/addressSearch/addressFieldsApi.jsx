// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';

import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';

import { type AddressType } from 'helpers/subscriptionsForms/addressType';

import {
  type ActionCreators as AddressActionCreators,
  addressActionCreatorsFor,
  type FormField,
  type FormFields,
  getFormFields,
  getStateFormErrors,
  isPostcodeOptional,
  type State as AddressState,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { canShow } from 'hocs/canShow';
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
  auStates,
  caStates,
  usStates,
} from 'helpers/internationalisation/country';
import AddressDisplayText
  from 'components/subscriptionCheckouts/addressSearch/addressDisplayText';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import * as styles from './addressFieldsApiStyles';
import { AddressSearchBox } from 'components/subscriptionCheckouts/addressSearch/addressSearchBox';
import type { AddressSearch } from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import { Component } from 'preact';

type StatePropTypes<GlobalState> = {|
  ...FormFields,
  countries: { [string]: string },
  scope: AddressType,
  traverseState: GlobalState => AddressState,
  formErrors: FormError<FormField>[],
|}

type PropTypes<GlobalState> = {|
  ...AddressActionCreators,
  ...StatePropTypes<GlobalState>,
|}

type State = {
  searchComplete: boolean,
}

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);
const MaybeSelect = canShow(SelectWithError);
const MaybeInput = canShow(InputWithError);

function shouldShowStateDropdown(country: Option<IsoCountry>): boolean {
  return country === 'US' || country === 'CA' || country === 'AU';
}

function shouldShowStateInput(country: Option<IsoCountry>): boolean {
  return country !== 'GB' && !shouldShowStateDropdown(country);
}

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


class AddressFieldsApi extends Component<PropTypes, State> {

  constructor() {
    super();
    this.state = { searchComplete: false };
  }

  searchComplete = (address: AddressSearch, actions: AddressActionCreators) => {
    actions.setAddressLineOne(address.Line1);
    actions.setAddressLineTwo(address.Line2);
    actions.setCountry(address.CountryIso2);
    actions.setPostcode(address.PostalCode);
    actions.setState(address.Province);
    actions.setTownCity(address.City);
    this.setState({ searchComplete: true });
  };

  render() {
    const { scope, ...props } = this.props;
    const addressDisplay = this.state.searchComplete ? (<AddressDisplayText
      lineOne={props.lineOne}
      lineTwo={props.lineTwo}
      city={props.city}
      postCode={props.postCode}
      state={props.state}
      country={props.country}
    />) : (
      <AddressSearchBox
        scope={scope}
        onSearchComplete={address => this.searchComplete(address, props)}
      />);
    return (
      <div css={styles.formDiv}>
        {addressDisplay}
        <CheckoutExpander copy="I want to enter my address manually">
          <SelectWithError
            id={`${scope}-country`}
            label="Country"
            value={props.country}
            setValue={props.setCountry}
            error={firstError('country', props.formErrors)}
          >
            <option value="">--</option>
            {sortedOptions(props.countries)}
          </SelectWithError>
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
            id={`${scope}-stateProvince`}
            label={props.country === 'CA' ? 'Province/Territory' : 'State'}
            value={props.state}
            setValue={props.setState}
            error={firstError('state', props.formErrors)}
            isShown={shouldShowStateDropdown(props.country)}
          >
            <option value="">--</option>
            {statesForCountry(props.country)}
          </MaybeSelect>
          <MaybeInput
            id={`${scope}-stateProvince`}
            label="State"
            value={props.state}
            setValue={props.setState}
            error={firstError('state', props.formErrors)}
            optional
            isShown={shouldShowStateInput(props.country)}
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
        </CheckoutExpander>
      </div>
    );
  }
}

export const withStore = <GlobalState>(
  countries: { [string]: string },
  scope: AddressType,
  traverseState: GlobalState => AddressState,
) => connect(
    (state: GlobalState) => ({
      countries,
      ...getFormFields(traverseState(state)),
      formErrors: getStateFormErrors(traverseState(state)) || [],
      traverseState,
      scope,
    }),
    addressActionCreatorsFor(scope),
  )(AddressFieldsApi);
