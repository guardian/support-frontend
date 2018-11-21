// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';

class Tabs extends Component<any, any> {
  state = {
    active: 1,
  }
  onChange(active: any) {
    this.setState({ active });
  }
  render() {
    return (
      <div style={{ marginLeft: -11 }}>
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
