// @flow

// ----- Imports ----- //

import React from 'react';
import NameFormField from './nameFormField';
import EmailFormFieldContainer from './emailFormFieldContainer';


// ----- Component ----- //

const FormFields = () => (
  <form className="oneoff-contrib__name-form">
    <NameFormField />
    <EmailFormFieldContainer />
  </form>);

// ----- Exports ----- //

export default FormFields;
