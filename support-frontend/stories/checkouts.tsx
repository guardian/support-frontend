// @ts-ignore
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { FormSection } from "components/checkoutForm/checkoutForm";
import CheckoutExpander from "components/checkoutExpander/checkoutExpander";
import DatePicker from "components/datePicker/datePicker";
import OrderSummary from "components/orderSummary/orderSummary";
import OrderSummaryProduct from "components/orderSummary/orderSummaryProduct";
import GridImage from "components/gridImage/gridImage";
const stories = storiesOf('Checkouts', module);
stories.add('Checkout Expander', () => <FormSection>
    <CheckoutExpander copy="Expand this">
      <p>For some additional information</p>
    </CheckoutExpander>
  </FormSection>);
stories.add('Date Picker', () => {
  const baseDate = new Date();
  const [date, setDate] = useState(`${baseDate.getFullYear()}-${baseDate.getMonth() + 1}-${baseDate.getDate()}`);
  return <FormSection>
      <DatePicker value={date} onChange={setDate} />
    </FormSection>;
});
stories.add('Order Summary', () => {
  const productInfoPaper = [{
    content: 'You\'ll pay £57.99/month'
  }, {
    content: 'Your first payment will be on 04 February 2021',
    subText: 'Your subscription card will arrive in the post before the payment date'
  }];
  const productInfoDigiSub = [{
    content: 'You\'ll pay £5/month'
  }];
  const mobileSummary = {
    title: 'Sixday paper + Digital',
    price: 'You\'ll pay £62.99/month'
  };
  return <div style={{
    maxWidth: '470px',
    border: '1px solid #DCDCDC'
  }}>
      <OrderSummary image={<GridImage gridId="printCampaignHDdigitalVoucher" srcSizes={[500]} sizes="(max-width: 740px) 50vw, 696" imgType="png" altText="" />} changeSubscription="/" total="£62.99/month" mobileSummary={mobileSummary}>
        <OrderSummaryProduct productName="Sixday paper" productInfo={productInfoPaper} />
        <OrderSummaryProduct productName="Digital subscription" productInfo={productInfoDigiSub} />
      </OrderSummary>
    </div>;
});