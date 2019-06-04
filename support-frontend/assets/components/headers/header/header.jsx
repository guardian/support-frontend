// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { onElementResize, type ElementResizer } from 'helpers/layout';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import Padlock from './padlock.svg';


import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';

import './header.scss';

export type PropTypes = {|
  utility: Option<Node>,
  countryGroupId: ?CountryGroupId,
  display?: 'navigation' | 'checkout' | 'guardianLogo' | void,
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
  getLogoRef: (?Element) => void,
  display: 'navigation' | 'checkout' | 'guardianLogo' | void,
|};

const TopNav = ({ display, getLogoRef, utility }: TopNavPropTypes) => (
  <div className="component-header-topnav">
    <div className="component-header-topnav__utility">{utility}</div>
    {display === 'checkout' && (
      <div className="component-header-topnav__checkout">
        <div />
        <div className="component-header-topnav--checkout-text">
          <div className="component-header--padlock"><Padlock /></div>
          <div>Checkout</div>
        </div>
      </div>
    )}
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
    countryGroupId: null,
    display: 'navigation',
  };

  state = {
    fitsLinksInOneRow: false,
    fitsLinksAtAll: false,
  };

  componentDidMount() {
    if (this.props.display === 'navigation' && this.menuRef && this.logoRef && this.containerRef) {
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
    const { utility, display, countryGroupId } = this.props;
    const { fitsLinksInOneRow, fitsLinksAtAll } = this.state;

    return (
      <header
        className={
          classNameWithModifiers('component-header', [
            fitsLinksInOneRow ? 'one-row' : null,
            display === 'navigation' ? 'display-navigation' : null,
            !fitsLinksAtAll ? 'display-veggie-burger' : null,
            display === 'checkout' ? 'display-checkout' : null,
          ])
        }
      >
        <div className="component-header__wrapper" ref={(el) => { this.containerRef = el; }}>
          <div className="component-header__row">
            <TopNav
              display={display}
              utility={(display === 'navigation' && fitsLinksAtAll) ? utility : null}
              getLogoRef={(el) => { this.logoRef = el; }}
            />
            {display === 'navigation' &&
              <MobileMenuToggler
                links={<Links countryGroupId={countryGroupId} location="mobile" />}
                countryGroupId={countryGroupId}
                utility={utility}
              />
            }
          </div>
          {display === 'navigation' &&
            <div className="component-header__row">
              <Links countryGroupId={countryGroupId} location="desktop" getRef={(el) => { this.menuRef = el; }} />
            </div>
          }
          {display === 'checkout' &&
            <div className="component-header__row component-header-checkout--row">
              <div className="component-header--padlock"><Padlock /></div>
              <div>Checkout</div>
            </div>
          }
        </div>
      </header>
    );
  }
}
