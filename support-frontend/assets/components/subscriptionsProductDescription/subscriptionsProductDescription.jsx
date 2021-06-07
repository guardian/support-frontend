// @flow

import React from 'react';

import AnchorButton from 'components/button/anchorButton';

// types
import { type Option } from 'helpers/types/option';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';

type PropTypes = {
  title: string,
  subtitle: string,
  description: string,
  isFeature: Option<boolean>,
  offer?: Option<string>,
  buttons: ProductButton[],
  isVariant: boolean,
};

const getButtonAppearance = (isFeature, index, hierarchy) => {
  if (isFeature && index === 0) {
    return 'primary';
  } else if (isFeature && index >= 1) {
    return 'tertiaryFeature';
  } else if ((!isFeature && index === 0) || (!isFeature && hierarchy === 'first')) {
    return 'secondary';
  }
  return 'tertiary';
};

const getButtonContainerStyle = (isFeature, isVariant) => {
  if (isFeature && isVariant) {
    return 'subscriptions__button-container--featureVariant';
  } else if (isFeature && !isVariant) {
    return 'subscriptions__button-container--feature';
  }
  return 'subscriptions__button-container';
};

const SubscriptionsProductDescription = ({
  title, subtitle, description, offer, isFeature, buttons, isVariant,
}: PropTypes) => (
  <div>
    <h2 className="subscriptions__product-title">{title}</h2>
    {offer && <h3 className="subscriptions__sales">{offer}</h3>}
    {offer && <h3 className="subscriptions__product-subtitle--small">{subtitle}</h3>}
    {!offer && <h3 className="subscriptions__product-subtitle--large">{subtitle}</h3>}
    <p className="subscriptions__description">{description}</p>
    <div className={getButtonContainerStyle(isFeature, isVariant)}>
      {buttons.map((button, index) => (
        <AnchorButton
          href={button.link}
          onClick={button.analyticsTracking}
          appearance={getButtonAppearance(isFeature, index, button.hierarchy)}
          modifierClasses={['subscriptions__product-button']}
        >
          {button.ctaButtonText}
        </AnchorButton>
        ))}
    </div>
  </div>
);

SubscriptionsProductDescription.defaultProps = {
  offer: null,
  buttons: {
    hierarchy: '',
  },
};

export default SubscriptionsProductDescription;
