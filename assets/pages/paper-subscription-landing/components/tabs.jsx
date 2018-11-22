// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import { outsetClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';


// ----- Tabs ----- //

export const tabs: {[string]: {name: string}} = {
  collection: {
    name: 'Voucher',
  },
  delivery: {
    name: 'Home Delivery',
  },
};

export type Tab = $Keys<typeof tabs>;

// ----- Component ----- //

class Tabs extends Component<any, any> {
  state = {
    active: 0,
  }
  onChange(active: any) {
    this.setState({ active });
  }
  render() {
    return (
      <div className={outsetClassName}>
        <ProductPageTabs
          active={this.state.active}
          onChange={(t) => { this.onChange(t); }}
          tabs={Object.keys(tabs).map(tab => ({ name: tabs[tab].name }))}
        />
      </div>
    );
  }
}

export default Tabs;
