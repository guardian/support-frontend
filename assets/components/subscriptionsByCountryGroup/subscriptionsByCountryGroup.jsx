// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import InternationalSubscriptions from 'components/internationalSubscriptions/internationalSubscriptionsContainer';
import { type HeadingSize } from 'components/heading/heading';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CommonState } from 'helpers/page/page';


// ----- Types and State Mapping ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  headingSize: HeadingSize,
};


function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  const { countryGroupId, headingSize, ...otherProps } = props;

  if (countryGroupId === 'GBPCountries') {
    return (
      <div {...otherProps}>
        <DigitalSubscriptionsContainer
          headingSize={headingSize}
        />
        <PaperSubscriptionsContainer
          headingSize={headingSize}
        />
      </div>
    );
  }

  return (
    <div {...otherProps}>
      <InternationalSubscriptions
        countryGroupId={countryGroupId}
        headingSize={headingSize}
        {...otherProps}
      />
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
