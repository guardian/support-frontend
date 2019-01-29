// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';
import Dialog from 'components/dialog/dialog';

import MobileHeader from '../mobileHeader/mobileHeader';
import { links } from '../links';

import './header.scss';


// ----- Component ----- //

type PropTypes = {|
  getMenuRef: (?Element) => void
|};

export default class BottomNav extends Component<PropTypes, {menuOpen: boolean}> {

  render() {
    const { getMenuRef } = this.props;
    const { menuOpen } = this.state;
    return (
      <nav className="component-header-bottomnav">
        <ul className="component-header-bottomnav__ul" ref={getMenuRef}>
          {links.map(({ href, text }) => (
            <li
              className={
                classNameWithModifiers(
                  'component-header-bottomnav__li',
                  [window.location.href.endsWith(href) ? 'active' : null],
                )
              }
            >
              <a className="component-header-bottomnav__link" href={href}>{text}</a>
            </li>
      ))}
        </ul>
        <button
          className="component-header-bottomnav__veggie"
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
      </nav>
    );
  }
}
