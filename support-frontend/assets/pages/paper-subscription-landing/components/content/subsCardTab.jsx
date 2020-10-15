// @flow

// ----- Imports ----- //

import React from 'react';

import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { accordionContainer } from './tabsStyles';

import { ContentForm, type ContentTabPropTypes } from './helpers';

const LinkToImovo = () => <a href="https://imovo.org/guardianstorefinder" target="_blank" rel="noopener noreferrer">Find your nearest participating retailer</a>;

// ----- Content ----- //
const SubsCardFaqBlock = () => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="printCampaignDigitalVoucher"
      srcSizes={[694, 500, 140]}
      sizes="(max-width: 740px) 100vw, 600px"
      imgType="png"
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
              Home Delivery Letter.
            </p>
            <p><LinkToImovo /></p>
          </AccordionRow>
        </Accordion>
      </div>
    </Text>

  </Content>
);

const SubscriptionCardTab = ({ getRef, setTabAction, selectedTab }: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable use-digital-voucher" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <SubsCardFaqBlock />
    <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below" />
  </div>
);
export default SubscriptionCardTab;
