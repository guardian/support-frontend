// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import TextInput from 'components/textInput/textInput';
import SelectInput from 'components/selectInput/selectInput';

import {
  setFirstName,
  setLastName,
  setEmail,
  setStateField,
  type Action as UserAction,
} from 'helpers/user/userActions';
import { setCountry, type Action as PageAction } from 'helpers/page/pageActions';
import { usStates, countries, caStates } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry, UsState, CaState } from 'helpers/internationalisation/country';
import type { SelectOption } from 'components/selectInput/selectInput';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type UserFormFieldAttribute,
  shouldShowError,
  emailRegexPattern,
} from 'helpers/checkoutForm/checkoutForm';
import {
  type Action as CheckoutAction, setEmailShouldValidate,
  setFirstNameShouldValidate,
  setLastNameShouldValidate,
} from '../helpers/checkoutForm/checkoutFormActions';
import { type State } from '../regularContributionsReducer';
import { getFormFields } from '../helpers/checkoutForm/checkoutFormFieldsSelector';


// ----- Types ----- //

type PropTypes = {
  stateUpdate: (value: UsState | CaState) => void,
  countryUpdate: (value: string) => void,
  firstName: UserFormFieldAttribute,
  lastName: UserFormFieldAttribute,
  email: UserFormFieldAttribute,
  setFirstName: (string) => void,
  setLastName: (string) => void,
  setEmail: (string) => void,
  countryGroup: CountryGroupId,
  country: IsoCountry,
  isSignedIn: boolean,
};

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {

  const { firstName, lastName, email } = getFormFields(state);

  return {
    firstName,
    lastName,
    email,
    countryGroup: state.common.internationalisation.countryGroupId,
    country: state.common.internationalisation.countryId,
    isSignedIn: state.page.user.isSignedIn,
  };

}

function mapDispatchToProps(dispatch: Dispatch<UserAction | PageAction | CheckoutAction>) {

  return {
    stateUpdate: (value: UsState | CaState) => {
      dispatch(setStateField(value));
    },
    countryUpdate: (value: IsoCountry) => {
      dispatch(setCountry(value));
    },
    setFirstName: (firstName: string) => {
      dispatch(setFirstName(firstName));
    },
    setLastName: (lastName: string) => {
      dispatch(setLastName(lastName));
    },
    setEmail: (email: string) => {
      dispatch(setEmail(email));
    },
  };
}


// ----- Functions ----- //

function stateDropdown(countryGroup: CountryGroupId, stateUpdate: (UsState | CaState) => void) {

  if (countryGroup !== 'UnitedStates' && countryGroup !== 'Canada') {
    return null;
  }
  const states = countryGroup === 'Canada' ? caStates : usStates;
  const stateLabel = countryGroup === 'Canada' ? 'province/territory' : 'state';

  const options: SelectOption[] = Object.keys(states).map((stateCode: UsState | CaState) =>
    ({ value: stateCode, text: states[stateCode] }));

  return (<SelectInput
    id="qa-state-dropdown"
    onChange={stateUpdate}
    options={options}
    label={`Select your ${stateLabel}`}
  />);
}

function countriesDropdown(
  countryGroup: CountryGroupId,
  countryUpdate: string => void,
  country: IsoCountry,
) {

  const askForCountryCountryGroups = ['EURCountries', 'International', 'NZDCountries', 'GBPCountries', 'AUDCountries'];

  if (!askForCountryCountryGroups.includes(countryGroup)) {
    return null;
  }

  const options: SelectOption[] =
    countryGroups[countryGroup].countries.map((countryCode: IsoCountry) =>
      ({
        value: countryCode,
        text: countries[countryCode],
        selected: countryCode === country,
      }));

  return (<SelectInput
    id="qa-country-dropdown"
    onChange={countryUpdate}
    options={options}
    label="Select your country"
  />);
}

export const formClassName = 'regular-contrib__checkout-form';

export const setShouldValidateFunctions = [
  setFirstNameShouldValidate,
  setLastNameShouldValidate,
  setEmailShouldValidate,
];


// ----- Component ----- //

function NameForm(props: PropTypes) {
  return (
    <form className={formClassName}>
      {
        !props.isSignedIn ? (
          <TextInput
            id="email"
            value={props.email.value}
            labelText="Email"
            placeholder="Email"
            onChange={props.setEmail}
            modifierClasses={['email']}
            showError={shouldShowError(props.email)}
            errorMessage="Please enter a valid email address."
            type="email"
            pattern={emailRegexPattern}
            required
          />
        ) : null
      }
      <TextInput
        id="first-name"
        labelText="First name"
        placeholder="First name"
        value={props.firstName.value}
        onChange={props.setFirstName}
        modifierClasses={['first-name']}
        showError={shouldShowError(props.firstName)}
        errorMessage="Please enter a first name."
        required
      />
      <TextInput
        id="last-name"
        labelText="Last name"
        placeholder="Last name"
        value={props.lastName.value}
        onChange={props.setLastName}
        modifierClasses={['last-name']}
        showError={shouldShowError(props.lastName)}
        errorMessage="Please enter a last name."
        required
      />
      {stateDropdown(props.countryGroup, props.stateUpdate)}
      {countriesDropdown(props.countryGroup, props.countryUpdate, props.country)}
      <p className="component-your-details__info">
        <small>All fields are required.</small>
      </p>
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(NameForm);
