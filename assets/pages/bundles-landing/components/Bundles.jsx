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
        infoText: 'Support the Guardian and enjoy a subscription to our digital Daily Edition and the premium tier of our app',
        ctaText: 'Become a digital subscriber',
        ctaLink: 'https://subscribe.theguardian.com/p/DXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
    },
};


// ----- Component ----- //

export default function Bundles() {

    return (
      <div className="bundles">
        <Bundle {...bundles.digital} />
      </div>
    );

}
