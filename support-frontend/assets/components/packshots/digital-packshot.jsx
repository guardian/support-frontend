import React from 'react';

import GridPicture from 'components/gridPicture/gridPicture';

const DigitalPackshot = () => (
  <div className="subscriptions-int-daily-packshot">
    <GridPicture
      sources={[
        {
          gridId: 'subscriptionDailyPackshotMobile',
          srcSizes: [500],
          imgType: 'png',
          sizes: '100vw',
          media: '(max-width: 739px)',
        },
        {
          gridId: 'subscriptionDailyPackshot',
          srcSizes: [1000, 500],
          imgType: 'png',
          sizes: '(min-width: 1000px) 2000px, 1000px',
          media: '(min-width: 740px)',
        },
      ]}
      fallback="subscriptionDailyPackshotMobile"
      fallbackSize={1000}
      altText=""
      fallbackImgType="png"
    />
  </div>
);

export default DigitalPackshot;
