// @flow

import React from 'react';

// components
import SubscriptionsProduct from './subscriptionsProduct';
import FeatureHeader from './featureHeader';

import { subscriptionCopy } from '../copy/subscriptionCopy'; // make the first card a feature

const isFeature = index => index === 0;

const SubscriptionsLandingContent = () => (
  <div className="subscriptions-landing-page" id="qa-subscriptions-landing-page">
    <FeatureHeader />
    <div className="subscriptions__product-container">
      {subscriptionCopy.map((product, index) => (
        <SubscriptionsProduct
          title={product.title}
          subtitle={product.subtitle}
          description={product.description}
          productImage={product.productImage}
          buttons={product.buttons}
          offer={product.offer || null}
          isFeature={isFeature(index)}
          classModifier={product.classModifier}
        />
      ))}
    </div>
  </div>
);

export default SubscriptionsLandingContent;
