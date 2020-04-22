// @flow

// ----- Imports ----- //

import React from 'react';
import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

import { setTab } from '../../paperSubscriptionLandingPageActions';

import {
  ContentForm,
  ContentHelpBlock,
  type ContentTabPropTypes,
  LinkTo,
} from './helpers';
import { Collection } from 'helpers/productPrice/fulfilmentOptions';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import { Accordion, AccordionRow } from '@guardian/src-accordion';
import { css } from '@emotion/core';
import { neutral } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { type Option } from 'helpers/types/option';


const accordionContainer = css`
  background-color: ${neutral['97']};

  p {
    ${textSans.small()};
    margin-bottom: ${space[4]}px;
  }
`;

// ----- Content ----- //
const ContentDeliveryFaqBlock = ({
  setTabAction,
  useDigitalVoucher,
}: {setTabAction: typeof setTab, useDigitalVoucher?: Option<boolean>}) => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="paperDeliveryFeature"
      srcSizes={[920, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
    }
  >
    <Text>
      If you live in Greater London (within the M25), you can use The Guardian’s home delivery
      service. If not, you can use our <LinkTo tab={Collection} setTabAction={setTabAction}>{useDigitalVoucher ? 'subscription cards' : 'voucher scheme'}</LinkTo>.
    </Text>
    <Text>
      Select your subscription below and checkout. You&apos;ll receive your first newspaper
      as quickly as five days from subscribing.
    </Text>
    <Text>
      <div css={accordionContainer}>
        <Accordion>
          <AccordionRow label="Delivery details">
            <p>
              Your paper will arrive before 8am from Monday to Saturday and before 8.30am on Sunday.
            </p>
            <p>
              We can’t deliver to individual flats, or apartments within blocks because we need
              access to your post box to deliver your paper.
            </p>
            <p>
              You can pause your subscription for up to 36 days a year. So if you’re going away
              anywhere, you won’t have to pay for the papers that you miss.
            </p>
          </AccordionRow>
        </Accordion>
      </div>
    </Text>
  </Content>

);

ContentDeliveryFaqBlock.defaultProps = {
  useDigitalVoucher: null,
};

const DeliveryTab = ({
  getRef, setTabAction, selectedTab, useDigitalVoucher,
}: ContentTabPropTypes) => (
  <div className="paper-subscription-landing-content__focusable" tabIndex={-1} ref={(r) => { getRef(r); }}>
    <ContentDeliveryFaqBlock setTabAction={setTabAction} useDigitalVoucher={useDigitalVoucher} />
    <ContentForm
      selectedTab={selectedTab}
      setTabAction={setTabAction}
      title="Pick your home delivery subscription package below"
      useDigitalVoucher={useDigitalVoucher}
    />
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
