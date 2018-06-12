// @flow

// ----- Imports ----- //

import React from 'react';

// ----- Props ----- //

type PropTypes = {
  selectedCountryGroup: CountryGroupId,
};

// ----- Functions ----- //

const DigitalPackEmail = (
  <a className="component-customer-service__digital-pack-email" href="mailto:digitalpack@theguardian.com">
    digitalpack@theguardian.com
  </a>
);


function FAQBlock() {
  const faqLink = 'https://www.theguardian.com/subscriber-direct/subscription-frequently-asked-questions';
  return (
    <div>You may also find help in our
      <a className="component-customer-service__faq-href" href={faqLink}>
        Frequently Asked Questions
      </a>.
    </div>
  );
}

// ----- Component ----- //

function CustomerService(props: PropTypes) {
  switch (props.selectedCountryGroup) {
    case 'UnitedStates': return (
      <div className="component-customer-service">
        <div className="component-customer-service__text">
          For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
          call 1-844-632-2010 (toll free); 917-900-4663 (direct line).
          Lines are open 9:15am-6pm, Monday to Friday (EST/EDT).
          <FAQBlock />
        </div>
      </div>
    );
    case 'GBPCountries': return (
      <div className="component-customer-service">
        <div className="component-customer-service__text">
          For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
          call 0330 333 6767 (within UK). Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          <FAQBlock />
        </div>
      </div>
    );
    default: return (
      <div className="component-customer-service">
        <div className="component-customer-service__text">
          For help with Guardian and Observer subscription services please email <DigitalPackEmail /> or
          call +44 (0) 330 333 6767. Lines are open 8am-8pm on weekdays, 8am-6pm at weekends (GMT/BST).
          <FAQBlock />
        </div>
      </div>
    );
  }
}


// ----- Exports ----- //

export default CustomerService;
