import React from 'react';
import GridImage from 'components/gridImage/gridImage';

const PaperPackshot = () => (
  <div>
    <GridImage
      classModifiers={['subscriptions-product-image--reverse']}
      gridId="subscriptionFeast"
      srcSizes={[660, 500, 140]}
      sizes="(max-width: 980px) 165px,
            190px"
      imgType="png"
    />
    <GridImage
      classModifiers={['subscriptions-product-image--reverse']}
      gridId="subscriptionPrint"
      srcSizes={[1000, 500, 140]}
      sizes="(max-width: 740px) 100%,
            (max-width: 980px) 275px,
            300px"
      imgType="png"
    />
    <GridImage
      classModifiers={['subscriptions-product-image--reverse']}
      gridId="subscriptionG2"
      srcSizes={[756, 500, 140]}
      sizes="(max-width: 980px) 195px,
            220px"
      imgType="png"
    />
  </div>
);

export default PaperPackshot;
