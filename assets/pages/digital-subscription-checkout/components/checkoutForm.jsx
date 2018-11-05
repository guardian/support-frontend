// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { countries } from 'helpers/internationalisation/country';
import { compareString } from 'helpers/utilities';

import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { asControlled } from 'components/forms/formHOCs/asControlled';

import { type State, actions } from '../digitalSubscriptionCheckoutReducer';


// ----- Form Fields ----- //

function Input1(props: { id: string, label: string, value: string, setValue: string => void }) {
  const Com = compose(asControlled, withLabel)(Input);
  return <Com {...props} />;
}

function Select1(props: { id: string, label: string, value: string, setValue: string => void }) {
  const Com = compose(asControlled, withLabel)(Select);
  return <Com {...props} />;
}

const FirstName = connect(
  (state: State) => ({ value: state.page.firstName }),
  { setValue: actions.setFirstName },
)(Input1);

const LastName = connect(
  (state: State) => ({ value: state.page.lastName }),
  { setValue: actions.setLastName },
)(Input1);

const Telephone = connect(
  (state: State) => ({ value: state.page.telephone }),
  { setValue: actions.setTelephone },
)(Input1);

const Country = connect(
  (state: State) => ({ value: state.page.country }),
  { setValue: actions.setCountry },
)(Select1);


// ----- Component ----- //

function CheckoutForm() {

  return (
    <div>
      <FirstName id="first-name" label="First name" type="text" />
      <LastName id="last-name" label="Last name" type="text" />
      <Country id="country" label="Country">
        {Object.keys(countries)
          .sort((a, b) => compareString(countries[a], countries[b]))
          .map(iso => <option value={iso}>{countries[iso]}</option>)
        }
      </Country>
      <Telephone id="telephone" label="Telephone (optional)" type="tel" />
    </div>
  );

}


// ----- Exports ----- //

export default CheckoutForm;
