// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';

import MobileHeader, { type Position } from '../mobileHeader/mobileHeader';


export default class VeggieBurgerButton extends Component<{}, {menuOpen: boolean, buttonPosition: Position}> {

  state = {
    buttonPosition: null,
    menuOpen: false,
  }

  buttonRef: ?Element;

  render() {
    const { menuOpen } = this.state;
    return (
      <div className="component-header-veggie">
        <button
          ref={(r) => { this.buttonRef = r; }}
          aria-haspopup="dialog"
          className="component-header-veggie__button"
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
          <span className="accessibility-hint">Menu</span>
          <SvgMenu />
        </button>
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
