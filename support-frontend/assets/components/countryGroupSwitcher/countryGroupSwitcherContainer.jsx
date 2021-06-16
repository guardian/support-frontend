// @flow

// ----- Imports ----- //
import React from 'react';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/productPrice/subscriptions';

import CountryGroupSwitcher from './countryGroupSwitcher';


// ------ Component ----- //

export default function (
  subPath: string,
  countryGroupId: CountryGroupId,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
) {

  function onCountryGroupSelect(cgId: CountryGroupId): void {
    sendTrackingEventsOnClick({
      id: `toggle_country_${cgId}`,
      ...(trackProduct ? { product: trackProduct } : {}),
      componentType: 'ACQUISITIONS_OTHER',
    })();
  }

  return () => (
    <CountryGroupSwitcher
      countryGroupIds={listOfCountries}
      selectedCountryGroup={countryGroupId}
      subPath={subPath}
      onCountryGroupSelect={onCountryGroupSelect}
    />
  );
}
