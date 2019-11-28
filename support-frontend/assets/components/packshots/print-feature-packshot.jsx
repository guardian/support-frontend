// @flow

import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const PrintFeaturePackshot = () => (
  <div>
    <GridImage
      classModifiers={['subscriptions-print-feature-image']}
      gridId="printFeaturePackshot"
      srcSizes={[1000, 500, 140]}
      sizes="(min-width: 480px) 100%"
      imgType="png"
    />
  </div>
);

export default PrintFeaturePackshot;
