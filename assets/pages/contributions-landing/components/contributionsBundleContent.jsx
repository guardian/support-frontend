// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import type { Participations } from 'helpers/abtest';
import ContributionsIntroduction from './contributionsIntroduction';
import ContributionsContext from './contributionsContext';
import ContributionsContextIntro from './contributionsContextIntro';
import ContributionsBundle from './contributionsBundle';


// ----- Types ----- //

type PropTypes = {
  context: boolean,
  abTests: Participations,
};


// ----- Component ----- //

function ContributionsBundleContent(props: PropTypes) {

  return (
    <div className="contributions-bundle__content gu-content-margin">
      {props.context
        ? <ContributionsContext />
        : <ContributionsIntroduction
          abTests={props.abTests}
        />
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
    abTests: state.common.abParticipations,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsBundleContent);
