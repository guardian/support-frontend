// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import { paperSubsUrl } from 'helpers/routes';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { type Option } from 'helpers/types/option';

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

type StatePropTypes = {|
  selectedTab: PaperFulfilmentOptions,
|};

type DispatchPropTypes = {|
  setTabAction: (PaperFulfilmentOptions) => TabActions,
|};

type PropTypes = {|
  ...StatePropTypes,
  ...DispatchPropTypes,
  useDigitalVoucher: Option<boolean>,
|};

// This is a temporary workaround while we have both iMovo and vouchers
// We can get rid of this when we drop vouchers
const getTabTitle = (useDigitalVoucher, fulfilmentMethod) => {
  if (fulfilmentMethod === 'HomeDelivery' || useDigitalVoucher) {
    return tabs[fulfilmentMethod].name;
  }
  return 'Voucher Booklet';
};

// ----- Component ----- //

function PaperTabs({ selectedTab, setTabAction, useDigitalVoucher }: PropTypes) {
  const tabItems = Object.keys(tabs).map((fulfilmentMethod) => {
    const TabContent = tabs[fulfilmentMethod].content;
    return {
      id: fulfilmentMethod,
      // The following line is a workaround for iMovo and vouchers
      // Once we drop vouchers, we can reinstate: name: tabs[fulfilmentMethod].name,
      text: getTabTitle(useDigitalVoucher, fulfilmentMethod),
      href: tabs[fulfilmentMethod].href,
      selected: fulfilmentMethod === selectedTab,
      content: <TabContent useDigitalVoucher={useDigitalVoucher} setTabAction={setTabAction} />,
    };
  });
  return (
    <Outset>
      <Tabs
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

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tab,
  useDigitalVoucher: state.common.settings.useDigitalVoucher,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PaperTabs);
