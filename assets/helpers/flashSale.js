// @flow

import { getQueryParameter } from 'helpers/url';
import type { SubscriptionProduct } from './subscriptions';


function inOfferPeriod(product: SubscriptionProduct): boolean {
  // Days are 1 based, months are 0 based
  const startTime = new Date(2018, 5, 18, 0, 0).getTime(); // 18th June 2018
  const endTime = new Date(2018, 6, 1, 0, 0).getTime(); // 1st July 2018

  // The current sale is digital only, everything else is unaffected
  const included = {
    DigitalPack: true,
    Paper: false,
    PaperAndDigital: false,
    DailyEdition: false,
    GuardianWeekly: false,
    PremiumTier: false,
  };

  const now = Date.now();
  return (now > startTime && now < endTime && included[product]) ||
    (included[product] && getQueryParameter('flash_sale') === 'true');
}

// Promo codes
const promoCodes = {
  DigitalPack: {
    promoCode: 'DPS80S',
    price: 11.99,
  },
  Paper: {
    promoCode: 'GST80F',
    price: 5.18,
  },
  PaperAndDigital: {
    promoCode: 'GST80G',
    price: 10.81,
  },
  DailyEdition: {
    promoCode: '',
    price: 6.99,
  },
  GuardianWeekly: {
    promoCode: '',
    price: 30,
  },
  PremiumTier: {
    promoCode: '',
    price: 5.99,
  },
};

function getPromoCode(product: SubscriptionProduct, defaultCode: string): string {
  if (inOfferPeriod(product)) {
    return promoCodes[product].promoCode;
  }
  return defaultCode;
}

function getDiscountedPrice(product: SubscriptionProduct, defaultPrice: number): number {
  if (inOfferPeriod(product)) {
    return promoCodes[product].price;
  }
  return defaultPrice;
}

// Copy text
const offerItem = { heading: 'Subscribe today and save an extra 50% for three months' };
const saveMoneyOnRetailPrice = { heading: 'Save money on the retail price' };
const getAllBenefits = { heading: 'Get all the benefits of a digital subscription with paper + digital' };
const chooseYourPackage = {
  heading: 'Choose your package and delivery method',
  text: 'Everyday, Sixday, Weekend, Saturday and Sunday; redeem paper vouchers or get home delivery',
};

function getDigitalBenefits() {
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

  if (inOfferPeriod('DigitalPack')) {
    return [offerItem, ...items];
  }
  return items;
}

function getPaperBenefits() {
  if (inOfferPeriod('Paper')) {
    return [offerItem, chooseYourPackage, saveMoneyOnRetailPrice];
  }
  return [chooseYourPackage, saveMoneyOnRetailPrice];
}

function getPaperDigitalBenefits() {
  if (inOfferPeriod('PaperAndDigital')) {
    return [offerItem, chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefits];
  }
  return [chooseYourPackage, saveMoneyOnRetailPrice, getAllBenefits];
}

export {
  getDigitalBenefits,
  getPaperBenefits,
  getPaperDigitalBenefits,
  getPromoCode,
  getDiscountedPrice,
};
