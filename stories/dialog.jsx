// @flow

import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';

import Dialog from 'components/dialog/dialog';
import Button from 'components/button/button';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

// This is a barebones stateful wrapper - <Dialog/> needs to be controlled just like inputs
class ControlledDialogButton extends Component<{modal: boolean}, {open: boolean}> {
  state = {
    open: false,
  }
  render() {
    return (
      <div>
        <Button
          aria-haspopup="dialog"
          aria-label={null}
          appearance="greyHollow"
          onClick={() => { this.setState({ open: true }); }}
        >Open it up
        </Button>
        <Dialog
          aria-label="Modal dialog"
          modal={this.props.modal}
          onStatusChange={(status) => { this.setState({ open: status }); }}
          open={this.state.open}
        >
          <div style={{ padding: '1em', background: '#121212', color: '#fff' }}>
            <ProductPageTextBlock title={'I\'m a dialog!'}>
              I don&#39;t do much on my own :(
            </ProductPageTextBlock>
            <Button
              icon={null}
              aria-label={null}
              appearance="primary"
              onClick={() => { this.setState({ open: false }); }}
            >Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

const stories = storiesOf('Dialogs', module)
  .addDecorator(withCenterAlignment);

stories.add('Modal dialog', () => (
  <ControlledDialogButton modal />
));

stories.add('Non-modal dialog', () => (
  <div>
    <ProductPageTextBlock title="This is a non-modal dialog example">
      <p>It opens up but lets you interact
        with the page under it while it is open
      </p>
      <p>You probably do not actually want this,
        as this dialog does not have the click outside behaviour
        and makes for a confusing experience for screen readers
      </p>
      <ControlledDialogButton modal={false} />
    </ProductPageTextBlock>
  </div>
));
