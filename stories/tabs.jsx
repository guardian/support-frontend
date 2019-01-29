// @flow

import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text, radios } from '@storybook/addon-knobs';
import ProductPageTabs from 'components/productPage/productPageTabs/productPageTabs';

import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Tabs', module)
  .addDecorator(withCenterAlignment)
  .addDecorator(withKnobs);

class ControlledTabs extends Component {
  state = {
    active: 0,
  }

  render() {
    return (
      <ProductPageTabs
        active={this.state.active}
        onChange={(active) => { this.setState({ active }); }}
        tabs={
          this.props.tabs
        }
      />
    );
  }

}

stories.add('Tabs', () => (
  <ControlledTabs
    tabs={
    [{
        name: 'Voucher Booklet',
      }, {
        name: 'Home Delivery',
      },
    ]
  }
  />
));
