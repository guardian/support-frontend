// @flow

// ----- Imports ----- //

import React from 'react';

import countrySwitcherContainer from 'components/countryGroupSwitcher/countryGroupSwitcherContainer';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type SubscriptionProduct } from 'helpers/subscriptions';

import Header from './header';

// ------ Component ----- //

export default function ({
  path,
  countryGroupId,
  listOfCountries,
  trackProduct,
}: {
  path: string,
  countryGroupId?: CountryGroupId,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
}) {

  const Switcher = countrySwitcherContainer(path, listOfCountries, trackProduct);

  return () => <Header countryGroupId={countryGroupId} utility={<Switcher />} />;
}
