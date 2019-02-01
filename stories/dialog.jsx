// @flow

/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';

import Dialog from 'components/dialog/dialog';
import Button from 'components/button/button';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';
import { withCenterAlignment } from '../.storybook/decorators/withCenterAlignment';

// This is a barebones stateful wrapper - <Dialog/> needs to be controlled just like inputs
class ControlledDialogButton extends Component<{||}, {|open: boolean|}> {
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
          onStatusChange={(status) => { this.setState({ open: status }); }}
          open={this.state.open}
          styled
        >
          <div style={{ padding: '1em', background: '#121212', color: '#fff' }}>
            <ProductPageTextBlock title={'I\'m a dialog!'}>
              I don&#39;t do much on my own <span role="img" aria-label="sadface">☹️</span>.
            </ProductPageTextBlock>
            <Button
              icon={null}
              aria-label={null}
              onClick={() => { this.setState({ open: false }); }}
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

class ControlledPopDialogButton extends Component<{||}, {|open: boolean, pos: number[]|}> {
  state = {
    open: false,
    pos: [0, 0],
  }
  buttonRef: ?Element;
  render() {
    return (
      <div>
        <Button
          aria-haspopup="dialog"
          aria-label={null}
          appearance="greyHollow"
          icon={null}
          getRef={(r) => { this.buttonRef = r; }}
          onClick={() => {
            this.setState({ open: true });
            if (this.buttonRef) {
              const bounds = (this.buttonRef.getBoundingClientRect());
              this.setState({
                pos: [
                  bounds.left,
                  bounds.top,
                ],
              });
            }
          }}
        >
          Open dialog
        </Button>
        <Dialog
          aria-label="Modal dialog"
          onStatusChange={(status) => { this.setState({ open: status }); }}
          open={this.state.open}
          blocking={false} // this lets you click outside to close
          styled={false}
        >
          <div
            style={{
              top: this.state.pos[1],
              left: this.state.pos[0],
              position: 'absolute',
              background: '#fafafa',
              border: '1px solid #ddd',
              padding: '.5em',
              borderRadius: '1.25em',
            }}
          >
            <Button icon={null} aria-label={null} appearance="greyHollow">This could be a dropdown menu</Button><br />
            <Button icon={null} aria-label={null} appearance="greyHollow">Click outside to close</Button><br />
            <Button icon={null} aria-label={null} appearance="greyHollow">
              BUT! you still need a close button for keyboard + srd users even if its visibly hidden
            </Button><br />
            <Button
              icon={null}
              aria-label={null}
              appearance="greyHollow"
              onClick={() => { this.setState({ open: false }); }}
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

const stories = storiesOf('Dialogs', module)
  .addDecorator(withCenterAlignment);

stories.add('Styled dialog', () => (
  <div style={{ maxWidth: '30em' }}>
    <ProductPageTextBlock title="This is an styled dialog example">
      <p>
        It pops up in the middle of the screen
      </p>
      <ControlledDialogButton />
    </ProductPageTextBlock>
  </div>
));

stories.add('Unstyled dialog', () => (
  <div style={{ maxWidth: '30em' }}>
    <ProductPageTextBlock title="This is an unstyled dialog example">
      <p>
        You can make it look like anything.
      </p>
      <ControlledPopDialogButton />
    </ProductPageTextBlock>
  </div>
));
