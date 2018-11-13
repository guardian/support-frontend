// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import { countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/page';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';
import type { PropTypes } from './countrySwitcherHeader';

// ------ Component ----- //

export default function (subPath: string, listOfCountries: CountryGroupId[], product: SubscriptionProduct) {

  function handleChange(cgId: CountryGroupId): void {
    sendTrackingEventsOnClick(`toggle_country_${cgId}`, product, null)();
    window.location.pathname = `/${countryGroups[cgId].supportInternationalisationId}${subPath}`;
  }

  function mapStateToProps(state: { common: CommonState }): PropTypes {

    return {
      countryGroupIds: listOfCountries,
      selectedCountryGroupId: state.common.internationalisation.countryGroupId,
      onCountryGroupSelect: handleChange,
    };
  }

  return connect(mapStateToProps)(CountrySwitcherHeader);

}
