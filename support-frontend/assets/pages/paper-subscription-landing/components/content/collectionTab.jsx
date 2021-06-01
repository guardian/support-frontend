// @flow

// ----- Imports ----- //

import React from 'react';

import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { paperHasDeliveryEnabled } from 'helpers/productPrice/subscriptions';

import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';


const accordionContainer = css`
  background-color: ${neutral['97']};

  p {
    ${textSans.small()};
    margin-bottom: ${space[4]}px;
  }
`;


// ----- Content ----- //
export const ContentVoucherFaqBlock = () => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="paperVoucherFeature"
      srcSizes={[750, 500, 140]}
      sizes="(max-width: 740px) 100vw, 400px"
      imgType="png"
    />
  }
  >
    <Text>
        Pick your subscription package below. We’ll send you a book of vouchers that
        contain one voucher per paper in your subscription.
    </Text>
    <Text>
        Take your voucher to your retailer. Your vouchers will be accepted at retailers
        across the UK, including most independent newsagents.
    </Text>
    <Text>
      <div css={accordionContainer}>
        <Accordion>
          <AccordionRow label="Voucher details">
            <p>
              Your newsagent won’t lose out; we’ll pay them the same amount that they receive if
              you pay cash for your paper.
            </p>
            <p>
              You can pause your subscription for up to four weeks a year. So if you’re going on holiday,
              you won’t have to pay for the papers you’ll miss.
            </p>
          </AccordionRow>
        </Accordion>
      </div>
    </Text>
  </Content>
);
