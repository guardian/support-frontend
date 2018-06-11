// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import Heading, { type HeadingRange } from 'components/heading/heading';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

export type ListItem =
  | {| heading: Node, text: string |}
  | {| heading: Node |}
  | {| text: string |};

/* eslint-enable react/no-unused-prop-types */

type PropTypes = {
  modifierClass?: string,
  listItems: ListItem[],
  headingSize: HeadingRange,
};


// ----- Component ----- //

function FeatureList(props: PropTypes) {

  const items = props.listItems.map((item: ListItem) => (
    <li className="component-feature-list__item">
      <ItemHeading heading={item.heading ? item.heading : null} size={props.headingSize} />
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

function ItemHeading(props: { heading: ?Node, size: HeadingRange }) {

  if (props.heading) {
    return (
      <Heading
        className="component-feature-list__heading"
        size={props.size}
      >
        {props.heading}
      </Heading>
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
