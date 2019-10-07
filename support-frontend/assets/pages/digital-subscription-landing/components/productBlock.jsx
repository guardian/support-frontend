// @flow
import React from 'react';
import AdFreeSectionC from 'components/adFreeSectionC/adFreeSectionC';

// styles
import './digitalSubscriptionLanding.scss';

const Plus = () => <div className="product-block__plus">+ Plus</div>;

type ListItemPropTypes = {
  boldText: string,
  explainer: string,
}

const ListItem = ({ boldText, explainer }: ListItemPropTypes) => (
  <li>
    <div className="product-block__list-item__bullet" />
    <span className="product-block__list-item--bold">{boldText}</span><br />
    <div className="product-block__list-item__explainer">{explainer}</div>
  </li>
);

const ProductBlock = () => (
  <div className="hope-is-power__products">
    <div className="product-block__container hope-is-power--centered">
      <div className="product-block__container__label--top">What&apos;s included?</div>
      <div className="product-block__item">
        <div className="product-block__item__title">The Guardian Daily</div>
      </div>
      <div className="product-block__dropdown">
        <div className="product-block__dropdown__title">The Guardian Daily in detail</div>
        <span className="product-block__ul-handler">
          <ul>
            <ListItem boldText="A new way to read" explainer="The newspaper, reimagined for mobile and tablet" />
            <ListItem boldText="Updated daily" explainer="Each edition available to read by 6am, 7 days a week" />
            <ListItem boldText="A new way to navigate" explainer="Read cover to cover, or swipe to sections" />
          </ul>
          <ul>
            <ListItem boldText="Multiple devices" explainer="Designed for your mobile or tablet on iOS or Android" />
            <ListItem boldText="Read offline" explainer="Schedule a download and read whenever it suits you" />
            <ListItem boldText="Ad free" explainer="Enjoy our journalism without adverts" />
          </ul>
        </span>
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
