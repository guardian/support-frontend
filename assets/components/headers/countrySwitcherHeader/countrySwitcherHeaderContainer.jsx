// @flow

// ----- Imports ----- //

import React from 'react';

import countrySwitcherContainer from 'components/countryGroupSwitcher/countryGroupSwitcherContainer';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type SubscriptionProduct } from 'helpers/subscriptions';

// ------ Component ----- //

export default function (
  subPath: string,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
) {

  const Switcher = countrySwitcherContainer(subPath, listOfCountries, trackProduct);

  return () => <SimpleHeader utility={<Switcher />} />;
}
