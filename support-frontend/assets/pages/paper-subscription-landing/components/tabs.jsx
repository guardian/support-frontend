// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Outset } from 'components/content/content';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';
import { paperSubsUrl } from 'helpers/routes';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../paperSubscriptionLandingPageActions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

// ----- Tabs ----- //

export const tabs: {[PaperFulfilmentOptions]: {name: string, href: string}} = {
  Collection: {
    name: 'Voucher Booklet',
    href: paperSubsUrl(false),
  },
  HomeDelivery: {
    name: 'Home Delivery',
    href: paperSubsUrl(true),
  },
};

type StatePropTypes = {|
  selectedTab: number,
|};

type DispatchPropTypes = {|
  setTabAction: (PaperFulfilmentOptions) => TabActions,
|};

type PropTypes = {|
  ...StatePropTypes,
  ...DispatchPropTypes,
|};

// ----- Component ----- //

const Tabs = ({ selectedTab, setTabAction }: PropTypes) => (
  <Outset>
    <ProductPageTabs
      active={selectedTab}
      onChange={(t) => { setTabAction(Object.keys(tabs)[t]); }}
      tabs={Object.keys(tabs).map(k => ({
        name: tabs[k].name,
        href: tabs[k].href,
      }))}
    />
  </Outset>
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
