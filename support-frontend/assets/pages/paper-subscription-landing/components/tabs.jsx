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
    name: 'Subscription Card',
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

function Tabs({ selectedTab, setTabAction }: PropTypes) {
  return (
    <Outset>
      <ProductPageTabs
        active={selectedTab}
        onChange={(t) => { setTabAction(Object.keys(tabs)[t]); }}
        tabs={Object.keys(tabs).map(fulfilmentMethod => ({
          // The following line is a workaround for iMovo and vouchers
          // Once we drop vouchers, we can reinstate: name: tabs[fulfilmentMethod].name,
        name: tabs[fulfilmentMethod].name,
        href: tabs[fulfilmentMethod].href,
      }))}
      />
    </Outset>
  );
}

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
