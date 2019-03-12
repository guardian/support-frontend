// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, contributionsTermsLinks } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import type { ContributionType } from 'helpers/contributions';
import { isFrontlineCampaign } from 'helpers/url';

// ---- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
|};


// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {
  const terms = <a href={contributionsTermsLinks[props.countryGroupId]}>Terms and Conditions</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  if (isFrontlineCampaign()) {
    return (
      <div className="component-terms-privacy">
        By proceeding, you’re agreeing to our Terms and Conditions.
        If we hit our goal of $100,000, The Guardian will allocate this amount to its core operations
        which will help fund the completion of the ‘The Frontline: Australia and the climate emergency’ series,
        including editing, reporting, graphics and new commissions. If we exceed our fundraising goal,
        The Guardian will allocate the additional funds towards its core operations that fund our in-depth
        environmental reporting. If we fall short of the goal, The Guardian will allocate the funds for a scaled
        back project on climate change. Contributions will not be returned. Your contribution is also governed by
        our standard contribution terms and conditions.
      </div>
    );
  }

  return (
    <div className="component-terms-privacy">
      {props.contributionType !== 'ONE_OFF' ?
        <div className="component-terms-privacy__change">
          Monthly contributions are billed each month and annual contributions are billed once a year.
          You can change how much you give or cancel your contributions at any time.
        </div>
        : null
      }
      <div className="component-terms-privacy__terms">
        By proceeding, you are agreeing to our {terms}. To find out what personal data we collect and how we use it,
        please visit our {privacy}.
      </div>
    </div>
  );

}


// ----- Exports ----- //

export default TermsPrivacy;
