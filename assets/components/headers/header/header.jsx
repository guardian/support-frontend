// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
import { onElementResize, type ElementResizer } from 'helpers/layout';
import SvgGuardianLogo from 'components/svgs/guardianLogo';


import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';

import './header.scss';

export type PropTypes = {|
  utility: Option<Node>,
  displayNavigation: boolean,
|};
export type State = {|
  fitsLinksInOneRow: boolean,
  fitsLinksAtAll: boolean,
|};


// ----- Metrics ----- //

const getMenuStateMetrics = ({ menuRef, logoRef, containerRef }): State => {
  const [logoLeft, menuWidth, containerLeft, containerWidth] = [
    logoRef.getBoundingClientRect().left,
    menuRef.getBoundingClientRect().width,
    containerRef.getBoundingClientRect().left,
    containerRef.getBoundingClientRect().width,
  ];
  console.log([containerWidth, menuWidth, containerWidth - menuWidth]);
  const fitsLinksAtAll = containerWidth - menuWidth > 0;
  const fitsLinksInOneRow = fitsLinksAtAll && (logoLeft - containerLeft - menuWidth > 0);
  return ({
    fitsLinksInOneRow,
    fitsLinksAtAll,
  });
};


// ----- Component ----- //

type TopNavPropTypes = {|
  utility: Node,
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

export default class Header extends Component<PropTypes, State> {
  static defaultProps = {
    utility: null,
    displayNavigation: true,
  };

  state = {
    fitsLinksInOneRow: false,
    fitsLinksAtAll: false,
  };

  componentDidMount() {
    if (this.props.displayNavigation && this.menuRef && this.logoRef && this.containerRef) {
      this.observer = onElementResize(
        [this.logoRef, this.menuRef, this.containerRef],
        ([logoRef, menuRef, containerRef]) => {
          this.setState(getMenuStateMetrics({ menuRef, logoRef, containerRef }));
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
    const { fitsLinksInOneRow, fitsLinksAtAll } = this.state;

    return (
      <header
        className={
          classNameWithModifiers('component-header', [
            fitsLinksInOneRow ? 'one-row' : null,
            displayNavigation ? 'display-navigation' : null,
            !fitsLinksAtAll ? 'display-veggie-burger' : null,
          ])
        }
      >
        <div className="component-header__wrapper" ref={(el) => { this.containerRef = el; }}>
          <div className="component-header__row">
            <TopNav
              utility={(displayNavigation && fitsLinksAtAll) ? utility : null}
              getLogoRef={(el) => { this.logoRef = el; }}
            />
            {displayNavigation &&
              <MobileMenuToggler utility={utility} />
            }
          </div>
          {displayNavigation &&
            <div className="component-header__row">
              <Links location="desktop" getRef={(el) => { this.menuRef = el; }} />
            </div>
          }
        </div>
      </header>
    );
  }
}
