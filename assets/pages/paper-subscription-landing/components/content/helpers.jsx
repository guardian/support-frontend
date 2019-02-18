// @flow

// ----- Imports ----- //

import React, { type Element, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import Content from 'components/content/content';
import Text, { SansParagraph, Callout } from 'components/text/text';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import { paperSubsUrl } from 'helpers/routes';
import { flashSaleIsActive, getDiscount, getDuration } from 'helpers/flashSale';

import { type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';
import { setTab } from '../../paperSubscriptionLandingPageActions';

import Form from './form';


// Types
export type ContentPropTypes = {|
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab
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
    return <Callout>Save an extra {Math.round(discount * 100)}% for {duration}</Callout>;
  } else if (discount) {
    return <Callout>Save an extra {Math.round(discount * 100)}% </Callout>;
  }
  return null;

};


// ----- Auxiliary Components ----- //
const ContentHelpBlock = ({
  faqLink, telephoneLink,
}: {|
  faqLink: Element<string>,
  telephoneLink: Element<string>
|}) => (
  <Content appearance="feature" modifierClasses={['faqs']}>
    <Text title="FAQ and help">
      <SansParagraph>
        If you’ve got any more questions, you might well find the answers in the {faqLink}.
      </SansParagraph>
      <SansParagraph>
        If you can’t find the answer to your question here, please call our customer services team on {telephoneLink}.
      </SansParagraph>
    </Text>
  </Content>
);

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
  title, text, setTabAction, selectedTab,
}: {|
  title: string,
  text?: Option<string>,
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab
|}) => (
  <Content appearance="feature" id="subscribe">
    <Text
      title={title}
    >
      <DiscountCalloutMaybe />
      {text &&
      <p>{text}</p>
      }
    </Text>
    <Form />
    <Text>
      <SansParagraph>
        {
          selectedTab === 'collection'
            ? <LinkTo tab="delivery" setTabAction={setTabAction}>Switch to Delivery</LinkTo>
            : <LinkTo tab="collection" setTabAction={setTabAction}>Switch to Vouchers</LinkTo>
        }
      </SansParagraph>
    </Text>
    <ProductPageInfoChip>
      {getPageInfoChip()}
    </ProductPageInfoChip>
  </Content>
);
ContentForm.defaultProps = { text: null };

export { ContentHelpBlock, LinkTo, ContentForm };
