// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';

import { connect } from 'react-redux';

import { usStates, caStates, type StateProvince, auStates } from 'helpers/internationalisation/country';
import { type CountryGroupId, type CountryGroup, countryGroups, AUDCountries } from 'helpers/internationalisation/countryGroup';
import { Canada, UnitedStates } from 'helpers/internationalisation/countryGroup';
import { InlineError } from '@guardian/src-inline-error';
import './contributionStateDs.scss';
import DownChevronDs from 'components/svgs/downChevronDs';
import { focusHalo } from '@guardian/src-foundations/accessibility';
import { size, space } from '@guardian/src-foundations';

import { type State } from '../contributionsLandingReducer';

// ----- Types ----- //
type PropTypes = {|
  countryGroupId: CountryGroupId,
  selectedState: StateProvince | null,
  onChange: (Event => void) | false,
  isValid: boolean,
  formHasBeenSubmitted: boolean,
  contributionType: string,
|};

const mapStateToProps = (state: State) => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //
const renderState = (selectedState: StateProvince | null) => (state: {abbreviation: string, name: string}) => (
  <option value={state.abbreviation} selected={selectedState === state.abbreviation}>{state.name}</option>
);

const renderStatesField = (
  states: {[string]: string},
  selectedState: StateProvince | null,
  onChange: (Event => void) | false,
  showError: boolean,
  label: string,
) => (
  <div
    className="state-container"
  >
    <label className="state-label" htmlFor="contributionState">
      {label}
    </label>
    {showError ? (
      <InlineError>
        Please provide a {label.toLowerCase()}
      </InlineError>
      ) : null}
    <div>Please select your {label.toLowerCase()}</div>
    <div
      // className={`state-field ${showError ? 'state-field__error' : ''}`}
      css={css`
        margin-top: 4px;
        width: 100%;
        border: 2px solid #999;
        box-sizing: border-box;
        /* height: ${size.medium}px; */
        height: 48px;
        /* padding: ${space[10]}px ${space[2]}px; */
        box-sizing: border-box;
        padding: 0 ${space[2]}px;
        position: relative;

        &:active {
          ${focusHalo}
		      border: 2px solid #007ABC;
        }
        &:focus {
          /* ${focusHalo}; */
          border: 2px solid #007ABC;
        }
        &:hover {
          /* ${focusHalo}; */
          border: 2px solid #007ABC;
        }
        &:invalid {
          border: 4px solid ##c70000;
          color: #c70000;
        }
      `}
    >
      <select
        css={css`
            appearance: none;
            /* background: #ffffff; */
            background: transparent;
            transition: box-shadow .2s ease-in-out;
            border-radius: 0px;
            font-size: 17px;
            width: 110%;
            border: 0px;
            z-index: 1;
            margin: 0;
            height: 100%;

            &:focus {
              border: 0px;
              outline: 0px;
            }
          `}

          // className="state-field__select"
        id="contributionState"
        onChange={onChange}
        required
      >
        <option value="">&nbsp;</option>
        {Object.keys(states)
            .map(key => ({ abbreviation: key, name: states[key] }))
            .map(renderState(selectedState))}
      </select>

      <div
        css={css`
        float: right;
        z-index: 0;
        position: absolute;
        top: 4px;
        right: 16px;
      `}
      >
        <DownChevronDs />
      </div>



    </div>

  </div>
);

function ContributionState(props: PropTypes) {
  const showError = !props.isValid && props.formHasBeenSubmitted;
  if (props.contributionType !== 'ONE_OFF') {
    switch (props.countryGroupId) {
      case UnitedStates:
        return renderStatesField(usStates, props.selectedState, props.onChange, showError, 'State');
      case Canada:
        return renderStatesField(caStates, props.selectedState, props.onChange, showError, 'Province');
      case AUDCountries: {
        // Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
        if (window.guardian && window.guardian.geoip) {
          const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
          const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(c => c !== 'AU');
          if (AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)) {
            return null;
          }
        }
        return renderStatesField(auStates, props.selectedState, props.onChange, showError, 'State / Territory');
      }
      default:
        return null;
    }
  }

  return null;
}

ContributionState.defaultProps = {
  onChange: false,
};

export default connect(mapStateToProps)(ContributionState);
