// @flow
import React from 'react';
import AdFreeSectionC from 'components/adFreeSectionC/adFreeSectionC';

// styles
import './digitalSubscriptionLanding.scss';

const ProductBlock = () => (
  <div className="hope-is-power__products">
    <div className="product-block__container hope-is-power--centered">
      <div className="product-block__item">
        <div className="product-block__item__title">The Guardian Daily</div>
      </div>
      <div className="product-block__item">
        <div className="product-block__item__title">Premium access to the Live app</div>
      </div>
      <AdFreeSectionC />
    </div>
  </div>

);

export default ProductBlock;
