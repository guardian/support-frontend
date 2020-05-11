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
import { type Option } from 'helpers/types/option';

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

function Tabs({ selectedTab, setTabAction, useDigitalVoucher }: PropTypes) {
  return (
    <Outset>
      <ProductPageTabs
        active={selectedTab}
        onChange={(t) => { setTabAction(Object.keys(tabs)[t]); }}
        tabs={Object.keys(tabs).map(fulfilmentMethod => ({
          // The following line is a workaround for iMovo and vouchers
          // Once we drop vouchers, we can reinstate: name: tabs[fulfilmentMethod].name,
        name: getTabTitle(useDigitalVoucher, fulfilmentMethod),
        href: tabs[fulfilmentMethod].href,
      }))}
      />
    </Outset>
  );
}

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: Object.keys(tabs).indexOf(state.page.tab),
  useDigitalVoucher: state.common.settings.useDigitalVoucher,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
