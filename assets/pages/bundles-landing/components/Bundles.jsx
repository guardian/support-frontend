// ----- Imports ----- //

import React from 'react';

import Bundle from './Bundle';


// ----- Copy ----- //

const bundles = {
  digital: {
    heading: '£11.99/month',
    subheading: 'Become a digital subscriber',
    listItems: [
      {
        heading: 'Ad-free mobile app',
        text: 'Faster pages and a clearer reading experience',
      },
      {
        heading: 'Daily tablet edition',
        text: 'Daily newspaper optimised for tablet; available on Apple, Android and Kindle Fire',
      },
      {
        heading: 'Free trial',
        text: 'For 14 days, enjoy on up to 10 devices',
      },
    ],
    infoText: 'Support the Guardian and enjoy a subscription to our digital Daily Edition and the premium tier of our app.',
    ctaText: 'Become a digital subscriber',
    ctaLink: 'https://subscribe.theguardian.com/p/DXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
    modifierClass: 'digital',
  },
  paper: {
    heading: 'From £10.79/month',
    subheading: 'Become a paper subscriber',
    listItems: [
      {
        heading: 'Newspaper',
        text: 'Choose the package you want: Everyday+, Sixday+, Weekend+ and Sunday+',
      },
      {
        heading: 'Digital',
        text: 'All the benefits of the digital subscription',
      },
      {
        heading: 'Save money',
        text: 'Up to 36% off the retail price',
      },
    ],
    infoText: 'Support the Guardian and enjoy a subscription to the Guardian and the Observer newspapers.',
    ctaText: 'Become a paper subscriber',
    ctaLink: 'https://subscribe.theguardian.com/p/GXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
    modifierClass: 'paper',
  },
};


// ----- Component ----- //

export default function Bundles() {

  return (
    <div className="bundles">
      <Bundle {...bundles.digital} />
      <Bundle {...bundles.paper} />
    </div>
  );

}
