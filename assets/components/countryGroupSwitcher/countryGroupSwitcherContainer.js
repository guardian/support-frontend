// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import { countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/commonReducer';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

import CountryGroupSwitcher, { type PropTypes } from './countryGroupSwitcher';


// ------ Component ----- //

export default function (
  subPath: string,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
) {

  function handleChange(cgId: CountryGroupId): void {
    if (trackProduct) {
      sendTrackingEventsOnClick(`toggle_country_${cgId}`, trackProduct, null)();
    }
    window.location.pathname = `/${countryGroups[cgId].supportInternationalisationId}${subPath}`;
  }

  function mapStateToProps(state: { common: CommonState }): PropTypes {

    return {
      countryGroupIds: listOfCountries,
      selectedCountryGroup: state.common.internationalisation.countryGroupId,
      onCountryGroupSelect: handleChange,
    };
  }

  return connect(mapStateToProps)(CountryGroupSwitcher);

}
