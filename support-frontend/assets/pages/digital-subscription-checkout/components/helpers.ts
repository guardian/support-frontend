import type { DigitalGiftBillingPeriod } from "helpers/productPrice/billingPeriods";
import { Annual } from "helpers/productPrice/billingPeriods";

const getGiftOrderSummaryText = (giftType: DigitalGiftBillingPeriod, price: string) => {
  const numberOfMonths = giftType === Annual ? 12 : 3;
  return {
    period: `${numberOfMonths} month gift subscription`,
    cost: `You'll pay ${price} for ${numberOfMonths} months`
  };
};

const daysFromNowForGift = 89;
export { getGiftOrderSummaryText, daysFromNowForGift };