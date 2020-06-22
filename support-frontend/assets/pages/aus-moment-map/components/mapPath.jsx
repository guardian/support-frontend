// @flow
import React from 'react';

type PropTypes = {|
  d: string,
  territory: string,
  type: string
|};

export const MapPath = (props: PropTypes) => {
  const territory = (DOMEvent) => {
    const dataTerritory = DOMEvent.target.getAttribute('data-territory');
    return window.document.querySelectorAll(`[data-territory="${dataTerritory}"`);
  };

  const mouseEnter = (e) => {
    territory(e).forEach(t => t.classList.add('hover'));
  };

  const mouseLeave = (e) => {
    territory(e).forEach(t => t.classList.remove('hover'));
  };

  const click = (e) => {
    document.querySelectorAll('.selected').forEach(t => t.classList.remove('selected'));
    territory(e).forEach(t => t.classList.add('selected'));
  };

  return (
    <path
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      onClick={click}
      className={props.type}
      d={props.d}
      data-territory={props.territory}
    />
  );
};
