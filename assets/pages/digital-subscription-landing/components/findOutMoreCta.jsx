// @flow

// ----- Imports ----- //

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { type Action, openPopUp } from './promotionPopUpActions';


type PropTypes = {
  openPopUpDialog: () => void,
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    openPopUpDialog: () => {
      dispatch(openPopUp());
    },
  };
}

function FindOutMoreCta(props: PropTypes) {
  return <Button onClick={props.openPopUpDialog} />;
}

function Button(props: { onClick: () => void }) {
  return (
    (
      <div className="component-price-cta">
        <button
          id="price-cta"
          className="component-cta-link"
          onClick={props.onClick}
        >
          <span className="component-cta-link__text">Find out more</span>
          <SvgArrowRightStraight />
          <p id="accessibility-hint-price-cta" className="accessibility-hint">Find out more</p>
        </button>
      </div>)
  );
}

// ----- Exports ----- //

export default connect(null, mapDispatchToProps)(FindOutMoreCta);
