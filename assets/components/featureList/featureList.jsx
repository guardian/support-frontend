// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

export type ListItem =
    $Exact<{ heading: string, text: string }>
  | $Exact<{ heading: string }>
  | $Exact<{ text: string }>
  ;

type PropTypes = {
  listItems: ListItem[],
};


// ----- Component ----- //

export default function FeatureList(props: PropTypes) {

  const items = props.listItems.map((item: ListItem) => {

    const itemHeading = item.heading ? <h3>{ item.heading }</h3> : null;
    const itemText = item.text ? <p>{ item.text }</p> : null;

    return (
      <li>
        {itemHeading}
        {itemText}
      </li>
    );

  });

  return <ul className="component-feature-list">{ items }</ul>;

}
