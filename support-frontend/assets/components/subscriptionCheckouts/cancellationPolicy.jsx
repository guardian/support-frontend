// @flow

import React from 'react';
import { cancellationCopy } from 'components/subscriptionCheckouts/endSummary/endSummaryCopy';
import Text from 'components/text/text';

const CancellationPolicy = ({ orderIsAGift }: {orderIsAGift?: boolean}) => (
  <Text>
    {!orderIsAGift && (
      <p>
        <strong>{cancellationCopy.title}</strong> {cancellationCopy.body}
      </p>
      )}
  </Text>
);

CancellationPolicy.defaultProps = {
  orderIsAGift: false,
};

export default CancellationPolicy;
