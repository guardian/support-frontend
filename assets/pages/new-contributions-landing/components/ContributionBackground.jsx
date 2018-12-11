// @flow

// ----- Imports ----- //

import React from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import SvgContributionsBgDesktop from 'components/svgs/contributionsBgDesktop';
import GridPicture from 'components/gridPicture/gridPicture';

type PropTypes = {|
  countryGroupId: CountryGroupId,
  usDesktopEOYCampaignVariant: string,
|};

// ----- Render ----- //

function NewContributionBackground(props: PropTypes) {
  const showUsBackground = (props.countryGroupId === 'UnitedStates' && props.usDesktopEOYCampaignVariant === 'copyAndTickerAndBackgroundImage');

  if (showUsBackground) {
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
  return (
    <div className="gu-content__bg">
      <SvgContributionsBgDesktop />
    </div>
  );
}

export { NewContributionBackground };
