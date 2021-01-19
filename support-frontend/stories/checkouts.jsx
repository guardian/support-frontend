// @flow
// $FlowIgnore
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { FormSection } from 'components/checkoutForm/checkoutForm';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import DatePicker from 'components/datePicker/datePicker';

const stories = storiesOf('Checkouts', module);

stories.add('Checkout Expander', () => (
  <FormSection>
    <CheckoutExpander copy="Expand this">
      <p>For some additional information</p>
    </CheckoutExpander>
  </FormSection>
));


stories.add('Date Picker', () => {
  const baseDate = new Date();
  const [date, setDate] = useState(`${baseDate.getFullYear()}-${baseDate.getMonth() + 1}-${baseDate.getDate()}`);

  return (
    <FormSection>
      <DatePicker value={date} onChange={setDate} />
    </FormSection>
  );
});
