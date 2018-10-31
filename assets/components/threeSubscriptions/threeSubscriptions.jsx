// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';


// ----- Types ----- //

type PropTypes = {|
  children: [React$Node, React$Node, React$Node],
  heading: string,
|};


// ----- Component ----- //

function ThreeSubscriptions(props: PropTypes) {

  return (
    <div className="component-three-subscriptions">
      <PageSection heading={props.heading} modifierClass="three-subscriptions">
        {props.children}
      </PageSection>
    </div>
  );

}


// ----- Default Props ----- //

ThreeSubscriptions.defaultProps = {
  heading: 'Subscribe',
};


// ----- Exports ----- //

export default ThreeSubscriptions;
