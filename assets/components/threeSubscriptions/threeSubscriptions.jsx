// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';


// ----- Types ----- //

type PropTypes = {
  children: [React$Node, React$Node, React$Node],
};


// ----- Component ----- //

function ThreeSubscriptions(props: PropTypes) {

  return (
    <div className="component-three-subscriptions">
      <PageSection heading="Subscribe" modifierClass="three-subscriptions">
        {props.children}
      </PageSection>
    </div>
  );

}


// ----- Exports ----- //

export default ThreeSubscriptions;
