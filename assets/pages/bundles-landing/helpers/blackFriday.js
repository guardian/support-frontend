// import { getQueryParameter } from '../../../helpers/url';

function inOfferPeriod() {
  // The offer is valid between 24th November & 3rd December 2017
  const now = new Date().getTime();
  const startTime = new Date(2017, 11, 24, 0, 0).getTime();
  const endTime = new Date(2017, 12, 4, 0, 0).getTime();

  return (now > startTime && now < endTime) || true; // getQueryParameter('black_friday', false);
}

const offerItem = { heading: 'Subscribe today and save 50% for your first three months' };

function getDigiPackItems() {
  const originalList = [
    {
      heading: 'Premium experience on the Guardian app',
      text: 'No adverts means faster loading pages and a clearer reading experience. Play our daily crosswords offline wherever you are',
    },
    {
      heading: 'Daily Tablet Edition app',
      text: 'Read the Guardian, the Observer and all the Weekend supplements in an optimised tablet app; available on iPad, Android and Kindle Fire tablets',
    },
  ];

  if (inOfferPeriod()) {
    return [offerItem, ...originalList];
  }
  return originalList;
}

function getPaperItems() {
  const items = [
    {
      heading: 'Choose your package and delivery method',
      text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
    },
    {
      heading: 'Get all the benefits of a digital subscription with paper+digital',
    },
  ];

  if (inOfferPeriod()) { return [offerItem, ...items]; }

  return [items[0], { heading: 'Save money on the retail price' }, items[1]];
}

export {
  inOfferPeriod,
  getDigiPackItems,
  getPaperItems,
};
