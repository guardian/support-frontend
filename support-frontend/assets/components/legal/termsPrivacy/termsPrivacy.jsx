// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, contributionsTermsLinks, philanthropyContactEmail } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, fromCountryGroupId, currencies } from 'helpers/internationalisation/currency';
import type { ContributionType } from 'helpers/contributions';
import { type CampaignName, campaigns } from 'helpers/campaigns';
import './termsPrivacy.scss';


// ---- Types ----- //

type PropTypes = {|
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
  campaignName: ?CampaignName,
|};

// ----- Component ----- //

function TermsPrivacy(props: PropTypes) {
  const terms = <a href={contributionsTermsLinks[props.countryGroupId]}>Terms and Conditions</a>;
  const privacy = <a href={privacyLink}>Privacy Policy</a>;

  const getRegionalAmount = (countryGroupId: CountryGroupId): number => {
    const isoCurrency: IsoCurrency = fromCountryGroupId(countryGroupId);
    switch (isoCurrency) {
      case 'GBP':
        return 100;
      case 'USD':
        return 135;
      case 'EUR':
        return 117;
      case 'AUD':
        return 185;
      case 'CAD':
        return 167;
      case 'NZD':
        return 200;
      default:
        return 100;
    }
  };
  const regionalAmount = `${currencies[fromCountryGroupId(props.countryGroupId)].glyph}${getRegionalAmount(props.countryGroupId)}`;
  const patronsLink = <a href="https://patrons.theguardian.com/join">Find out more today</a>;
  const patronText = (
    <div className="patrons">
      <h4>Guardian Patrons programme</h4>
      <p>
        If you would like to support us at a higher level, from {regionalAmount} a month,
        you can join us as a Guardian Patron. {patronsLink}
      </p>
    </div>
  );


  if (props.campaignName && campaigns[props.campaignName] && campaigns[props.campaignName].termsAndConditions) {
    return campaigns[props.campaignName].termsAndConditions(
      contributionsTermsLinks[props.countryGroupId],
      philanthropyContactEmail[props.countryGroupId],
    );
  }

  return (
    <>
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
      <div>{props.contributionType !== 'ONE_OFF' && patronText}</div>
    </>
  );
}


// ----- Exports ----- //

export default TermsPrivacy;
