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

export const accordionContainer = css`
  background-color: ${neutral['97']};

  p, a {
    ${textSans.small()};
    margin-bottom: ${space[3]}px;
  }

  p, button {
    padding-right: ${space[2]}px;
    padding-left: ${space[2]}px;
  }
`;

// ----- Content ----- //
const ContentDeliveryFaqBlock = ({
  setTabAction,
}: {setTabAction: typeof setTab}) => (
  <Content
    border={paperHasDeliveryEnabled()}
    image={<GridImage
      gridId="printCampaignHDdigitalVoucher"
      srcSizes={[562, 500, 140]}
      sizes="(max-width: 740px) 100vw, 500px"
      imgType="png"
    />
    }
  >
    <Text>
      If you live in Greater London (within the M25), you can use The Guardian’s home delivery
      service. If not, you can use our <LinkTo tab={Collection} setTabAction={setTabAction}>subscription cards</LinkTo>.
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

const DeliveryTab = ({
  getRef, setTabAction, selectedTab,
}: ContentTabPropTypes) => (
  <div
    className="paper-subscription-landing-content__focusable"
    tabIndex={-1}
    ref={(r) => { getRef(r); }}
  >
    <ContentDeliveryFaqBlock setTabAction={setTabAction} />
    <ContentForm
      selectedTab={selectedTab}
      setTabAction={setTabAction}
      title="Pick your home delivery subscription package below"
    />
  </div>
);

export default DeliveryTab;
