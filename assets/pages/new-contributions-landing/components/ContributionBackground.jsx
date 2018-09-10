// @flow

// ----- Imports ----- //

import React from 'react';

import SvgContributionsBgMobile from 'components/svgs/contributionsBgMobile';
import SvgContributionsBgDesktop from 'components/svgs/contributionsBgDesktop';

// ----- Render ----- //

function NewContributionBackground() {
  return (
    <div className="gu-content__bg">
      <SvgContributionsBgMobile />
      <SvgContributionsBgDesktop />
    </div>
  );
}

export { NewContributionBackground };
