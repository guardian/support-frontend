// @flow

import React from 'react';
import { List } from 'components/list/list';
import BenefitsContainer from './benefitsContainer';
import BenefitsHeading from './benefitsHeading';

function Benefits() {
  return (
    <BenefitsContainer
      sections={[
        {
          id: 'benefits',
          content: (
            <>
              <BenefitsHeading text="As a subscriber you’ll enjoy" />
              <List items={[
                { explainer: 'Every issue delivered with up to 35% off the cover price' },
                { explainer: 'Access to the magazine\'s digital archive' },
                { explainer: 'A weekly email newsletter from the editor' },
                { explainer: 'The very best of The Guardian\'s puzzles' },
              ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

export default Benefits;
