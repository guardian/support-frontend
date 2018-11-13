import React from 'react';
import SubscribeCta from 'components/subscribeCta/subscribeCta';
import ContributeCta from 'components/contributeCta/ContributeCta';

import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';

type PropTypes = {|
  id: ?string | null,
|};


export default function WaysToSupport(props: PropTypes) {
  return (
    <div id={props.id}>
      <ProductPageTextBlock title="Ways to support">
        <SubscribeCta />
        <ContributeCta />
      </ProductPageTextBlock>
    </div>
  );
}
