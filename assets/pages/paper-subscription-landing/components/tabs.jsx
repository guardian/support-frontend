// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import { outsetClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';

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
          tabs={[
            { name: 'Voucher' },
            { name: 'Home Delivery' },
          ]}
        />
      </div>
    );
  }
}

export default Tabs;
