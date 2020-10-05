// @flow

// ----- Imports ----- //

import React from 'react';

import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';

import { ContentForm, type ContentTabPropTypes } from './helpers';

const accordionContainer = css`
  background-color: ${neutral['97']};

  p, a {
    ${textSans.small()};
    margin-bottom: ${space[3]}px;
  }
`;

const LinkToImovo = () => <a href="https://imovo.org/guardianstorefinder">Find your nearest participating retailer</a>;

// ----- Content ----- //
const SubsCardFaqBlock = () => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="printCampaigniMovo"
      srcSizes={[562, 500, 140]}
      sizes="(max-width: 740px) 100vw, 600px"
      imgType="jpg"
    />
  }
  >
    <Text>
      The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with
      news kiosks in the UK.
    </Text>
    <Text>
      You can collect the newspaper from your local store or have your copies delivered by your newsagent.
    </Text>
    <Text>
      <div css={accordionContainer}>
        <Accordion>
          <AccordionRow label="Collecting from multiple newsagents">
            <p>
              Present your card to a newsagent each time you collect the paper. The newsagent will scan your
              card and will be reimbursed for each transaction automatically.
            </p>
            <p><LinkToImovo /></p>
          </AccordionRow>
          <AccordionRow label="Delivery from your retailer">
            <p>
              Simply give your preferred store / retailer the barcode printed on your
              subscription letter.
            </p>
            <p><LinkToImovo /></p>
          </AccordionRow>
        </Accordion>
      </div>
    </Text>

  </Content>
);

const SubscriptionCardTab = ({ getRef, setTabAction, selectedTab }: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <SubsCardFaqBlock />
    <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below" />
  </div>
);
export default SubscriptionCardTab;
