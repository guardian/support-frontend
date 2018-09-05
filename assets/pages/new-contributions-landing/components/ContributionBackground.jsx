// @flow

// ----- Imports ----- //

import React from 'react';

import GridImage from 'components/gridImage/gridImage';
import SvgContributionsBgMobile from 'components/svgs/contributionsBgMobile';
import SvgContributionsBgDesktop from 'components/svgs/contributionsBgDesktop';

// ----- Render ----- //

function NewContributionBackground(props: PropTypes) {
  return (
    <div className="gu-content__bg">
      <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-a']} />
      <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-b']} />
      <GridImage gridId="newsroom" sizes="" srcSizes={[1000, 500, 140]} classModifiers={['circle-c']} />
      <SvgContributionsBgMobile />
      <SvgContributionsBgDesktop />
    </div>
  );
}

export { NewContributionBackground };
