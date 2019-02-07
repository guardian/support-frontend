// @flow

// ----- Imports ----- //

import React from 'react';

import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';


// ----- Component ----- //

function ThankYouPendingContent() {

  return (
    <div>
      <ProductPageContentBlock>
        <ProductPageTextBlock>
          <LargeParagraph>
            Thank you for subscribing to the Digital Pack.
            Your subscription is being processed and you will
            receive an email when your account is live.
          </LargeParagraph>
          <p>
            If you require any further assistance, you can visit
            our <a href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions">FAQs page</a> to
            find answers to common user issues. Alternatively, you can also
            visit our <a href="https://www.theguardian.com/help">Help page</a> for customer support.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </div>
  );

}

// ----- Export ----- //

export default ThankYouPendingContent;
