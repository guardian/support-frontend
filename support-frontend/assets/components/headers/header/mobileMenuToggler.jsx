// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';
import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';
import MobileMenu, { type Position } from '../mobileMenu/mobileMenu';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

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
            sendTrackingEventsOnClick({
              id: 'open_mobile_menu',
              componentType: 'ACQUISITIONS_BUTTON',
            })();
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
              sendTrackingEventsOnClick({
                id: 'dismiss_mobile_menu',
                componentType: 'ACQUISITIONS_BUTTON',
              })();
            }
          }}
        >
          <MobileMenu
            closeButtonAt={buttonPosition}
            utility={utility}
            links={links}
            onClose={() => {
              this.setState({ menuOpen: false });
              sendTrackingEventsOnClick({
                id: 'close_mobile_menu',
                componentType: 'ACQUISITIONS_BUTTON',
              })();
            }}
          />
        </Dialog>
      </div>
    );
  }
}
