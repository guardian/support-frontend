// @flow

// ----- Imports ----- //

import React from 'react';


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
  <div role="tablist" aria-label="Entertainment">
    {tabs.map(({ name }, index) => (
      <button tabIndex={index === active ? null : -1} role="tab" onClick={() => onChange(index)} onFocus={() => onChange(index)}>
        {name} – {index === active}
      </button>
    ))}
  </div>
);

export default ProductPageTabs;
