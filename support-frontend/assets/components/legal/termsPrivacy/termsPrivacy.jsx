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
        <p className="component-terms-thefrontline">
          By proceeding, you’re agreeing to our <span className="bold">Terms and Conditions</span>.
          If we hit our goal of $150,000, The Guardian will allocate this amount to its core operations
          which will help fund the completion of the ‘The Frontline: Australia and the climate emergency’ series,
          including editing, reporting, graphics and new commissions. If we fall short of the goal,
          The Guardian will allocate the funds for a scaled back project on climate change.
          Contributions will not be returned. Your contribution is also governed by
          our standard <a href={contributionsTermsLinks[props.countryGroupId]}>contribution terms and conditions</a>.
        </p>
        <p>
          We also take larger gifts from companies, foundations and individuals to help support The Guardian’s
          independent, public interest journalism. If you would like to get involved, please <a href="mailto:apac.help@theguardian.com">contact us</a>.
        </p>
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
