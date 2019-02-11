// @flow

// ----- Imports ----- //

import React from 'react';

import countrySwitcherContainer from 'components/countryGroupSwitcher/countryGroupSwitcherContainer';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type SubscriptionProduct } from 'helpers/subscriptions';

import Header from './header';

// ------ Component ----- //

export default function (
  subPath: string,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
) {

  const Switcher = countrySwitcherContainer(subPath, listOfCountries, trackProduct);

  return () => <Header utility={<Switcher />} />;
}
