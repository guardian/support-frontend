// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';

import MobileHeader from '../mobileHeader/mobileHeader';


export default class VeggieBurgerButton extends Component<{}, {menuOpen: boolean}> {
  render() {
    const { menuOpen } = this.state;
    return (
      <div className="component-header-veggie">
        <button
          aria-haspopup="dialog"
          className="component-header-veggie__button"
          onClick={() => { this.setState({ menuOpen: true }); }}
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
          <MobileHeader onClose={() => { this.setState({ menuOpen: false }); }} />
        </Dialog>
      </div>
    );
  }
}
