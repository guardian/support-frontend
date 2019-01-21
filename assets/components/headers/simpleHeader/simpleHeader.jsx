// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import SvgGuardianLogo from 'components/svgs/guardianLogo';

import './simpleHeader.scss';

export type PropTypes = {|
  utility: Option<Node>,
|};

const links = [
  {
    href: '/subscribe/digital',
    text: 'Subscriptions',
  },
  {
    href: '/subscribe/digital',
    text: 'Bananas',
  },
  {
    href: '/subscribe/digital',
    text: 'Donuts',
  },
  {
    href: '/subscribe/digital',
    text: 'Pretzels',
  },
  {
    href: '/subscribe/digital',
    text: 'Pears',
  },
  {
    href: '/subscribe/digital',
    text: 'Apples',
  },
];

// ----- Component ----- //

export default function SimpleHeader({ utility }: PropTypes) {

  return (
    <header className="component-simple-header">
      <div className="component-simple-header__content">
        <div className="component-simple-header__logo">
          <div className="component-simple-header__utility">{utility}</div>
          <a className="component-simple-header__link" href="https://www.theguardian.com">
            <div className="accessibility-hint">The Guardian logo</div>
            <SvgGuardianLogo />
          </a>
        </div>
        <nav className="component-simple-header-nav">
          <ul className="component-simple-header-nav__ul">
            {links.map(({ href, text }) => (
              <li className="component-simple-header-nav__li">
                <a className="component-simple-header-nav__link" href={href}>{text}</a>
              </li>
              ))}
          </ul>
        </nav>
      </div>
    </header>
  );

}
SimpleHeader.defaultProps = {
  utility: null,
};
