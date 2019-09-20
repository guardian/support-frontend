import React from 'react';

import GridImage from 'components/gridImage/gridImage';

const GuardianWeeklyPackShot = () => (
  <div>
    <GridImage
      classModifiers={['subscriptions-product-image']}
      gridId="subscriptionPackshot3"
      srcSizes={[798, 500, 140]}
      sizes="(max-width: 980px) 175px,
            250px"
      imgType="png"
    />
    <GridImage
      classModifiers={['subscriptions-product-image']}
      gridId="subscriptionPackshot2"
      srcSizes={[801, 477]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 175px,
            250px"
      imgType="png"
    />
    <GridImage
      classModifiers={['subscriptions-product-image']}
      gridId="subscriptionPackshot3"
      srcSizes={[798, 500, 140]}
      sizes="(max-width: 980px) 175px,
            250px"
      imgType="png"
    />
  </div>
);

export default GuardianWeeklyPackShot;
