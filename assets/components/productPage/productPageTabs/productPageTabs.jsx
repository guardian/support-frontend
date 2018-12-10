// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Option } from 'helpers/types/option';

import './productPageTabs.scss';


// ---- Types ----- //
type Tab = {|
  name: string,
  href?: Option<string>
|}

type PropTypes = {|
  tabs: Tab[],
  active: number,
  onChange: (id: number) => void
|};


// ----- Render ----- //

const ProductPageTabs = ({
  tabs, active, onChange,
}: PropTypes) => (
  <nav className="component-product-page-tabs">
    <ul className="component-product-page-tabs__ul">
      {tabs.map(({ name, href }, index) => {
        const isActive = index === active;
        return (
          <li className="component-product-page-tabs__li">
            {href ? (
              <a href={href} className={classNameWithModifiers('component-product-page-tabs__tab', isActive ? ['active'] : [])} onClick={(ev) => { ev.preventDefault(); onChange(index); }}>
                {name}
              </a>
            )
            :
            (
              <button className={classNameWithModifiers('component-product-page-tabs__tab', isActive ? ['active'] : [])} onClick={() => onChange(index)}>
                {name}
              </button>
            )
          }

          </li>
        );
      })}
    </ul>
  </nav>
);

export default ProductPageTabs;
