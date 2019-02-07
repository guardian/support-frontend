// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import './label.scss';
// ----- Types ----- //
export type PropsForHoc = {
  label: string,
}

type Props = PropsForHoc & {
  htmlFor: string,
  children: Node,
};

// ----- Component ----- //

function Label({ label, children, htmlFor }: Props) {
  return (
    <div>
      <label className="component-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </div>);

}


// ----- Exports ----- //

export { Label };
