// @flow

// ----- Imports ----- //

import React from 'react';

import Content from 'components/content/content';
import Text, { Title } from 'components/text/text';

// ----- Types ----- //

type PropTypes = {|
  children: [React$Node, React$Node, React$Node],
  heading: string,
|};


// ----- Component ----- //

function ThreeSubscriptions(props: PropTypes) {

  return (
    <Content modifierClasses={['three-subscriptions']}>
      <Text><Title size={2}>{props.heading}</Title></Text>
      <div className="component-three-subscriptions">
        {props.children}
      </div>
    </Content>

  );

}


// ----- Default Props ----- //

ThreeSubscriptions.defaultProps = {
  heading: 'Subscribe',
};


// ----- Exports ----- //

export default ThreeSubscriptions;
