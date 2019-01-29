// @flow

// ----- Imports ----- //

import React from 'react';

import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import ProductPageContentBlock, { Divider, NarrowContent } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import AnchorButton from 'components/button/anchorButton';


// ----- Component ----- //

function ReturnSection() {

  return (
    <ProductPageContentBlock>
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
    </ProductPageContentBlock>
  );

}


// ----- Exports ----- //

export default ReturnSection;
