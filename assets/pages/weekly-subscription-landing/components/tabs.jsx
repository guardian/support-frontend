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
      <ProductPageTabs
        active={this.state.active}
        onChange={(t) => { this.onChange(t); }}
        tabs={[
        { name: 'Tab 1' },
        { name: 'Tab 2' },
      ]}
      />

    );
  }
}

export default Tabs;
