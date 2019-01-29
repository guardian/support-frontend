// @flow

// ----- Imports ----- //

import React from 'react';

import { links } from '../links';

import './mobileHeader.scss';

export type PropTypes = {|
  onClose: () => void,
|};

// ----- Component ----- //


const MobileHeader = ({ onClose }: PropTypes) =>
  (
    <div
      className="component-mobile-header"
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
      <button className="component-mobile-header-nav__close" aria-label="close" onClick={onClose}>close</button>
    </div>
  );

export default MobileHeader;
