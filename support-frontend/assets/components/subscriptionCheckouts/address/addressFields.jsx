// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TextInput } from '@guardian/src-text-input';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';

import {
  firstError,
  type FormError,
} from 'helpers/subscriptionsForms/validation';

import { Select } from 'components/forms/select';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';
import { asControlled } from 'hocs/asControlled';

import { withStore as postcodeFinderWithStore } from 'components/subscriptionCheckouts/address/postcodeFinder';
import { type PostcodeFinderState } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { type AddressType } from 'helpers/subscriptionsForms/addressType';

import {
  type ActionCreators as AddressActionCreators,
  addressActionCreatorsFor,
  type FormField,
  type FormFields,
  getFormFields,
  getPostcodeForm,
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

const marginBottom = css`
  margin-bottom: ${space[6]}px;
`;

const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);
const MaybeSelect = canShow(SelectWithError);
const MaybeInput = canShow(TextInput);

class AddressFields<GlobalState> extends Component<PropTypes<GlobalState>> {

  static shouldShowStateDropdown(country: Option<IsoCountry>): boolean {
    return country === 'US' || country === 'CA' || country === 'AU';
  }

  static shouldShowStateInput(country: Option<IsoCountry>): boolean {
    return country !== 'GB' && !AddressFields.shouldShowStateDropdown(country);
  }

  static statesForCountry(country: Option<IsoCountry>): React$Node {
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
    this is done to prevent preact from re-rendering the whole component on each keystroke sadface
    */
    const { scope, traverseState } = this.props;
    this.PostcodeFinder = postcodeFinderWithStore(scope, state => getPostcodeForm(traverseState(state)));
  }


  PostcodeFinder: $Call<typeof postcodeFinderWithStore, AddressType, () => PostcodeFinderState>;

  render() {
    const { scope, ...props } = this.props;
    const { PostcodeFinder } = this;
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
        {props.country === 'GB' ? <PostcodeFinder
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
        /> : null}
        <TextInput
          css={marginBottom}
          id={`${scope}-lineOne`}
          label="Address Line 1"
          type="text"
          value={props.lineOne}
          onChange={e => props.setAddressLineOne(e.target.value)}
          error={firstError('lineOne', props.formErrors)}
        />
        <TextInput
          css={marginBottom}
          id={`${scope}-lineTwo`}
          label="Address Line 2"
          optional
          type="text"
          value={props.lineTwo}
          onChange={e => props.setAddressLineTwo(e.target.value)}
          error={firstError('lineTwo', props.formErrors)}
        />
        <TextInput
          css={marginBottom}
          id={`${scope}-city`}
          label="Town/City"
          type="text"
          maxlength={40}
          value={props.city}
          onChange={e => props.setTownCity(e.target.value)}
          error={firstError('city', props.formErrors)}
        />
        <MaybeSelect
          id={`${scope}-stateProvince`}
          label={props.country === 'CA' ? 'Province/Territory' : 'State'}
          value={props.state}
          setValue={props.setState}
          error={firstError('state', props.formErrors)}
          isShown={AddressFields.shouldShowStateDropdown(props.country)}
        >
          <option value="">--</option>
          {AddressFields.statesForCountry(props.country)}
        </MaybeSelect>
        <MaybeInput
          css={marginBottom}
          id={`${scope}-stateProvince`}
          label="State"
          value={props.state}
          onChange={props.setState}
          error={firstError('state', props.formErrors)}
          optional
          isShown={AddressFields.shouldShowStateInput(props.country)}
        />
        <TextInput
          css={marginBottom}
          id={`${scope}-postcode`}
          label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
          type="text"
          optional={isPostcodeOptional(props.country)}
          value={props.postCode}
          onChange={e => props.setPostcode(e.target.value)}
          error={firstError('postCode', props.formErrors)}
        />
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
  )(AddressFields);
