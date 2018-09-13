// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

export type ListItem =
  | {| heading: Node, text: string |}
  | {| heading: Node |}
  | {| text: string |};

type PropTypes = {
  modifierClass?: string,
  listItems: ListItem[],
};


// ----- Component ----- //

function FeatureList(props: PropTypes) {

  const items = props.listItems.map((item: ListItem) => (
    <div className="component-feature-list__item">
      <ItemHeading heading={item.heading ? item.heading : null} />
      <ItemText text={item.text ? item.text : null} />
    </div>
  ));

  return (
    <div className={classNameWithModifiers('component-feature-list', [props.modifierClass])}>
      { items }
    </div>
  );

}


// ----- Auxiliary Components ----- //

function ItemHeading(props: { heading: ?Node }) {

  if (props.heading) {
    return (
      <span className="component-feature-list__heading">
        <strong>{props.heading}</strong>
      </span>
    );
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
