// @flow

// ----- Imports ----- //

import React from 'react';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Content, { Divider, NarrowContent } from 'components/content/content';
import AnchorButton from 'components/button/anchorButton';


// ----- Component ----- //

function ReturnSection() {

  return (
    <Content>
      <Divider />
      <NarrowContent>
        <div className="thank-you-stage__ctas">
          <AnchorButton
            appearance="secondary"
            aria-label="Return to The Guardian home page"
            href="https://theguardian.com"
            onClick={sendTrackingEventsOnClick('checkout_return_home', 'DigitalPack', null)}
          >
            Return to The Guardian
          </AnchorButton>
        </div>
      </NarrowContent>
    </Content>
  );

}


// ----- Exports ----- //

export default ReturnSection;
