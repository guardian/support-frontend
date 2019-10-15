import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const SubscriptionDailyPackshot = () => (
  <div className="subscriptions-feature-packshot">
    <GridImage
      classModifiers={['']}
      gridId="subscriptionDailyPackshot"
      srcSizes={[1000]}
      sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            800px"
      imgType="png"
    />
  </div>
);

export default SubscriptionDailyPackshot;
