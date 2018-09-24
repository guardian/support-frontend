// @flow

// ----- Imports ----- //

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import GridImage from 'components/gridImage/gridImage';
import SvgCross from 'components/svgs/cross';
import SvgChevron from 'components/svgs/chevron';
import { classNameWithModifiers } from 'helpers/utilities';
import { type Action, closePopUp } from './promotionPopUpActions';
import { expandOption, type PromotionOptions } from './promotionPopUpActions';
import { type State } from './promotionPopUpReducer';

type PropTypes = {
  isPopUpOpen: boolean,
  expandedOption: PromotionOptions,
  closePopUpDialog: () => void,
  expandOption: (option: PromotionOptions) => void,
}

// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    isPopUpOpen: state.page.isPopUpOpen,
    expandedOption: state.page.expandedOption,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {

  return {
    closePopUpDialog: () => {
      dispatch(closePopUp());
    },
    expandOption: (option: PromotionOptions) => {
      dispatch(expandOption(option));
    },
  };

}

function PromotionPopUp(props: PropTypes) {
  if (props.isPopUpOpen) {
    return (
      <div className="component-promotion-popup">
        <div className="component-promotion-popup__form">
          <div className="component-promotion-popup__header">
            <button onClick={props.closePopUpDialog} className="component-promotion-popup__close"><SvgCross />
            </button>
            <GridImage
              classModifiers={['pop-up-image']}
              gridId="digitalSubscriptionPromotionPopUpHeader"
              srcSizes={[1000, 500, 140]}
              sizes="(max-width: 480px) 90vw, (max-width: 660px) 400px, 270px"
              imgType="png"
            />
            <div className="component-promotion-popup__roundel">
              <h1>Upgrade<br />to<br />Paper+<br />Digital</h1>
            </div>
          </div>
          <div className="component-promotion-popup__body">
            <h2 className="component-promotion-popup__title">Select your subscription to see more</h2>
            <div className="component-promotion-popup__options">
              <Options expandedOption={props.expandedOption} expandOption={props.expandOption} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function getOptionClassName(expandedOption: PromotionOptions, thisOption: PromotionOptions) {
  const modifier = expandedOption === thisOption ? 'open' : 'closed';
  return classNameWithModifiers('component-promotion-options__item', [modifier]);
}

function Options(props: {
  expandedOption: PromotionOptions,
  expandOption: (option: PromotionOptions) => void}) {
  return (
    <ul>
      <OptionItem
        thisOption="Saturday"
        description="Get the Saturday paper, plus a Digital Pack subscription for just £11.26 extra per month."
        {...props}
      />
      <OptionItem
        thisOption="Sunday"
        description="Get the Observer on Sunday, plus a Digital Pack subscription for just £11.27 extra per month"
        {...props}
      />
      <OptionItem
        thisOption="Weekend"
        description="Get the Saturday paper, the Observer on Sunday, plus a Digital Pack subscription for just £8.66 extra per month."
        {...props}
      />
    </ul>
  );
}

function OptionItem(props: {
  expandedOption: PromotionOptions,
  thisOption: PromotionOptions,
  expandOption: (option: PromotionOptions) => void,
  description: string,
}) {
  return (
    <li className={getOptionClassName(props.expandedOption, props.thisOption)}>
      <button className="component-promotion-options__button" onClick={() => props.expandOption(props.thisOption)}>
        <SvgChevron />
      </button>
      <h3 className="component-promotion-options__title">{`I have a ${props.thisOption} subscription`}</h3>
      <span className="component-promotion-options__description">
        <p className="component-promotion-options__description-p1">{props.description}</p>
        <p>To upgrade, please <strong>call <a className="component-promotion-options__phone-link" href="tel:0330 333 6796">0330 333 6796</a></strong> and one of our agents will be happy to assist.</p>
      </span>
    </li>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(PromotionPopUp);
