// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import { connect } from 'react-redux';

import { usStates, caStates, type StateProvince, auStates } from 'helpers/internationalisation/country';
import { type CountryGroupId, type CountryGroup, countryGroups, AUDCountries } from 'helpers/internationalisation/countryGroup';
import { Canada, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { TextInput } from '@guardian/src-text-input';
import { checkBillingStateDs } from 'helpers/formValidation';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';


import { type State } from '../contributionsLandingReducer';


// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  value: StateProvince | null,
  onChange: (string | null) => void,
  formHasBeenSubmitted: boolean,
  contributionType: string,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //

class ContributionStateDs extends Component<PropTypes, {currentInput: string, isValid: boolean}> {

  state = {
    currentInput: this.props.value ? this.props.value : '',
    isValid: checkBillingStateDs(this.props.value, this.props.countryGroupId),
  }

  // The combobox is treated as 'invalid' if it has an empty string,
  // so we need to override the default TextInput component's CSS
  // so that the field doesn't appear outlined in red if the field is empty.
  cssInvalid = () => {
    if (this.state.currentInput === '') {
      if (!this.props.formHasBeenSubmitted) {
        return {
          '&:invalid': {
            border: '2px solid #999999',
            color: 'inherit',
          },
        };
      }
      return {
        '&:invalid': {
          border: '4px solid #C70000',
        },
      };
    }
    return {};
  };

  handleInputChange = (event: SyntheticInputEvent<HTMLInputElement>): void => {
    const input: string = event.target.value;
    const isValid = checkBillingStateDs(input, this.props.countryGroupId);
    this.setState({
      currentInput: input,
      isValid,
    });
    const formattedBillingState = stateProvinceFieldFromString(this.props.countryGroupId, input);
    this.props.onChange(formattedBillingState);
  };

  renderStatesField = (
    states: {[string]: string},
    label: string,
  ) => (
    <div className="form__field">
      <TextInput
        id="ContributionStateDs"
        label={label}
        value={this.state.currentInput}
        autoComplete="off"
        list="states-list"
        supporting={`Start typing your ${label.toLowerCase()} or click to select from a list`}
        onChange={this.handleInputChange}
        error={!this.state.isValid && this.props.formHasBeenSubmitted && `Please provide a valid ${label.toLowerCase()}`}
        required
        cssOverrides={{
          width: 'calc(100% - 20px)',
          ...this.cssInvalid(),
        }}
      />
      <datalist id="states-list">
        {Object.values(states).map(state => <option value={state} />)};
      </datalist>

    </div>
  );

  renderByRegion = () => {
    if (this.props.contributionType !== 'ONE_OFF') {
      switch (this.props.countryGroupId) {
        case UnitedStates:
          return this.renderStatesField(usStates, 'State');
        case Canada:
          return this.renderStatesField(caStates, 'Province');
        case AUDCountries: {
        // Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
          if (window.guardian && window.guardian.geoip) {
            const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
            const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(c => c !== 'AU');
            if (AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)) {
              return null;
            }
          }
          return this.renderStatesField(auStates, 'State / Territory');
        }
        default:
          return null;
      }
    }

    return null;
  };

  render = () => this.renderByRegion();
}

export default connect(mapStateToProps)(ContributionStateDs);
