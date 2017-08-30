// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ContributionsIntroduction from './contributionsIntroduction';
import ContributionsContext from './contributionsContext';
import ContributionsContextIntro from './contributionsContextIntro';
import ContributionsBundle from './contributionsBundle';


// ----- Types ----- //

type PropTypes = {
  context: boolean,
};


// ----- Component ----- //

function ContributionsBundleContent(props: PropTypes) {

  return (
    <div className="contributions-bundle__content gu-content-margin">
      {props.context
        ? <ContributionsContext />
        : <ContributionsIntroduction />
      }
      {props.context ? <ContributionsContextIntro /> : null}
      <ContributionsBundle />
    </div>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    context: state.contribution.context,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsBundleContent);
