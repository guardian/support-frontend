// @flow

// ----- Imports ----- //

import React from 'react';

import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import { paperSubsUrl } from 'helpers/urls/routes';

import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

import { SubsCardFaqBlock } from './content/subsCardTab';
import { ContentDeliveryFaqBlock } from './content/deliveryTab';

// ----- Tabs ----- //

type TabOptions = {|
  name: string,
  href: string,
  content: (args: any) => React$Element<(props: any) => React$Element<"div">>
|}

export const tabs: {[PaperFulfilmentOptions]: TabOptions} = {
  Collection: {
    name: 'Subscription Card',
    href: paperSubsUrl(false),
    content: SubsCardFaqBlock,
  },
  HomeDelivery: {
    name: 'Home Delivery',
    href: paperSubsUrl(true),
    content: ContentDeliveryFaqBlock,
  },
};

type PropTypes = {|
  selectedTab: PaperFulfilmentOptions,
  setTabAction: (PaperFulfilmentOptions) => void,
|};

// ----- Component ----- //

function PaperTabs({ selectedTab, setTabAction }: PropTypes) {
  const tabItems = Object.keys(tabs).map((fulfilmentMethod) => {
    const TabContent = tabs[fulfilmentMethod].content;
    return {
      id: fulfilmentMethod,
      text: tabs[fulfilmentMethod].name,
      href: tabs[fulfilmentMethod].href,
      selected: fulfilmentMethod === selectedTab,
      content: <TabContent setTabAction={setTabAction} />,
    };
  });
  return (
    <Outset>
      <Tabs
        tabsLabel="Paper subscription options"
        tabElement="a"
        tabs={tabItems}
        onTabChange={(tabId) => {
          const newActiveTab = (tabId: PaperFulfilmentOptions);
          setTabAction(newActiveTab);
        }}
      />
    </Outset>
  );
}

// ----- Exports ----- //

export default PaperTabs;
