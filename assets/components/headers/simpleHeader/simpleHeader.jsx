// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';
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


// ----- Observer ----- //

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

const getResizeObserver = () => (window.ResizeObserver ?
  window.ResizeObserver :
  function ResizeObserverPolyfill(onResize: () => void) {
    window.addEventListener('resize', onResize);
    onResize();
    this.disconnect = () => {
      window.removeEventListener('resize', onResize);
    };
  });


// ----- Component ----- //

const HeaderNavigation = ({ getMenuRef }: {getMenuRef: (?Element) => void}) => (
  <nav className="component-simple-header-nav">
    <ul className="component-simple-header-nav__ul" ref={getMenuRef}>
      {links.map(({ href, text }) => (
        <li
          className={
          classNameWithModifiers(
            'component-simple-header-nav__li',
            [window.location.href.endsWith(href) ? 'active' : null],
          )
        }
        >
          <a className="component-simple-header-nav__link" href={href}>{text}</a>
        </li>
    ))}
    </ul>
  </nav>
);

export default class SimpleHeader extends Component<PropTypes, State> {
  static defaultProps = {
    utility: null,
    displayNavigation: true,
  };

  state = {
    fitsLinksInOneRow: false,
  };

  componentDidMount() {

    this.observer = new (getResizeObserver())(() => {
      if (this.menuRef && this.logoRef && this.containerRef) {
        this.setState({
          fitsLinksInOneRow: willMenuFitInOneRow({
            menuRef: this.menuRef,
            logoRef: this.logoRef,
            containerRef: this.containerRef,
          }),
        });
      }
    });
    if (this.logoRef && this.menuRef && this.containerRef) {
      this.observer.observe(this.logoRef);
      this.observer.observe(this.menuRef);
      this.observer.observe(this.containerRef);
    }
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  logoRef: ?Element;
  menuRef: ?Element;
  containerRef: ?Element;
  observer: any;

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
        <div className="component-simple-header__content" ref={(el) => { this.containerRef = el; }}>
          <div className="component-simple-header-topnav">
            <div className="component-simple-header-topnav__utility">{utility}</div>
            <div className="component-simple-header-topnav-logo" ref={(el) => { this.logoRef = el; }}>
              <a className="component-simple-header-topnav-logo__graun" href="https://www.theguardian.com">
                <div className="accessibility-hint">The Guardian logo</div>
                <SvgGuardianLogo />
              </a>
            </div>
          </div>
          {displayNavigation &&
            <HeaderNavigation getMenuRef={(el) => { this.menuRef = el; }} />
          }
        </div>
      </header>
    );
  }
}
