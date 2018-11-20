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
    {tabs.map(({ name }, index) => (
      <button className={classNameWithModifiers('component-product-page-tabs__tab', index === active ? ['active'] : [])} role="tab" onClick={() => onChange(index)}>
        {name} – {(index === active).toString()}
      </button>
    ))}
  </div>
);

export default ProductPageTabs;
