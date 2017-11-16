// @flow

// ----- Imports ----- //

import type { ListItem } from 'components/featureList/featureList';
import type { SubsProduct } from '../../helpers/externalLinks';


// ----- Features ----- //

const features: {
  [SubsProduct]: ListItem[],
} = {
  digital: [
    {
      heading: 'Premium experience on the Guardian app',
      text: `No adverts means faster loading pages and a clearer reading experience.
        Play our daily crosswords offline wherever you are`,
    },
    {
      heading: 'Daily Tablet Edition app',
      text: `Read the Guardian, the Observer and all the Weekend supplements in an
        optimised tablet app; available on iPad, Android and Kindle Fire tablets`,
    },
  ],
  paper: [
    {
      heading: 'Choose your package and delivery method',
      text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
    },
    {
      heading: 'Save money on the retail price',
    },
  ],
  paperDig: [
    {
      heading: 'Choose your package and delivery method',
      text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
    },
    {
      heading: 'Save money on the retail price',
    },
    {
      heading: 'Get all the benefits of a digital subscription with paper + digital',
    },
  ],
};


// ----- Exports ----- //

export {
  features,
};
