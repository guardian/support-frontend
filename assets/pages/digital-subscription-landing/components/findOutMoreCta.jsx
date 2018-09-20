// @flow

// ----- Imports ----- //

import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import GridImage from 'components/gridImage/gridImage';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import type { Action } from 'components/directDebit/directDebitActions';
import { closePopUp, openPopUp } from './findOutMoreActions';
import SvgCross from '../../../components/svgs/cross';

type PropTypes = {
  isPopUpOpen: boolean,
  closePopUpDialog: () => void,
  openPopUpDialog: () => void,
}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isPopUpOpen: state.page.isPopUpOpen,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    closePopUpDialog: () => {
      dispatch(closePopUp());
    },
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

function PopUp(props: { onClose: () => void }) {
  return (
    <div className="component-find-out-more-popup">
      <div className="component-find-out-more-popup__form">
        <div className="component-find-out-more-popup__header">
          <button onClick={props.onClose} className="component-find-out-more-popup__close"><SvgCross /></button>
          <GridImage
            classModifiers={['pop-up-header']}
            gridId="digitalSubscriptionPromotionPopUpHeader"
            srcSizes={[1000, 500, 140]}
            sizes="(max-width: 480px) 90vw, (max-width: 660px) 400px, 270px"
            altText="Blah"
            imgType="png"
          />
        </div>
        <div className="component-find-out-more-popup__body">
          <h1 className="component-find-out-more-popup__title">Select your subscription to see more</h1>
          <div className="component-find-out-more-popup__options">
            <p>To upgrade to paper + digital call 0330 333 6796 and one of our agents will be happy to assist.
              <ul>
                <li>Sat: +£11.26 extra / month</li>
                <li>Sun: +£11.27 extra / month</li>
                <li>Weekend: +£8.66 extra / month</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(FindOutMoreCta);
