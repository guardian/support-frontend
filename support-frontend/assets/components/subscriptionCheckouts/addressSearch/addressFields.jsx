// @flow

import React, { Component } from 'react';
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

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);
const MaybeSelect = canShow(SelectWithError);
const MaybeInput = canShow(InputWithError);

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

  componentDidMount(): void {
    const { props } = this;
    const fields = [
      { element: `${props.scope}-search`, field: "" },
      { element: `${props.scope}-lineOne`, field: "Line1" },
      { element: `${props.scope}-lineTwo`, field: "Line2", mode: pca.fieldMode.POPULATE },
      { element: `${props.scope}-city`, field: "City", mode: pca.fieldMode.POPULATE },
      { element: `${props.scope}-stateProvince`, field: "Province", mode: pca.fieldMode.POPULATE },
      { element: `${props.scope}-postcode`, field: "PostalCode" },
      { element: `${props.scope}-country`, field: "CountryName", mode: pca.fieldMode.COUNTRY }
    ];
    const options = { key: 'KU38-EK85-GN78-YA78' };
    const control = new pca.Address(fields, options);

    control.listen("populate", function(address, variations) {
      console.log(address);
      if (address.CountryIso2 !== props.country){
        console.log("Country changed, running manual address update");
        props.setAddressLineOne(address.Line1);
        props.setAddressLineTwo(address.Line2);

        props.setTownCity(address.City);
        props.setState(address.Province);
        props.setPostcode(address.PostalCode);
      }
    });
  }

  render() {
    const { scope, ...props } = this.props;
    return (
      <div>
        <StaticInputWithLabel
          id={`${scope}-search`}
          label={"Search"}
        />
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
          isShown={AddressFields.shouldShowStateDropdown(props.country)}
        >
          <option value="">--</option>
          {AddressFields.statesForCountry(props.country)}
        </MaybeSelect>
        <MaybeInput
          id={`${scope}-stateProvince`}
          label="State"
          value={props.state}
          setValue={props.setState}
          error={firstError('state', props.formErrors)}
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
