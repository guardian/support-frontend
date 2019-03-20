// @flow

// ----- Imports ----- //

import React from 'react';

import { subscriptionsTermsLinks, privacyLink } from 'helpers/legal';
import { type SubscriptionProduct } from 'helpers/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import './subscriptionTermsPrivacy.scss';

// ---- Types ----- //

type PropTypes = {|
  subscriptionProduct: SubscriptionProduct,
|};

// ----- Component ----- //

function SubscriptionTermsPrivacy(props: PropTypes) {
  const terms = (
    <a
      className="component-subscription-terms-privacy__href"
      href={subscriptionsTermsLinks[props.subscriptionProduct]}
      onClick={sendTrackingEventsOnClick('subscription_terms', props.subscriptionProduct, null)}
    >
      Terms and Conditions
    </a>);

  const privacy = (
    <a
      className="component-subscription-terms-privacy__href"
      href={privacyLink}
      onClick={sendTrackingEventsOnClick('privacy_policy', props.subscriptionProduct, null)}
    >
      Privacy Policy
    </a>);

  return (
    <div className="component-subscription-terms-privacy">
      <div className="component-subscription-terms-privacy__text">
        By proceeding, you are agreeing to our {terms}. To find out what personal data we collect and how we use it,
        please visit our {privacy}.
      </div>
    </div>
  );
}

// ----- Exports ----- //

export default SubscriptionTermsPrivacy;
