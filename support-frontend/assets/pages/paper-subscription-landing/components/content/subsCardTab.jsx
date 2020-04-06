// @flow

// ----- Imports ----- //

import React from 'react';

import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';

import { ContentHelpBlock, ContentForm, type ContentTabPropTypes } from './helpers';


// ----- Content ----- //
const ContentVoucherFaqBlock = () => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="paperVoucherFeature"
      srcSizes={[750, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
  }
  >
    <Text>
      The Guardian subscription card can be used at any of the 40,000 shops and supermarkets with news kiosks
      in the UK.
    </Text>
    <Text>
      You can collect the newspaper from your local store or have your copies delivered by your newsagent.
    </Text>
  </Content>
);

const SubscriptionCardTab = ({ getRef, setTabAction, selectedTab }: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <ContentVoucherFaqBlock />
    <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below" />
    <ContentHelpBlock
      faqLink={
        <a
          href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
          onClick={sendClickedEvent('paper_subscription_collection_page-subscription_faq_link')}
        >
        Subscriptions FAQs
        </a>
      }
      telephoneLink={
        <a
          href="tel:+4403303336767"
          onClick={sendClickedEvent('paper_subscription_collection_page-telephone_link')}
        >0330 333 6767
        </a>
      }
    />
  </div>
);
export default SubscriptionCardTab;
