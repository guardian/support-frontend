// @flow

// ----- Imports ----- //

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackComponentEvents } from './tracking/ophanComponentEventTracking';
import { gaEvent } from './tracking/googleTagManager';


// ----- Config ----- //

const digitalSubPrices: {
  [CountryGroupId]: number,
} = {
  GBPCountries: 11.99,
  UnitedStates: 19.99,
  AUDCountries: 21.50,
  International: 19.99,
};


function sendTrackingEventsOnClick(
  id: string,
  product: 'digital' | 'print',
  abTest: string,
  variant: boolean,
): () => void {

  return () => {

    trackComponentEvents({
      component: {
        componentType: 'ACQUISITIONS_BUTTON',
        id,
        products: product === 'digital' ? ['DIGITAL_SUBSCRIPTION'] : ['PRINT_SUBSCRIPTION'],
      },
      action: 'CLICK',
      id: `${abTest}${id}`,
      abTest: {
        name: `${abTest}`,
        variant: variant ? 'variant' : 'control',
      },
    });

    gaEvent({
      category: 'click',
      action: `${abTest}`,
      label: id,
    });

  };

}

// ----- Exports ----- //

export { digitalSubPrices, sendTrackingEventsOnClick };
