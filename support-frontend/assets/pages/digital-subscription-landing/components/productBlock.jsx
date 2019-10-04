// @flow
import React from 'react';
import AdFreeSectionC from 'components/adFreeSectionC/adFreeSectionC';

// styles
import './digitalSubscriptionLanding.scss';

const Plus = () => <div className="product-block__plus">+ Plus</div>;

const ProductBlock = () => (
  <div className="hope-is-power__products">
    <div className="product-block__container hope-is-power--centered">
      <div className="product-block__container__label--top">What&apos;s included?</div>
      <div className="product-block__item">
        <div className="product-block__item__title">The Guardian Daily</div>
      </div>
      <Plus />
      <div className="product-block__item">
        <div className="product-block__item__title">Premium access to the Live app</div>
      </div>
      <Plus />
      <AdFreeSectionC />
    </div>
  </div>

);

export default ProductBlock;
