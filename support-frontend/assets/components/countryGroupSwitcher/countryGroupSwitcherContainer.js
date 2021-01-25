// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CommonState } from 'helpers/page/commonReducer';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/subscriptions';

import CountryGroupSwitcher, { type PropTypes } from './countryGroupSwitcher';


// ------ Component ----- //

export default function (
  subPath: string,
  listOfCountries: CountryGroupId[],
  trackProduct?: Option<SubscriptionProduct>,
) {

  function onCountryGroupSelect(cgId: CountryGroupId): void {
    if (trackProduct) {
      sendTrackingEventsOnClick({
        id: `toggle_country_${cgId}`,
        product: trackProduct,
        componentType: 'ACQUISITIONS_BUTTON',
      })();
    }
  }

  function mapStateToProps(state: { common: CommonState }): PropTypes {

    return {
      countryGroupIds: listOfCountries,
      selectedCountryGroup: state.common.internationalisation.countryGroupId,
      subPath,
      onCountryGroupSelect,
    };
  }

  return connect(mapStateToProps)(CountryGroupSwitcher);

}
