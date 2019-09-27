import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const FeaturePackshot = () => (
  <div className="subscriptions-feature-packshot">
    <GridImage
      gridId="subscriptionFeature"
      srcSizes={[1000, 500]}
      sizes="(max-width: 480px) 100px,
              (max-width: 740px) 100%,
              (max-width: 1067px) 150%,
              800px"
      imgType="png"
    />
  </div>
);

export default FeaturePackshot;
