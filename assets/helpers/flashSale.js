// @flow

import { getQueryParameter } from 'helpers/url';

type ProductType = 'digital' | 'paper' | 'paperAndDigital';

function inOfferPeriod(product: ProductType): boolean {
  // Days are 1 based, months are 0 based
  const startTime = new Date(2018, 0, 29, 0, 0).getTime(); // 29th Jan 2018
  const endTime = new Date(2018, 1, 25, 0, 0).getTime(); // 25th Feb 2018

  // The current sale is paper & paper + digital only, digital is unaffected
  const included = {
    digital: false,
    paper: true,
    paperAndDigital: true,
  };

  const now = Date.now();
  return (now > startTime && now < endTime && included[product]) ||
    (included[product] && getQueryParameter('flash_sale') === 'true');
}

// Promo codes
const promoCodes = {
  digital: 'p/DXX83X',
  paper: 'p/GRB80P',
  paperAndDigital: 'p/GRB80X',
};

function getPromoCode(product: ProductType, defaultCode: string) {
  if (inOfferPeriod(product)) {
    return promoCodes[product];
  }
  return defaultCode;
}

// Copy text
const offerItem = { heading: 'Subscribe today and save 50% for your first three months' };
const saveMoneyOnRetailPrice = { heading: 'Save money on the retail price' };
const getAllBenefits = { heading: 'Get all the benefits of a digital subscription' };
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

  if (inOfferPeriod('digital')) {
    return [offerItem, ...items];
  }
  return items;
}

function getPaperItems() {
  if (inOfferPeriod('paper')) {
    return [offerItem, chooseYourPackage];
  }
  return [chooseYourPackage, saveMoneyOnRetailPrice];
}

function getPaperDigitalItems() {
  if (inOfferPeriod('paperAndDigital')) {
    return [offerItem, chooseYourPackage, getAllBenefits];
  }
  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefits];
}

export {
  getDigiPackItems,
  getPaperItems,
  getPaperDigitalItems,
  getPromoCode,
};
