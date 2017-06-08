// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  termsLink: string,
  privacyLink: string,
};


// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {

  const terms = <a href={props.termsLink}>Terms and Conditions</a>;
  const privacy = <a href={props.privacyLink}>Privacy Policy</a>;

  return <div>By proceeding, you are agreeing to our {terms} and {privacy}.</div>;

}


// ----- Exports ----- //

export default TermsPrivacy;
