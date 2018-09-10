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
  supporterSectionId: string,
  headingSize: HeadingSize,
};


function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  if (props.countryGroupId === 'GBPCountries') {
    return (
      <section id={props.supporterSectionId}>
        <DigitalSubscriptionsContainer
          headingSize={props.headingSize}
        />
        <PaperSubscriptionsContainer
          headingSize={props.headingSize}
        />
      </section>
    );
  }

  return (
    <InternationalSubscriptions
      sectionId={props.supporterSectionId}
      countryGroupId={props.countryGroupId}
      headingSize={props.headingSize}
    />
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
