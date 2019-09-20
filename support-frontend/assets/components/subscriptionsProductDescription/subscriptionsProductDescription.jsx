// @flow

import React from 'react';

import AnchorButton from 'components/button/anchorButton';

// types
import { type Option } from 'helpers/types/option';

type PropTypes = {
  title: string,
  subtitle: string,
  description: string,
  ctaButtonText: string,
  isFeature: boolean,
  offer?: Option<string>,
  link: string,
};

const SubscriptionsProductDescription = ({
  title, subtitle, description, ctaButtonText, offer, isFeature, link,
}: PropTypes) => (
  <div>
    <h2 className="subscriptions__product-title">{title}</h2>
    <h3 className="subscriptions__product-subtitle">{subtitle}</h3>
    {offer && <h4 className="subscriptions__sales">Up to 52% off for a year</h4>}
    <p className="subscriptions__description">{description}</p>
    <AnchorButton
      href={link}
      modifierClasses={(!isFeature) ? ['subscriptions__product-button'] : []}
    >
      {ctaButtonText}
    </AnchorButton>
  </div>
);

SubscriptionsProductDescription.defaultProps = {
  offer: null,
};

export default SubscriptionsProductDescription;
