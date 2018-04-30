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

  const terms = <a href={termsLinks[props.country]}>Terms of Service</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  return (
    <div className="component-terms-privacy">
      By proceeding, you agree to our {terms}. To find out what personal data we collect and how we use it, please
        visit our {privacy}.
    </div>
  );

}


// ----- Exports ----- //

export default TermsPrivacy;
