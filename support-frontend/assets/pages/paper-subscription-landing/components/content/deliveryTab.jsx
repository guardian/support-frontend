// @flow

// ----- Imports ----- //

import React from 'react';
import Content from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import { setTab } from '../../paperSubscriptionLandingPageActions';

import {
  ContentForm,
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
      gridId="printCampaignHDiMovo"
      srcSizes={[716, 500, 140]}
      sizes="(max-width: 740px) 100vw, 400px"
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
  <div
    className={`paper-subscription-landing-content__focusable${useDigitalVoucher ? ' use-digital-voucher' : ''}`}
    tabIndex={-1}
    ref={(r) => { getRef(r); }}
  >
    <ContentDeliveryFaqBlock setTabAction={setTabAction} useDigitalVoucher={useDigitalVoucher} />
    <ContentForm
      selectedTab={selectedTab}
      setTabAction={setTabAction}
      title="Pick your home delivery subscription package below"
      useDigitalVoucher={useDigitalVoucher}
    />
  </div>
);

export default DeliveryTab;
