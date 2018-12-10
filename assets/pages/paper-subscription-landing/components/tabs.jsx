// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductPageContentBlockOutset from 'components/productPage/productPageContentBlock/productPageContentBlockOutset';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';
import { type PaperDeliveryMethod } from 'helpers/subscriptions';
import { paperSubsUrl } from 'helpers/routes';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';

// ----- Tabs ----- //

export const tabs: {[PaperDeliveryMethod]: {name: string, href: string}} = {
  collection: {
    name: 'Voucher Booklet',
    href: paperSubsUrl('collection'),
  },
  delivery: {
    name: 'Home Delivery',
    href: paperSubsUrl('delivery'),
  },
};

type StatePropTypes = {|
  selectedTab: number,
|};

type DispatchPropTypes = {|
  setTabAction: (PaperDeliveryMethod) => TabActions,
|};

type PropTypes = {|
  ...StatePropTypes,
  ...DispatchPropTypes,
|};

// ----- Component ----- //

const Tabs = ({ selectedTab, setTabAction }: PropTypes) => (
  <ProductPageContentBlockOutset>
    <ProductPageTabs
      active={selectedTab}
      onChange={(t) => { setTabAction(Object.keys(tabs)[t]); }}
      tabs={Object.keys(tabs).map(k => ({
        name: tabs[k].name,
        href: tabs[k].href,
      }))}
    />
  </ProductPageContentBlockOutset>
);

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: Object.keys(tabs).indexOf(state.page.tab),
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
