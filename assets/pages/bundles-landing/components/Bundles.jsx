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
