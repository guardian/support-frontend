// @flow
import React, { Component, type Node } from 'react';
import AdFreeSectionC from 'components/adFreeSectionC/adFreeSectionC';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import GridPicture from 'components/gridPicture/gridPicture';

// styles
import './digitalSubscriptionLanding.scss';

const Plus = () => <div className="product-block__plus">+ Plus</div>;

type ListPropTypes = {
  items: Array<Object>,
}

const List = ({ items }: ListPropTypes) => (
  <ul>
    {items.map(item => (
      <li>
        <div className="product-block__list-item__bullet" />
        <span className="product-block__list-item--bold">{item.boldText}</span><br />
        <div className="product-block__list-item__explainer">{item.explainer}</div>
      </li>
    ))}
  </ul>
);

type DropdownPropTypes = {
  children: Node,
  showDropDown: boolean,
  title: string,
}

const Dropdown = ({ children, showDropDown, title }: DropdownPropTypes) => (
  <div id="product-details" className={`product-block__dropdown${showDropDown ? '--show' : '--hide'}`}>
    <div className="product-block__dropdown__title">{title}</div>
    <span className="product-block__ul-handler">
      {children}
    </span>
  </div>
);

type ButtonPropTypes = {
  showDropDown: boolean,
  handleClick: Function,
  product: 'Guardian Daily' | 'Premium App',
}

const Button = ({ showDropDown, handleClick, product }: ButtonPropTypes) => (
  <button
    aria-controls="product-details"
    aria-expanded={showDropDown ? 'true' : 'false'}
    onClick={handleClick}
    className={`product-block__button${showDropDown ? '--show' : '--hide'}`}
  >
    <span className="product-block__button__text">
      <div className={`product-block__arrow__container--${showDropDown ? 'up' : 'down'}`}>
        <div className={showDropDown ? 'product-block__arrow--up' : 'product-block__arrow--down'} />
      </div>
      <span className="product-block__button__text--bold">
        {showDropDown ? `Less about the ${product}` : `More about the ${product}`}
      </span>
    </span>
  </button>
);

const dailyImage = (
  <GridPicture
    sources={[
      {
        gridId: 'digitalSubsDailyMob',
        srcSizes: [140, 500],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'digitalSubsDaily',
        srcSizes: [140, 500, 1000, 1388],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="digitalSubsDaily"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />
);

const appImage = (
  <GridPicture
    sources={[
      {
        gridId: 'digitalSubsAppMob',
        srcSizes: [140, 500],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'digitalSubsApp',
        srcSizes: [140, 500, 1000, 1388],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="digitalSubsApp"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />
);

type ProductCardPropTypes = {
  title: string,
  subtitle: Node,
  image: Node,
}

const ProductCard = ({ title, subtitle, image }: ProductCardPropTypes) => (
  <div className="product-block__item">
    <div className="product-block__item__title">{title}</div>
    <div className="product-block__item__subtitle">{subtitle}</div>
    <span className="product-block__item__image">{image}</span>
  </div>
);

type StateTypes = {
  showDropDownDaily: boolean,
  showDropDownApp: boolean,
}

// This is an empty declaration because there were errors without it being passed in
type PropTypes = {}

class ProductBlock extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      showDropDownDaily: false,
      showDropDownApp: false,
    };
  }

  handleClick = (product: string): void => {
    this.setState({
      [`showDropDown${product}`]: !this.state[`showDropDown${product}`],
    });
    trackComponentClick(`digital-subscriptions-landing-page--accordion--${product}`);
  }

  render() {
    const { state } = this;
    return (
      <div className="hope-is-power__products">
        <div className="product-block__container hope-is-power--centered">
          <div className="product-block__container__label--top">What&apos;s included?</div>
          <ProductCard
            title="The Guardian Daily"
            subtitle={<span className="product-block__item__subtitle--short-first">Each day&apos;s edition in one simple, elegant app</span>}
            image={dailyImage}
          />
          <Dropdown showDropDown={state.showDropDownDaily} title="The Guardian Daily in detail">
            <List
              items={[
                { boldText: 'A new way to read', explainer: 'The newspaper, reimagined for mobile and tablet' },
                { boldText: 'Updated daily', explainer: 'Each edition available to read by 6am, 7 days a week' },
                { boldText: 'A new way to navigate', explainer: 'Read cover to cover, or swipe to sections' },
              ]}
            />
            <List
              items={[
                { boldText: 'Multiple devices', explainer: 'Designed for your mobile or tablet on iOS or Android' },
                { boldText: 'Read offline', explainer: 'Schedule a download and read whenever it suits you' },
                { boldText: 'Ad free', explainer: 'Enjoy our journalism without adverts' },
              ]}
            />
          </Dropdown>
          <Button
            showDropDown={state.showDropDownDaily}
            handleClick={() => this.handleClick('Daily')}
            product="Guardian Daily"
          />
          <Plus />
          <ProductCard
            title="Premium access to the Live app"
            subtitle={<span className="product-block__item__subtitle--short-second">Live news, as it happens</span>}
            image={appImage}
          />
          <Dropdown showDropDown={state.showDropDownApp} title="Premium access to the Live app in detail">
            <List
              items={[
                { boldText: 'Live', explainer: 'Follow a live feed of breaking news and sport, as it happens' },
                { boldText: 'Discover', explainer: 'Explore stories you might have missed, tailored to you' },
                { boldText: 'Enhanced offline reading', explainer: 'Download the day\'s news whever it suits you' },
              ]}
            />
            <List
              items={[
                { boldText: 'Daily Crossword', explainer: 'Play the daily crossword wherever you are' },
                { boldText: 'Ad-free', explainer: 'Enjoy our journalism without adverts' },
              ]}
            />
          </Dropdown>
          <Button
            showDropDown={state.showDropDownApp}
            handleClick={() => this.handleClick('App')}
            product="Premium App"
          />
          <Plus />
          <AdFreeSectionC />
        </div>
      </div>
    );

  }
}


export default ProductBlock;
