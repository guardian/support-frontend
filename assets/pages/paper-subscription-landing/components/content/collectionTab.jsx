// @flow

// ----- Imports ----- //

import React from 'react';

import ProductPageContentBlock, { Divider } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import UnorderedList from 'components/list/unorderedList';
import OrderedList from 'components/list/orderedList';
import GridImage from 'components/gridImage/gridImage';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { ContentHelpBlock, ContentForm, type ContentTabPropTypes } from './helpers';


// ----- Content ----- //
const ContentVoucherFaqBlock = () => (
  <ProductPageContentBlock
    border
    image={<GridImage
      gridId="paperVoucherFeature"
      srcSizes={[750, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
  }
  >
    <ProductPageTextBlock title="How to use our vouchers?">
      <OrderedList items={[
        'Pick your subscription package below',
        'We’ll send you a book of vouchers that contain one voucher per paper in your subscription',
        'Take your voucher to your retailer. Your vouchers will be accepted at retailers across the UK, including most independent newsagents',
      ]}
      />
    </ProductPageTextBlock>
    <Divider small />
    <ProductPageTextBlock title="Giving you peace of mind">
      <UnorderedList items={[
        'Your newsagent won’t lose out; we’ll pay them the same amount that they receive if you pay cash for your paper',
        'You can pause your subscription for up to four weeks a year. So if you’re heading away, you won’t have to pay for the papers you’ll miss',
      ]}
      />
    </ProductPageTextBlock>
  </ProductPageContentBlock>
);

const CollectionTab = ({ getRef, setTabAction, selectedTab }: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <ContentVoucherFaqBlock />
    <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below: Voucher" />
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
export default CollectionTab;
