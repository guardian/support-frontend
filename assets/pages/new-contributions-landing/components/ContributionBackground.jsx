// @flow

// ----- Imports ----- //

import React from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import SvgContributionsBgDesktop from 'components/svgs/contributionsBgDesktop';
import GridPicture from 'components/gridPicture/gridPicture';

type PropTypes = {|
  countryGroupId: CountryGroupId,
|};

// ----- Render ----- //

function NewContributionBackground(props: PropTypes) {
  if (props.countryGroupId !== 'UnitedStates') {
    return (
      <div className="gu-content__bg">
        <SvgContributionsBgDesktop />
      </div>
    );
  }
  return (
    <div className="us-campaign__background">
      <GridPicture
        sources={[
          {
           gridId: 'UsCampaignLanding',
           srcSizes: [1500, 1500],
           imgType: 'png',
           sizes: '100vw',
           media: '(max-width: 1500px)',
          },
          {
           gridId: 'UsCampaignLanding',
           srcSizes: [1500, 1500],
           imgType: 'png',
           sizes: '(min-width: 1500px) 1500px, 1500px',
           media: '(min-width: 1500px)',
          },
          ]}
        fallback="UsCampaignLanding"
        fallbackSize={1500}
        altText=""
        fallbackImgType="png"
      />
    </div>
  );
}

export { NewContributionBackground };
