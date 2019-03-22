// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';
import { clickedEvent } from 'helpers/tracking/clickTracking';

import MobileMenu, { type Position } from '../mobileMenu/mobileMenu';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';

export default class MobileMenuToggler extends Component<{
  utility: Node,
  links: Node,
}, {
  menuOpen: boolean,
  buttonPosition: Position
}> {

  state = {
    buttonPosition: null,
    menuOpen: false,
  }

  buttonRef: ?Element;

  render() {
    const { menuOpen, buttonPosition } = this.state;
    const { utility, links } = this.props;
    return (
      <div className="component-header-mobile-menu-toggler">
        <VeggieBurgerButton
          getRef={(r) => { this.buttonRef = r; }}
          aria-haspopup="dialog"
          label="menu"
          onClick={() => {
            this.setState({ menuOpen: true });
            clickedEvent(['header', 'menu-open'].join(' - '));
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
          onStatusChange={(status) => {
            this.setState({ menuOpen: status });
            if (!status) {
              clickedEvent(['header', 'menu-dismiss'].join(' - '));
            }
          }}
        >
          <MobileMenu
            closeButtonAt={buttonPosition}
            utility={utility}
            links={links}
            onClose={() => {
              this.setState({ menuOpen: false });
              clickedEvent(['header', 'menu-close'].join(' - '));
            }}
          />
        </Dialog>
      </div>
    );
  }
}
