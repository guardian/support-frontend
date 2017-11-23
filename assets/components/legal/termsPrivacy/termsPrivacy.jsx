// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, termsLinks } from 'helpers/legal';

import type { IsoCountry } from 'helpers/internationalisation/country';


// ---- Types ----- //

type PropTypes = {
  country: IsoCountry,
};


// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {

  const terms = <a href={termsLinks[props.country]}>Terms and Conditions</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  return (
    <div className="component-terms-privacy">
      By proceeding, you are agreeing to our {terms} and {privacy}.
    </div>
  );

}


// ----- Exports ----- //

export default TermsPrivacy;
