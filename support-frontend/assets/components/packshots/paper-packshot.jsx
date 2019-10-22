// @flow

import React from 'react';
import GridImage from 'components/gridImage/gridImage';

const PaperPackshot = () => (
  <div className="subscriptions__paper-packshot">
    <GridImage
      gridId="subscriptionFeast"
      srcSizes={[660, 500, 140]}
      sizes="(max-width: 740px) 100%,
             (max-width: 980px) 178px,
             (max-width: 1140px) 198px,
             220px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionPrint"
      srcSizes={[805, 402]}
      sizes="(max-width: 740px) 100%,
             (max-width: 980px) 240px,
             (max-width: 1140px) 311px,
             346px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionG2"
      srcSizes={[756, 500, 140]}
      sizes="(max-width: 740px) 100%,
             (max-width: 980px) 204px,
             (max-width: 1140px) 227px,
             252px"
      imgType="png"
    />
  </div>
);

export default PaperPackshot;
