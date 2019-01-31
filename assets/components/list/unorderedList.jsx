// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './list.scss';

// ---- Types ----- //

type PropTypes = {|
  items: (Node)[]
|};


// ----- Render ----- //

const UnorderedList = ({
  items,
}: PropTypes) => (
  <ul className="component-list-ul">
    {items.map(item => (
      <li className="component-list-ul__li">{item}</li>
    ))}
  </ul>
);

export default UnorderedList;
