// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, termsLinks } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ---- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};


// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {
  const terms = <a href={termsLinks[props.countryGroupId]}>Terms and Conditions</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  return (
    <div className="component-terms-privacy">
      By proceeding, you are agreeing to our {terms}. To find out what personal data we collect and how we use it,
        please visit our {privacy}.
    </div>
  );

}


// ----- Exports ----- //

export default TermsPrivacy;
