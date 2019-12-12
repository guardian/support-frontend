// @flow

import React from 'react';

// components
import SubscriptionsProduct from './subscriptionsProduct';
import FeatureHeader from './featureHeader';
import State from '../subscriptionsLandingReducer';

import { getSubscriptionCopy } from '../copy/subscriptionCopy';
import type { ProductCopy } from '../copy/subscriptionCopy';
import { connect } from 'react-redux';

type PropTypes = {subscriptionCopy: ProductCopy[]};

const mapStateToProps = (state: State) => ({
  subscriptionCopy: getSubscriptionCopy(state),
});

const isFeature = index => index === 0; // make the first card a feature

const SubscriptionsLandingContent = (props: PropTypes) => (
  <div className="subscriptions-landing-page" id="qa-subscriptions-landing-page">
    <FeatureHeader />
    <div className="subscriptions__product-container">
      {props.subscriptionCopy.map((product, index) => (
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

export default connect(mapStateToProps)(SubscriptionsLandingContent);
