// @flow

// ----- Imports ----- //

import React from 'react';

import TextInput from 'components/textInput/textInput';


// ----- Component ----- //

function NameForm() {

  return (
    <form className="monthly-contrib__name-form">
      <TextInput id="first-name" labelText="First name" />
      <TextInput id="last-name" labelText="Last name" />
    </form>
  );

}


// ----- Exports ----- //

export default NameForm;
