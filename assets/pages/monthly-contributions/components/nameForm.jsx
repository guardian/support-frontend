// @flow

// ----- Imports ----- //

import React from 'react';

import TextInput from 'components/textInput/textInput';


// ----- Component ----- //

function NameForm() {

  return (
    <form className="monthly-contrib__name-form">
      <TextInput id="first-name" placeholder="First name" />
      <TextInput id="last-name" placeholder="Last name" />
    </form>
  );

}


// ----- Exports ----- //

export default NameForm;
