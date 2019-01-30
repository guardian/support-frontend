// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { onElementResize, type ElementResizer } from 'helpers/layout';
import SvgGuardianLogo from 'components/svgs/guardianLogo';

import { links } from '../links';
import VeggieBurgerButton from './veggieBurgerButton';

import './header.scss';

export type PropTypes = {|
  utility: Option<Node>,
  displayNavigation: boolean,
|};
export type State = {|
  fitsLinksInOneRow: boolean,
|};


// ----- Metrics ----- //

const willMenuFitInOneRow = ({ menuRef, logoRef, containerRef }) => {
  const [logoWidth, menuWidth, containerWidth] = [
    logoRef.getBoundingClientRect().left,
    menuRef.getBoundingClientRect().width,
    containerRef.getBoundingClientRect().left,
  ];
  return (
    logoWidth - containerWidth - menuWidth > 0
  );
};


// ----- Component ----- //

type TopNavPropTypes = {|
  utility: Option<Node>,
  getLogoRef: (?Element) => void
|};

const TopNav = ({ getLogoRef, utility }: TopNavPropTypes) => (
  <div className="component-header-topnav">
    <div className="component-header-topnav__utility">{utility}</div>
    <div className="component-header-topnav-logo" ref={getLogoRef}>
      <a className="component-header-topnav-logo__graun" href="https://www.theguardian.com">
        <div className="accessibility-hint">The Guardian logo</div>
        <SvgGuardianLogo />
      </a>
    </div>
  </div>
);

type BottomNavPropTypes = {|
  getMenuRef: (?Element) => void
|};

const BottomNav = ({ getMenuRef }: BottomNavPropTypes) =>
  (
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
    </nav>
  );

export default class Header extends Component<PropTypes, State> {
  static defaultProps = {
    utility: null,
    displayNavigation: false,
  };

  state = {
    fitsLinksInOneRow: false,
  };

  componentDidMount() {
    if (this.menuRef && this.logoRef && this.containerRef) {
      this.observer = onElementResize(
        [this.logoRef, this.menuRef, this.containerRef],
        ([logoRef, menuRef, containerRef]) => {
          this.setState({
            fitsLinksInOneRow: willMenuFitInOneRow({ menuRef, logoRef, containerRef }),
          });
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.stopListening();
    }
  }

  logoRef: ?Element;
  menuRef: ?Element;
  containerRef: ?Element;
  observer: ElementResizer;

  render() {
    const { utility, displayNavigation } = this.props;
    const { fitsLinksInOneRow } = this.state;

    return (
      <header
        className={
          classNameWithModifiers('component-header', [
            fitsLinksInOneRow ? 'one-row' : null,
            displayNavigation ? 'display-navigation' : null,
          ])
        }
      >
        <div className="component-header__wrapper" ref={(el) => { this.containerRef = el; }}>
          <div className="component-header__row">
            <TopNav utility={utility} getLogoRef={(el) => { this.logoRef = el; }} />
            {displayNavigation &&
              <VeggieBurgerButton />
            }
          </div>
          {displayNavigation &&
            <div className="component-header__row">
              <BottomNav getMenuRef={(el) => { this.menuRef = el; }} />
            </div>
          }
        </div>
      </header>
    );
  }
}
