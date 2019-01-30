// @flow

// ----- Imports ----- //

import React from 'react';

import { type Option } from 'helpers/types/option';

import { links } from '../links';

import './mobileHeader.scss';

export type PropTypes = {|
  onClose: () => void,
  closeButtonAt?: Option<{x: number, y: number}>,
|};

// ----- Component ----- //


const MobileHeader = ({ onClose, closeButtonAt }: PropTypes) =>
  (
    <div
      className="component-mobile-header"
      style={closeButtonAt && { width: closeButtonAt.x }}
    >
      <nav className="component-mobile-header-nav">
        <ul className="component-mobile-header-nav__ul" >
          {links.map(({ href, text }) => (
            <li
              className="component-mobile-header-nav__li"
            >
              <a className="component-mobile-header-nav__link" href={href}>{text}</a>
            </li>
    ))}
        </ul>
      </nav>
      <button
        style={closeButtonAt && { top: closeButtonAt.y }}
        className="component-mobile-header-nav__close"
        aria-label="close"
        onClick={onClose}
      >close
      </button>
    </div>
  );

MobileHeader.defaultProps = {
  closeButtonAt: null,
};

export default MobileHeader;
