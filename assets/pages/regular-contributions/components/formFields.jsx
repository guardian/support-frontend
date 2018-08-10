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
  setStateField,
  type Action as UserAction,
} from 'helpers/user/userActions';
import { setCountry, type Action as PageAction } from 'helpers/page/pageActions';
import { usStates, countries, caStates } from 'helpers/internationalisation/country';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { IsoCountry, UsState, CaState } from 'helpers/internationalisation/country';
import type { SelectOption } from 'components/selectInput/selectInput';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { type UserFormFieldAttribute, formFieldError, shouldShowError } from 'helpers/checkoutForm/checkoutForm';
import EmailFormFieldContainer from './emailFormFieldContainer';
import {
  type Action as CheckoutAction,
  setFirstNameShouldValidate,
  setLastNameShouldValidate,
} from './contributionsCheckoutContainer/checkoutFormActions';


// ----- Types ----- //

type PropTypes = {
  stateUpdate: (value: UsState | CaState) => void,
  countryUpdate: (value: string) => void,
  firstName: UserFormFieldAttribute,
  lastName: UserFormFieldAttribute,
  countryGroup: CountryGroupId,
  country: IsoCountry,
};

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const firstNameFormfield = {
    value: state.page.user.firstName,
    ...state.page.checkoutForm.firstName,
  };
  const lastNameFormField = {
    value: state.page.user.lastName,
    ...state.page.checkoutForm.lastName,
  };

  return {
    stateFirstName: firstNameFormfield,
    stateLastName: lastNameFormField,
    countryGroup: state.common.internationalisation.countryGroupId,
    country: state.common.internationalisation.countryId,
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
    firstNameActions: {
      setShouldValidate: () => {
        dispatch(setFirstNameShouldValidate());
      },
      setValue: (firstName: string) => {
        dispatch(setFirstName(firstName));
      },
    },
    lastNameActions: {
      setShouldValidate: () => {
        dispatch(setLastNameShouldValidate());
      },
      setValue: (lastName: string) => {
        dispatch(setLastName(lastName));
      },
    },
  };
}

function mergeProps(stateProps, dispatchProps) {

  const firstName: UserFormFieldAttribute = {
    ...stateProps.stateFirstName,
    ...dispatchProps.firstNameActions,
    isValid: formFieldError(stateProps.stateFirstName.value, true),
  };

  const lastName: UserFormFieldAttribute = {
    ...stateProps.stateLastName,
    ...dispatchProps.lastNameActions,
    isValid: formFieldError(stateProps.stateLastName.value, true),
  };

  return {
    ...stateProps,
    ...dispatchProps,
    firstName,
    lastName,
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

  // Sets the initial state to the first in the dropdown.
  stateUpdate(options[0].value);

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


// ----- Component ----- //

function NameForm(props: PropTypes) {

  const showFirstNameError = shouldShowError(props.firstName);
  const showLastNameError = shouldShowError(props.lastName);
  const firstNameModifier = showFirstNameError
    ? ['first-name', 'error']
    : ['first-name'];
  const lastNameModifier = showLastNameError
    ? ['last-name', 'error']
    : ['last-name'];

  return (
    <form className="regular-contrib__name-form">
      <EmailFormFieldContainer />
      <TextInput
        id="first-name"
        labelText="First name"
        placeholder="First name"
        value={props.firstName.value}
        onChange={props.firstName.setValue}
        onBlur={props.firstName.setShouldValidate}
        modifierClasses={firstNameModifier}
        required
      />
      <ErrorMessage
        showError={showFirstNameError}
        message="Please enter a first name."
      />
      <TextInput
        id="last-name"
        labelText="Last name"
        placeholder="Last name"
        value={props.lastName.value}
        onChange={props.lastName.setValue}
        onBlur={props.lastName.setShouldValidate}
        modifierClasses={lastNameModifier}
        required
      />
      <ErrorMessage
        showError={showLastNameError}
        message="Please enter a last name."
      />
      {stateDropdown(props.countryGroup, props.stateUpdate)}
      {countriesDropdown(props.countryGroup, props.countryUpdate, props.country)}
    </form>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NameForm);
