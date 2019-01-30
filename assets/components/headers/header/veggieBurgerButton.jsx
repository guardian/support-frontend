// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import Dialog from 'components/dialog/dialog';

import MobileHeader from '../mobileHeader/mobileHeader';


export default class VeggieBurgerButton extends Component<{}, {menuOpen: boolean}> {
  render() {
    const { menuOpen } = this.state;
    return (
      <div className="component-header-veggie">
        <button
          className="component-header-veggie__button"
          onClick={() => { this.setState({ menuOpen: true }); }}
        >
            m
        </button>
        <Dialog
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
