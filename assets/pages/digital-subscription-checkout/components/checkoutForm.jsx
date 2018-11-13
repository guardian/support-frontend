// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { countries } from 'helpers/internationalisation/country';

import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withError, type FormError } from 'components/forms/formHOCs/withError';
import { asControlled } from 'components/forms/formHOCs/asControlled';

import {
  type State,
  type FormFields,
  type FormField,
  type FormActionCreators,
  formFieldsSelector,
  formActionCreators,
} from '../digitalSubscriptionCheckoutReducer';


// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  errors: FormError<FormField>[],
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...formFieldsSelector(state),
    errors: state.page.form.errors,
  };
}


// ----- Form Fields ----- //

const Input1 = compose(asControlled, withError, withLabel)(Input);
const Select1 = compose(asControlled, withError, withLabel)(Select);


// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  return (
    <div>
      <Input1
        id="first-name"
        label="First name"
        type="text"
        value={props.firstName}
        setValue={props.setFirstName}
        errors={props.errors}
        fieldName="firstName"
      />
      <Input1
        id="last-name"
        label="Last name"
        type="text"
        value={props.lastName}
        setValue={props.setLastName}
        errors={props.errors}
        fieldName="lastName"
      />
      <Select1
        id="country"
        label="Country"
        value={props.country}
        setValue={props.setCountry}
        errors={props.errors}
        fieldName="country"
      >
        <option value="">--</option>
        {Object.keys(countries)
          .sort((a, b) => countries[a].localeCompare(countries[b]))
          .map(iso => <option value={iso}>{countries[iso]}</option>)
        }
      </Select1>
      <Input1
        id="telephone"
        label="Telephone (optional)"
        type="tel"
        value={props.telephone}
        setValue={props.setTelephone}
        errors={props.errors}
        fieldName="telephone"
      />
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, formActionCreators)(CheckoutForm);
