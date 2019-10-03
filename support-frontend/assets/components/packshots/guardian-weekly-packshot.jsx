// @flow

import React from 'react';

import GridImage from 'components/gridImage/gridImage';

/** NOTE about packshot images
 * ------
 * because these images are absolute positioned and thus provide
 * no width or height information to rest of the DOM
 * these packshots must have a width applied to allow the
 * container CSS to center the pack shot as a single image
 * this is applied using the "subscriptions__guardian-weekly-packshot" class in this instance
 *  */


const GuardianWeeklyPackShot = () => (
  <div className="subscriptions__guardian-weekly-packshot">
    <GridImage
      gridId="subscriptionWeekly1"
      srcSizes={[798, 500, 140]}
      sizes="(max-width: 980px) 175px,
            250px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionWeekly2"
      srcSizes={[783, 392]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 175px,
            250px"
      imgType="png"
    />
    <GridImage
      gridId="subscriptionWeekly3"
      srcSizes={[798, 500, 140]}
      sizes="(max-width: 980px) 175px,
            250px"
      imgType="png"
    />
  </div>
);

export default GuardianWeeklyPackShot;
