// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { classNameWithModifiers } from 'helpers/utilities';


// ---- Types ----- //

type PropTypes = {|
  type: 'white' | 'grey' | 'feature' | 'dark',
  children: Node
|};


// ----- Render ----- //

const WeeklyContentBlock = ({ type, children }: PropTypes) => (
  <div className={classNameWithModifiers('component-weekly-content-block', [type])}>
    <LeftMarginSection>
      <div className="component-weekly-content-block__content">
        {children}
      </div>
    </LeftMarginSection>
  </div>
);

WeeklyContentBlock.defaultProps = {
  type: 'white',
};

export default WeeklyContentBlock;
