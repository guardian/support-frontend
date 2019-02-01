// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';

import MobileHeader, { type Position } from '../mobileHeader/mobileHeader';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';

export default class MobileMenuToggler extends Component<{}, {menuOpen: boolean, buttonPosition: Position}> {

  state = {
    buttonPosition: null,
    menuOpen: false,
  }

  buttonRef: ?Element;

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="component-header-mobile-menu-toggler">
        <VeggieBurgerButton
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
        </VeggieBurgerButton>
        <Dialog
          aria-label="Menu"
          open={menuOpen}
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
