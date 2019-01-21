// @flow
import React from 'react';
import { links } from './links';
import './mobileHeader.scss';

export type PropTypes = {|
  onClose: () => void,
|};

const MobileHeader = ({ onClose }: PropTypes) => (
  <nav className="component-mobile-header">
    <div className="component-mobile-header-nav">
      <ul className="component-mobile-header-nav__ul">
        {links.map(({ href, text }) => (
          <li
            className="component-mobile-header-nav__li"
          >
            <a className="component-mobile-header-nav__link" href={href}>{text}</a>
          </li>
        ))}
      </ul>
      <button className="component-mobile-header-close" onClick={onClose} >Close</button>
    </div>
    <button aria-hidden className="component-mobile-header-bg" onClick={onClose} />
  </nav>
);

export default MobileHeader;
