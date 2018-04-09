// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

export type ListItem =
  | {| heading: string, text: string |}
  | {| heading: string |}
  | {| text: string |};

/* eslint-enable react/no-unused-prop-types */

type PropTypes = {
  modifierClass?: string,
  listItems: ListItem[],
};


// ----- Component ----- //

function FeatureList(props: PropTypes) {

  const items = props.listItems.map((item: ListItem) => (
    <li className="component-feature-list__item">
      <ItemHeading heading={item.heading ? item.heading : null} />
      <ItemText text={item.text ? item.text : null} />
    </li>
  ));

  return (
    <ul className={classNameWithModifiers('component-feature-list', [props.modifierClass])}>
      { items }
    </ul>
  );

}


// ----- Auxiliary Components ----- //

function ItemHeading(props: { heading: ?string }) {

  if (props.heading) {
    return <h3 className="component-feature-list__heading">{props.heading}</h3>;
  }

  return null;

}

function ItemText(props: { text: ?string }) {

  if (props.text) {
    return <p className="component-feature-list__text">{props.text}</p>;
  }

  return null;

}


// ----- Default Props ----- //

FeatureList.defaultProps = {
  modifierClass: '',
};


// ----- Exports ----- //

export default FeatureList;
