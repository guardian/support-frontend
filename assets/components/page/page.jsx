// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  id: ?string,
  header: Node,
  footer: Node,
  children: Node,
  optChildren: ?Node
};


// ----- Component ----- //

export default function Page(props: PropTypes) {

  return (
    <div id={props.id} className="gu-content">
      {props.header}
      <main role="main" className="gu-content__main">
        {props.children}
      </main>
      {props.footer}
    </div>
  );

}


// ----- Default Props ----- //

Page.defaultProps = {
  id: null,
};
