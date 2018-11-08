// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { countries } from 'helpers/internationalisation/country';

import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { asControlled } from 'components/forms/formHOCs/asControlled';

import {
  type State,
  type FormFields,
  type FormActionCreators,
  formFieldsSelector,
  formActionCreators,
} from '../digitalSubscriptionCheckoutReducer';


// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return formFieldsSelector(state);
}


// ----- Form Fields ----- //

const Input1 = compose(asControlled, withLabel)(Input);
const Select1 = compose(asControlled, withLabel)(Select);


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
      />
      <Input1
        id="last-name"
        label="Last name"
        type="text"
        value={props.lastName}
        setValue={props.setLastName}
      />
      <Select1 id="country" label="Country" value={props.country} setValue={props.setCountry}>
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
      />
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, formActionCreators)(CheckoutForm);
