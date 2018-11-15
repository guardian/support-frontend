// @flow

// ----- Imports ----- //

import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ---- Types ----- //

type Feature = {|
  title: string,
  copy?: ?string
|}

type PropTypes = {|
  features: Feature[],
  headingSize: HeadingSize,
|};


// ----- Render ----- //

const weeklyFeatureList = ({ features, headingSize }: PropTypes) => (
  <ul className="weekly-feature-list">
    {features.map(({ title, copy }) => (
      <li className="weekly-feature-list__item">
        <Heading className="weekly-feature-list__title" size={headingSize}>{title}</Heading>
        {copy && <p className="weekly-feature-list__copy" >{copy}</p>}
      </li>
    ))}
  </ul>
);

weeklyFeatureList.defaultProps = {
  headingSize: 3,
};

export default weeklyFeatureList;
