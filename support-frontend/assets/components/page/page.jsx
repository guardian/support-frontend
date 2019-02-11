// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import TimeTravelBanner from 'components/headerBanners/timeTravelBanner';


// ----- Types ----- //

type PropTypes = {|
  id: ?string,
  header: Node,
  footer: Node,
  children: Node,
  classModifiers: Array<?string>
|};


// ----- Component ----- //

export default function Page(props: PropTypes) {

  return (
    <div id={props.id} className={classNameWithModifiers('gu-content', props.classModifiers)}>
      <TimeTravelBanner />
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
  classModifiers: [],
};
