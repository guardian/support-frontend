// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import Text from 'components/text/text';

export default function CancellationSection() {
  return (
    <FormSection>
      <Text>
        <p>
          <strong>Cancel any time you want.</strong>
          There is no set time on your agreement so you can stop
          your subscription anytime
        </p>
      </Text>
    </FormSection>);
}
