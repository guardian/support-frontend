// @flow

import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';

import Dialog from 'components/dialog/dialog';
import Button from 'components/button/button';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

const stories = storiesOf('Dialogs', module)
  .addDecorator(withCenterAlignment);

class ControlledDialogButton extends Component<{modal: boolean}, {open: boolean}> {
  state = {
    open: false,
  }
  render() {
    return (
      <div>
        <Button aria-label={null} appearance="greyHollow" onClick={() => { this.setState({ open: true }); }}>Open it up</Button>
        <Dialog
          modal={this.props.modal}
          onStatusChange={(status) => { this.setState({ open: status }); }}
          open={this.state.open}
        >
          <div style={{ padding: '1em', background: '#fff' }}>
            <ProductPageTextBlock title="im a dialog!">
              i dont do much on my own :(
            </ProductPageTextBlock>
            <Button aria-label={null} appearance="primary" onClick={() => { this.setState({ open: false }); }}>Close</Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

stories.add('Modal dialog', () => (
  <ControlledDialogButton modal />
));

stories.add('Non-modal dialog', () => (
  <ControlledDialogButton modal={false} />
));
