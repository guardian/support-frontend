// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, contributionsTermsLinks } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import type { ContributionType } from 'helpers/contributions';

// ---- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
|};


// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {
  const terms = <a href={contributionsTermsLinks[props.countryGroupId]}>Terms and Conditions</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  return (
    <div className="component-terms-privacy">
      {props.contributionType !== 'ONE_OFF' ?
        <div>
          Monthly contributions are billed each month and annual contributions are billed once a year.
          You can change how much you give or cancel your contributions at any time.
        </div>
        : null
      }
      By proceeding, you are agreeing to our {terms}. To find out what personal data we collect and how we use it,
        please visit our {privacy}.
    </div>
  );

}


// ----- Exports ----- //

export default TermsPrivacy;
