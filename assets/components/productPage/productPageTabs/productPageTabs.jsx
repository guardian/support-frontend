// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';


// ---- Types ----- //
type Tab = {|
  name: string,
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
  <div role="tablist" className="component-product-page-tabs">
    {tabs.map(({ name }, index) => {
      const isActive = index === active;
      return (
        <button className={classNameWithModifiers('component-product-page-tabs__tab', isActive ? ['active'] : [])} role="tab" aria-selected={isActive} onClick={() => onChange(index)}>
          {name}
        </button>
      );
    })}
  </div>
);

export default ProductPageTabs;
