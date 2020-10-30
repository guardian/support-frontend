// @flow

import React from 'react';
import { Outset } from 'components/content/content';
import Text from 'components/text/text';
import ProductPageFeatures
  from 'components/productPage/productPageFeatures/productPageFeatures';

function Benefits() {
  return (
    <section id="benefits">
      <Text title="As a subscriber you’ll enjoy" />
      <Outset>
        <ProductPageFeatures features={[
          { title: 'Every issue delivered with up to 35% off the cover price' },
          { title: 'Access to the magazine\'s digital archive' },
          { title: 'A weekly email newsletter from the editor' },
          { title: 'The very best of The Guardian\'s puzzles' },
        ]}
        />
      </Outset>
    </section>
  );
}

export default Benefits;
