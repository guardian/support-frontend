// @flow

import { getQueryParameter } from 'helpers/url';

function inOfferPeriod(): boolean {
  const now = Date.now();
  // Days are 1 based, months are 0 based
  // The offer is valid between 19th December 2017 & 3rd January 2018
  const startTime = new Date(2017, 11, 19, 0, 0).getTime();
  const endTime = new Date(2018, 0, 4, 0, 0).getTime();

  return (now > startTime && now < endTime) || getQueryParameter('flash_sale') === 'true' || false;
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
  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefitsWithPaperPlus];
}

// In the stacked bundle, paper and paper+digital are in separate boxes.
// So in the paper only box, we don't mention the digital benefits.
// And in the paper+digital box, we do
function getPaperItemsForStackedBundle() {
  return [chooseYourPackage, saveMoneyOnRetailPrice];
}

function getPaperDigitalItemsForStackedBundle() {
  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefits];
}

export {
  inOfferPeriod,
  getDigiPackItems,
  getPaperItems,
  getPaperItemsForStackedBundle,
  getPaperDigitalItemsForStackedBundle,
};
