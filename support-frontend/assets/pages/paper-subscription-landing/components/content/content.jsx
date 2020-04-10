// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import { setTab, type TabActions } from '../../paperSubscriptionLandingPageActions';

import { type ContentPropTypes } from './helpers';
import DeliveryTab from './deliveryTab';
import SubscriptionCardTab from './subsCardTab';
import CollectionTab from './collectionTab';
import './content.scss';
import { Collection } from 'helpers/productPrice/fulfilmentOptions';

// TODO: update this to get value from window.guardian
const tabToUseForCollection = 'subscriptions';

// ----- Render ----- //
class Content extends Component<ContentPropTypes> {

  componentDidUpdate({ selectedTab }) {
    if (selectedTab !== this.props.selectedTab && this.tabRef) {
      // $FlowIgnore
      this.tabRef.focus({
        preventScroll: true,
      });
    }
  }

  tabRef: ?HTMLElement;

  render() {
    const { selectedTab, setTabAction } = this.props;

    if (selectedTab === Collection) {
      return tabToUseForCollection === 'voucher'
        ? <CollectionTab
          {...{ selectedTab, setTabAction }}
          getRef={(r) => { if (r) { this.tabRef = r; } }}
        />

        : <SubscriptionCardTab
          {...{ selectedTab, setTabAction }}
          getRef={(r) => { if (r) { this.tabRef = r; } }}
        />;
    }
    return (
      <DeliveryTab
        {...{ selectedTab, setTabAction }}
        getRef={(r) => { if (r) { this.tabRef = r; } }}
      />);
  }
}


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => ({
  selectedTab: state.page.tab,
});

const mapDispatchToProps = (dispatch: Dispatch<TabActions>) =>
  ({
    setTabAction: bindActionCreators(setTab, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Content);
