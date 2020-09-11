// @flow

const getGiftOrderSummaryText = (giftType: 'Annual' | 'Quarterly', price: string) => ({
  period: `${giftType === 'Annual' ? 12 : 3} month gift subscription`,
  cost: `You'll pay ${price} for 12 months`,
});


export { getGiftOrderSummaryText };
