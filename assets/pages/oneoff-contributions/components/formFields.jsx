// @flow

// ----- Imports ----- //

import React from 'react';
import NameFormField from './nameFormField';
import EmailFormField from './emailFormField';


// ----- Component ----- //

const FormFields = () => (
  <form className="oneoff-contrib__name-form">
    <NameFormField />
    <EmailFormField />
  </form>);

// ----- Exports ----- //

export default FormFields;
