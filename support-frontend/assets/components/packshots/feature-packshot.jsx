import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const FeaturePackshot = () => (
  <div>
    <GridImage
      classModifiers={['subscriptions-feature-image']}
      gridId="subscriptionsFeature"
      srcSizes={[771, 484, 242]}
      sizes="(max-width: 480px) 100px,
              (max-width: 740px) 200px,
              300px"
      imgType="png"
    />
    <GridImage
      classModifiers={['subscriptions-feature-image']}
      gridId="subscriptionsFeatureTwo"
      srcSizes={[636, 462, 231]}
      sizes="(max-width: 480px) 100px,
            (max-width: 740px) 200px,
            300px"
      imgType="jpg"
    />
    <GridImage
      classModifiers={['subscriptions-feature-image']}
      gridId="subscriptionsFeatureTwo"
      srcSizes={[636, 462, 231]}
      sizes="(max-width: 480px) 100px,
              (max-width: 740px) 200px,
              300px"
      imgType="jpg"
    />
  </div>
);

export default FeaturePackshot;
