// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { onElementResize, type ElementResizer } from 'helpers/layout';
import SvgGuardianLogo from 'components/svgs/guardianLogo';

import { links } from './links';

import './simpleHeader.scss';

export type PropTypes = {|
  utility: Option<Node>,
  displayNavigation: boolean,
|};
export type State = {|
  fitsLinksInOneRow: boolean,
|};



const willMenuFitInOneRow = ({ menuRef, logoRef, containerRef }) => {
  const [logoWidth, menuWidth, containerWidth] = [
    logoRef.getBoundingClientRect().width,
    menuRef.getBoundingClientRect().width,
    containerRef.getBoundingClientRect().width,
  ];
  return (
    containerWidth - logoWidth - menuWidth > 0
  );
};


// ----- Component ----- //

type HeaderTopNavigationPropTypes = {|
  utility: Option<Node>,
  getLogoRef: (?Element) => void
|};

const HeaderTopNavigation = ({ getLogoRef, utility }: HeaderTopNavigationPropTypes) => (
  <div className="component-simple-header-topnav">
    <div className="component-simple-header-topnav__utility">{utility}</div>
    <div className="component-simple-header-topnav-logo" ref={getLogoRef}>
      <a className="component-simple-header-topnav-logo__graun" href="https://www.theguardian.com">
        <div className="accessibility-hint">The Guardian logo</div>
        <SvgGuardianLogo />
      </a>
    </div>
  </div>
);

type HeaderBottomNavigationPropTypes = {|
  getMenuRef: (?Element) => void
|};

const HeaderBottomNavigation = ({ getMenuRef }: HeaderBottomNavigationPropTypes) => (
  <nav className="component-simple-header-bottomnav">
    <ul className="component-simple-header-bottomnav__ul" ref={getMenuRef}>
      {links.map(({ href, text }) => (
        <li
          className={
          classNameWithModifiers(
            'component-simple-header-bottomnav__li',
            [window.location.href.endsWith(href) ? 'active' : null],
          )
        }
        >
          <a className="component-simple-header-bottomnav__link" href={href}>{text}</a>
        </li>
    ))}
    </ul>
  </nav>
);

export default class SimpleHeader extends Component<PropTypes, State> {
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
    this.observer.stopListening();
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
          classNameWithModifiers('component-simple-header', [
            fitsLinksInOneRow ? 'one-row' : null,
            displayNavigation ? 'display-navigation' : null,
          ])
        }
      >
        <div className="component-simple-header__wrapper" ref={(el) => { this.containerRef = el; }}>
          <HeaderTopNavigation utility={utility} getLogoRef={(el) => { this.logoRef = el; }} />
          {displayNavigation &&
            <HeaderBottomNavigation getMenuRef={(el) => { this.menuRef = el; }} />
          }
        </div>
      </header>
    );
  }
}
