// @flow

import { getQueryParameter } from 'helpers/url';

function inOfferPeriod(): boolean {
  // The offer is valid between 24th November & 3rd December 2017
  const now = Date.now();
  // Days are 1 based, months are 0 based - WHY??
  const startTime = new Date(2017, 10, 24, 0, 0).getTime();
  const endTime = new Date(2017, 11, 4, 0, 0).getTime();

  return (now > startTime && now < endTime) || getQueryParameter('black_friday') === 'true' || false;
}

const offerItem = { heading: 'Subscribe today and save 50% for your first three months' };
const saveMoneyOnRetailPrice = { heading: 'Save money on the retail price' };
const getAllBenefits = { heading: 'Get all the benefits of a digital subscription' };
const getAllBenefitsWithPaperPlus = { heading: 'Get all the benefits of a digital subscription with paper+digital' };
const chooseYourPackage = {
  heading: 'Choose your package and delivery method',
  text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
};

function getDigiPackItems() {
  const items = [
    {
      heading: 'Premium experience on the Guardian app',
      text: 'No adverts means faster loading pages and a clearer reading experience. Play our daily crosswords offline wherever you are',
    },
    {
      heading: 'Daily Tablet Edition app',
      text: 'Read the Guardian, the Observer and all the Weekend supplements in an optimised tablet app; available on iPad',
    },
  ];

  if (inOfferPeriod()) {
    return [offerItem, ...items];
  }
  return items;
}

function getPaperItems() {
  if (inOfferPeriod()) { return [offerItem, chooseYourPackage, getAllBenefitsWithPaperPlus]; }

  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefitsWithPaperPlus];
}

// In the stacked bundle, paper and paper+digital are in separate boxes.
// So in the paper only box, we don't mention the digital benefits.
// And in the paper+digital box, we do
function getPaperItemsForStackedBundle() {
  if (inOfferPeriod()) { return [offerItem, chooseYourPackage]; }

  return [chooseYourPackage, saveMoneyOnRetailPrice];
}

function getPaperDigitalItemsForStackedBundle() {
  if (inOfferPeriod()) { return [offerItem, chooseYourPackage, getAllBenefits]; }

  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefits];
}

export {
  inOfferPeriod,
  getDigiPackItems,
  getPaperItems,
  getPaperItemsForStackedBundle,
  getPaperDigitalItemsForStackedBundle,
};
