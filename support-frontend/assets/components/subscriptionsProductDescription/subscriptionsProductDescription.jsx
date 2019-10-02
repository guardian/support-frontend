// @flow

import React from 'react';

import AnchorButton from 'components/button/anchorButton';

// types
import { type Option } from 'helpers/types/option';

type ProductButton = {
  ctaButtonText: string,
  link: string,
};

type PropTypes = {
  title: string,
  subtitle: string,
  description: string,
  isFeature: Option<boolean>,
  offer?: Option<string>,
  buttons: ProductButton[],
};

const SubscriptionsProductDescription = ({
  title, subtitle, description, offer, isFeature, buttons,
}: PropTypes) => (
  <div>
    <h2 className="subscriptions__product-title">{title}</h2>
    <h3 className="subscriptions__product-subtitle">{subtitle}</h3>
    {offer && <h4 className="subscriptions__sales">{offer}</h4>}
    <p className="subscriptions__description">{description}</p>
    {buttons.map(button => (
      <AnchorButton
        href={button.link}
        modifierClasses={(!isFeature) ? ['subscriptions__product-button'] : []}
        onClick={button.analyticsTracking}
      >
        {button.ctaButtonText}
      </AnchorButton>
    ))}
  </div>
);

SubscriptionsProductDescription.defaultProps = {
  offer: null,
};

export default SubscriptionsProductDescription;
