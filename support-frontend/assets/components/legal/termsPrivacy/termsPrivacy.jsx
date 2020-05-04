// @flow

// ----- Imports ----- //

import React from 'react';

import { privacyLink, contributionsTermsLinks, philanthropyContactEmail } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type IsoCurrency, fromCountryGroupId, currencies } from 'helpers/internationalisation/currency';
import type { ContributionType } from 'helpers/contributions';
import { type CampaignName, campaigns } from 'helpers/campaigns';
import './termsPrivacy.scss';
import { Divider } from 'components/content/content';


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
  const regionalAmounts = {
    GBP: 100,
    USD: 135,
    EUR: 117,
    AUD: 185,
    CAD: 167,
    NZD: 200,
  };
  const getRegionalAmountString = (): string => {
    const currency: IsoCurrency = fromCountryGroupId(props.countryGroupId) || 'GBP';
    return `${currencies[currency].glyph}${regionalAmounts[currency]}`;
  };

  const patronsLink = <a href="https://patrons.theguardian.com/join?INTCMP=gdnwb_copts_support_contributions_referral">Find out more today</a>;
  const americasContactLink = <a href={"mailto:northamerica.help@guardian.co.uk"}>contact us</a>

  const patronText = (
    <div className="patrons">
      <h4>Guardian Patrons programme</h4>
      <p>
        If you would like to support us at a higher level, from {getRegionalAmountString()} a month,
        you can join us as a Guardian Patron. {patronsLink}
      </p>
    </div>
  );

  const patronAndPhilanthropicAskText = (
    <div>
      <div className="horizontalRule"></div>
      <div className="philanthropic-ask">
        <h4>Contribute another way</h4>
        <p>
          Please {americasContactLink} if you would like to: make a larger single contribution
          as an individual, contribute as a company or foundation, or would like
          to discuss legacy gifting.
        </p>
        <p>
          To contribute at a higher level on a recurring basis, you can join as a
          Guardian Patron. {patronsLink}.
        </p>
        <p>
          Thank you for your generosity.
        </p>
      </div>
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
          {props.countryGroupId}
          By proceeding, you are agreeing to our {terms}. To find out what personal data we collect and how we use it,
          please visit our {privacy}.
        </div>
      </div>
      <hr/>
      <div>
        {
          props.contributionType !== 'ONE_OFF' &&
          (props.countryGroupId === "UnitedStates") ? patronAndPhilanthropicAskText : patronText
        }
      </div>
    </>
  );
}


// ----- Exports ----- //

export default TermsPrivacy;
