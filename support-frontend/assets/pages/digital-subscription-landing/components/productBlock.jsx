// @flow
import React, { Component } from 'react';
import AdFreeSectionC from 'components/adFreeSectionC/adFreeSectionC';

// styles
import './digitalSubscriptionLanding.scss';

const Plus = () => <div className="product-block__plus">+ Plus</div>;

type ListItemPropTypes = {
  boldText: string,
  explainer: string,
}

const ListItem = ({ boldText, explainer }: ListItemPropTypes) => (
  <li>
    <div className="product-block__list-item__bullet" />
    <span className="product-block__list-item--bold">{boldText}</span><br />
    <div className="product-block__list-item__explainer">{explainer}</div>
  </li>
);

type StateTypes = {
  showDropDown: boolean,
}

// This is an empty declaration because there were errors without it being passed in
type PropTypes = {}

class ProductBlock extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      showDropDown: false,
    };
  }

  handleClick = () => (
    this.setState({
      showDropDown: !this.state.showDropDown,
    })
  )

  render() {
    const { state } = this;
    return (
      <div className="hope-is-power__products">
        <div className="product-block__container hope-is-power--centered">
          <div className="product-block__container__label--top">What&apos;s included?</div>
          <div className="product-block__item">
            <div className="product-block__item__title">The Guardian Daily</div>
          </div>
          <div id="product-details" className={`product-block__dropdown${state.showDropDown ? '--show' : '--hide'}`}>
            <div className="product-block__dropdown__title">The Guardian Daily in detail</div>
            <span className="product-block__ul-handler">
              <ul>
                <ListItem boldText="A new way to read" explainer="The newspaper, reimagined for mobile and tablet" />
                <ListItem boldText="Updated daily" explainer="Each edition available to read by 6am, 7 days a week" />
                <ListItem boldText="A new way to navigate" explainer="Read cover to cover, or swipe to sections" />
              </ul>
              <ul>
                <ListItem boldText="Multiple devices" explainer="Designed for your mobile or tablet on iOS or Android" />
                <ListItem boldText="Read offline" explainer="Schedule a download and read whenever it suits you" />
                <ListItem boldText="Ad free" explainer="Enjoy our journalism without adverts" />
              </ul>
            </span>
          </div>
          <button
            aria-controls="product-details"
            aria-expanded={state.showDropDown ? 'true' : 'false'}
            onClick={this.handleClick}
            className={`product-block__button${state.showDropDown ? '--show' : '--hide'}`}
          >
            <span className="product-block__button__text">
              <div className={`product-block__arrow__container--${state.showDropDown ? 'up' : 'down'}`}>
                <div className={state.showDropDown ? 'product-block__arrow--up' : 'product-block__arrow--down'} />
              </div>
              <span className="product-block__button__text--bold">
                {state.showDropDown ? 'Less about the Guardian Daily' : 'More about the Guardian Daily'}
              </span>
            </span>
          </button>
          <Plus />
          <div className="product-block__item">
            <div className="product-block__item__title">Premium access to the Live app</div>
          </div>
          <Plus />
          <AdFreeSectionC />
        </div>
      </div>
    );

  }
}


export default ProductBlock;
