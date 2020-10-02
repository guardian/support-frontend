// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import Content from 'components/content/content';
import Text, { SansParagraph, Callout } from 'components/text/text';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import { paperSubsUrl } from 'helpers/routes';
import { flashSaleIsActive, getDiscount, getDuration } from 'helpers/flashSale';

import { type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';
import { setTab } from '../../paperSubscriptionLandingPageActions';

import Form from './form';
import { Collection, HomeDelivery } from 'helpers/productPrice/fulfilmentOptions';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import InfoSvg from './info.svg';

// Types
export type ContentPropTypes = {|
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab,
  useDigitalVoucher?: Option<boolean>,
|};

export type ContentTabPropTypes = {|
  ...ContentPropTypes,
  getRef: (?HTMLElement)=> void
|};

// Helper functions
const getPageInfoChip = (): string => {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    return 'You can cancel your subscription at any time. Offer is for the first year. Standard subscription rates apply thereafter.';
  }
  return 'You can cancel your subscription at any time.';
};

const DiscountCalloutMaybe = () => {
  if (!flashSaleIsActive('Paper', 'GBPCountries')) { return null; }
  const [discount, duration] = [
    getDiscount('Paper', 'GBPCountries'),
    getDuration('Paper', 'GBPCountries'),
  ];
  if (discount && duration) {
    return <Callout>Save up to {Math.round(discount * 100)}% for {duration}</Callout>;
  } else if (discount) {
    return <Callout>Save up to {Math.round(discount * 100)}% </Callout>;
  }
  return null;

};


// ----- Auxiliary Components ----- //
const LinkTo = ({
  setTabAction, tab, children,
}: {|
  setTabAction: typeof setTab,
  tab: ActiveTabState,
  children: Node
|}) => (
  <a
    href={paperSubsUrl(tab === 'delivery')}
    onClick={(ev) => {
      ev.preventDefault();
      setTabAction(tab);
    }}
  >
    {children}
  </a>
);

const ContentForm = ({
  title, text, setTabAction, selectedTab, useDigitalVoucher,
}: {|
  title: string,
  text?: Option<string>,
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab,
  useDigitalVoucher?: Option<boolean>,
|}) => (
  <Content id="subscribe" border={false}>
    <Text
      title={title}
    >
      <DiscountCalloutMaybe />
      {text &&
      <p>{text}</p>
      }
    </Text>
    <Form />
    {paperHasDeliveryEnabled() &&
      <Text>
        <SansParagraph>
          {
            selectedTab === Collection ?
              <LinkTo tab={HomeDelivery} setTabAction={setTabAction}>Switch to Delivery</LinkTo> :
              <LinkTo tab={Collection} setTabAction={setTabAction}>
                  Switch to {useDigitalVoucher ? 'Subscription card' : 'Vouchers'}
              </LinkTo>
          }
        </SansParagraph>
      </Text>
    }
    <ProductPageInfoChip icon={<InfoSvg />}>
      {getPageInfoChip()}
    </ProductPageInfoChip>
  </Content>
);
ContentForm.defaultProps = { text: null, useDigitalVoucher: null };

export { LinkTo, ContentForm };
