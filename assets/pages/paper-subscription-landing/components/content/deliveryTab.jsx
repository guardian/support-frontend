// @flow

// ----- Imports ----- //

import React from 'react';
import ProductPageContentBlock, { Divider } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import UnorderedList from 'components/list/unorderedList';
import OrderedList from 'components/list/orderedList';
import GridImage from 'components/gridImage/gridImage';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { setTab } from '../../paperSubscriptionLandingPageActions';

import { ContentHelpBlock, LinkTo, ContentForm, type ContentTabPropTypes } from './helpers';


// ----- Content ----- //
const ContentDeliveryFaqBlock = ({ setTabAction }: {setTabAction: typeof setTab}) => (
  <ProductPageContentBlock
    border
    image={<GridImage
      gridId="paperDeliveryFeature"
      srcSizes={[920, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
    }
  >
    <ProductPageTextBlock title="How home delivery works">
      <p>
          If you live in Greater London (within the M25), you
          can use The Guardian’s home delivery service. Don’t
          worry if you live outside this area you can
          still <LinkTo tab="collection" setTabAction={setTabAction} >subscribe using our voucher scheme</LinkTo>.
      </p>
      <OrderedList items={[
        'Select your subscription below and checkout',
        'Your subscribing deliveries will begin as quickly as five days from you subscribing',
        ]}
      />
    </ProductPageTextBlock>
    <Divider small />
    <ProductPageTextBlock title="Giving you peace of mind">
      <UnorderedList items={[
        'Your paper will arrive before 7am from Monday to Saturday and before 8.30am on Sunday',
        'We can’t deliver to individual flats, or apartments within blocks because we need access to your post box to deliver your paper',
        'You can pause your subscription for up to 36 days a year. So if you’re going away anywhere, you won’t have to pay for the papers that you miss',
        ]}
      />
    </ProductPageTextBlock>
  </ProductPageContentBlock>

);

const DeliveryTab = ({ getRef, setTabAction, selectedTab }: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <ContentDeliveryFaqBlock setTabAction={setTabAction} />
    <ContentForm selectedTab={selectedTab} setTabAction={setTabAction} title="Pick your subscription package below: Delivery" />
    <ContentHelpBlock
      faqLink={
        <a
          href="https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions"
          onClick={sendClickedEvent('paper_subscription_delivery_page-subscription_faq_link')}
        >
        Subscriptions FAQs
        </a>
      }
      telephoneLink={
        <a
          href="tel:+4403303336767" // yes, we're using a phone number as a link
          onClick={sendClickedEvent('paper_subscription_delivery_page-telephone_link')}
        >
          0330 333 6767
        </a>
      }
    />
  </div>
);

export default DeliveryTab;
