// @flow

// ----- Imports ----- //

import React from 'react';

import { type Option } from 'helpers/types/option';
import SvgClose from 'components/svgs/close';

import { links } from '../links';
import VeggieButton from '../veggieButton/veggieButton';

import './mobileHeader.scss';

export type Position = Option<{x: number, y: number}>;

export type PropTypes = {|
  onClose: () => void,
  closeButtonAt?: Position,
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
      <VeggieButton
        style={closeButtonAt && { top: closeButtonAt.y }}
        label="close"
        onClick={onClose}
      >
        <SvgClose />
      </VeggieButton>
    </div>
  );

MobileHeader.defaultProps = {
  closeButtonAt: null,
};

export default MobileHeader;
