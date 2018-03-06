// @flow

// ----- Imports ----- //

import React from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup'

type PropTypes = {
  countryGroupId: CountryGroupId,
};

// ----- Componenent ----- //
export default function ContributionsIntroduction(props: PropTypes) {

  let subject = "the world";

  if (props.countryGroupId === 'AUDCountries') {
    subject = 'Autralia';
  }

  return (
    <div className="contributions-introduction">
      <div className="contributions-introduction__primary">
        <h1>help us deliver</h1>
        <h1>the independent journalism</h1>
        <h1>{subject} needs</h1>
      </div>
      <div className="contributions-introduction__secondary">
        <h1>support the&nbsp;Guardian </h1>
        <h1><span className="contributions-introduction__indent">make a contribution </span></h1>
      </div>
    </div>
  );

}
