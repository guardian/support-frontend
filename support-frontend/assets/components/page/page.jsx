// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import TimeTravelBanner from 'components/headerBanners/timeTravelBanner';
import { connect } from 'react-redux';
import type { State, ThankYouPageStage } from 'pages/new-contributions-landing/contributionsLandingReducer';


// ----- Types ----- //

type PropTypes = {|
  id: ?string,
  header: Node,
  footer: Node,
  children: Node,
  classModifiers: Array<?string>,
  backgroundImageSrc: ?string,
  thankYouPageStage: ThankYouPageStage,
|};

const mapStateToProps = (state: State) => ({
  thankYouPageStage: state.page.form.thankYouPageStage,
});


// ----- Component ----- //

function Page(props: PropTypes) {
  // Set password screen shouldn't inherit new page-level classnames, unlike other pages in thank you flow
  const classMods = props.thankYouPageStage === 'thankYouSetPassword' ? [] : props.classModifiers;

  const backgroundImage = props.backgroundImageSrc ? (
    <div className="background-image-container">
      <img className="background-image" alt="landing page background illustration" src={props.backgroundImageSrc} />
    </div>
  ) : null;

  return (
    <div id={props.id} className={classNameWithModifiers('gu-content', classMods)}>
      <TimeTravelBanner />
      {props.header}
      <main role="main" className="gu-content__main">
        {backgroundImage}
        {props.children}
      </main>
      {props.footer}
    </div>
  );

}


// ----- Default Props ----- //

Page.defaultProps = {
  id: null,
  classModifiers: [],
  backgroundImageSrc: null,
};

export default connect(mapStateToProps)(Page);
