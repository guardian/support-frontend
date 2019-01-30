// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';

import MobileHeader, { type Position } from '../mobileHeader/mobileHeader';
import VeggieButton from '../veggieButton/veggieButton';

export default class MobileMenuButton extends Component<{}, {menuOpen: boolean, buttonPosition: Position}> {

  state = {
    buttonPosition: null,
    menuOpen: false,
  }

  buttonRef: ?Element;

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="component-header-mobile-menu">
        <VeggieButton
          getRef={(r) => { this.buttonRef = r; }}
          aria-haspopup="dialog"
          label="menu"
          onClick={() => {
            this.setState({ menuOpen: true });
            if (this.buttonRef) {
              const bounds = (this.buttonRef.getBoundingClientRect());
              this.setState({
                buttonPosition: {
                  x: bounds.left + (bounds.width / 2),
                  y: bounds.top,
                },
              });
            }
          }}
        >
          <SvgMenu />
        </VeggieButton>
        <Dialog
          aria-label="Menu"
          open={menuOpen}
          modal
          dismissOnBackgroundClick
          onStatusChange={(status) => { this.setState({ menuOpen: status }); }}
        >
          <MobileHeader
            closeButtonAt={this.state.buttonPosition}
            onClose={() => { this.setState({ menuOpen: false }); }}
          />
        </Dialog>
      </div>
    );
  }
}
