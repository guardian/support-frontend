// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ContributionsIntroduction from './contributionsIntroduction';
import ContributionsContext from './contributionsContext';
import ContributionsContextIntro from './contributionsContextIntro';
import ContributionsBundle from './contributionsBundle';


// ----- Types ----- //

type PropTypes = {
  context: boolean,
  countryGroupId: CountryGroupId,
};


// ----- Component ----- //

function ContributionsBundleContent(props: PropTypes) {

  return (
    <div className="contributions-bundle__content gu-content-margin">
      {props.context
        ? <ContributionsContext />
        : <ContributionsIntroduction countryGroupId={props.countryGroupId} />
      }
      {props.context ? <ContributionsContextIntro /> : null}
      <ContributionsBundle />
    </div>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    context: state.page.context,
    countryGroupId: state.common.countryGroup,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsBundleContent);
