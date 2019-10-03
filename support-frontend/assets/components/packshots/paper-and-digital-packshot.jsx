// @flow

import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const PaperAndDigitalPackshot = () => (
  <div className="paper-and-digital-packshot">
    <GridImage
      gridId="subscriptionIpad"
      srcSizes={[1000, 500, 140]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 275px,
            300px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionPrint"
      srcSizes={[805, 402]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 275px,
            300px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionIphone"
      srcSizes={[578, 527, 264]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 100px,
            125px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionPrintDigital"
      srcSizes={[452, 905, 1366]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 100px,
            125px"
      imgType="png"
    />
  </div>
);

export default PaperAndDigitalPackshot;
