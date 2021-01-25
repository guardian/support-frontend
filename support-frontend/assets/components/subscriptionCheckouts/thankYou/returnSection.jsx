// @flow

// ----- Imports ----- //

import React from 'react';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Content, { Divider, NarrowContent } from 'components/content/content';
import { LinkButton } from '@guardian/src-button';
import type { SubscriptionProduct } from 'helpers/subscriptions';

type PropTypes = {
  subscriptionProduct: SubscriptionProduct,
}

// ----- Component ----- //

function ReturnSection(props: PropTypes) {

  return (
    <Content>
      <Divider />
      <NarrowContent>
        <div className="thank-you-stage__ctas">
          <LinkButton
            priority="subdued"
            aria-label="Return to The Guardian home page"
            href="https://theguardian.com"
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_return_home',
              product: props.subscriptionProduct,
              componentType: 'ACQUISITIONS_BUTTON',
            })}
            modifierClasses={['visited-white-text']}
          >
            Return to The Guardian
          </LinkButton>
        </div>
      </NarrowContent>
    </Content>
  );

}


// ----- Exports ----- //

export default ReturnSection;
