// @flow

import React, { Component } from 'react';
import { hasDiscount, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import SvgDropdownArrowUp from './dropDownArrowUp.svg';

// Types

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {|
  billingPeriod: BillingPeriod,
  changeSubscription?: string | null,
  dataList: DataListItem[],
  description: ?string,
  image: $Call<GridImageType, GridImg>,
  productPrice: Price,
  promotion: ?Promotion,
  title: string,
|};

type StateTypes = {
  showDropDown: boolean,
}

// Helpers

const DataList = (props: { dataList: DataListItem[] }) => (
  <div className={styles.dataList}>
    {props.dataList.length > 0 &&
      <dl className={styles.data}>
        {props.dataList.map(item => [
          <dt>{item.title}</dt>,
          <dd>{item.value}</dd>,
            ])
        }
      </dl>
    }
  </div>
);


const PromotionDiscount = (props: { promotion: ?Promotion }) => (
  <span>
    {props.promotion && hasDiscount(props.promotion) &&
      <div className={styles.promo}>
        <strong className={styles.promoTitle}>
          {props.promotion.description}
        </strong>
        {' '}({props.promotion.promoCode})
      </div>
    }
  </span>
);


const ChangeSubscription = (props: { route: string }) => (
  <a className={styles.changeSub} href={props.route}>Change Subscription</a>
);


const DropDownButton = (props: { onClick: Function, showDropDown: boolean }) => (
  <button
    aria-hidden="true"
    className={styles.dropDown}
    onClick={props.onClick}
  >
    <span className={styles.spaceRight}>{props.showDropDown ? 'Hide details' : 'Show all details'}</span>
    <SvgDropdownArrowUp className={props.showDropDown ? styles.openState : styles.defaultState} />
  </button>
);


const TabletAndDesktop = (props: PropTypes) => (
  <span className={styles.tabletAndDesktop}>
    <div className={styles.img}>
      {props.image}
    </div>
    <div className={styles.content}>
      <h1 className={styles.header}>Order summary</h1>
      <header>
        <h2 className={styles.title} title={`your subscription is ${props.title}`}>{props.title}</h2>
        {props.description &&
          <h3 className={styles.titleDescription}>{props.description}</h3>
        }
      </header>
      <div>
        <PriceLabel
          className={styles.pricing}
          productPrice={props.productPrice}
          promotion={props.promotion}
          billingPeriod={props.billingPeriod}
        />
        <PromotionDiscount promotion={props.promotion} />
        {props.dataList ?
          <DataList dataList={props.dataList} />
        : null}
      </div>
      {props.changeSubscription ?
        <ChangeSubscription route={props.changeSubscription} />
      : null }
    </div>
  </span>
);

TabletAndDesktop.defaultProps = {
  changeSubscription: null,
  dataList: [],
};

const HideDropDown = (props: {
  billingPeriod: BillingPeriod,
  onClick: Function,
  productPrice: Price,
  promotion: ?Promotion,
  showDropDown: boolean,
  title: string,
  paper: boolean,
}) => (
  <div className={styles.content}>
    <h1 className={styles.header}>Order summary</h1>
    <header>
      <h2 className={styles.title} title={`your subscription is ${props.title}`}>{props.title}</h2>
    </header>
    <DropDownButton showDropDown={props.showDropDown} onClick={props.onClick} />
    <div>
      <PriceLabel
        className={styles.pricing}
        productPrice={props.productPrice}
        promotion={props.promotion}
        billingPeriod={props.billingPeriod}
      />
      {props.paper ?
        <span className={styles.pricing}>
          &nbsp;&ndash; Voucher booklet
        </span>
      : null}
    </div>
  </div>
);


const ShowDropDown = (props: {
  ...PropTypes,
  deliveryMethod: string | null,
  onClick: Function,
  showDropDown: boolean,
}) => (
  <div className={styles.contentWrapper}>
    <h1 className={styles.headerShowDetails}>Order summary</h1>
    <div className={props.description ? styles.contentShowDetails : styles.contentShowDetailsNoDecription}>
      <header>
        <h2 className={styles.titleLeftAlign} title={`your subscription is ${props.title}`}>{props.title}</h2>
      </header>
      <h3 className={styles.titleDescription}>{props.description}</h3>
    </div>
    <div className={styles.contentShowDetails}>
      <div className={styles.dataBold}>Payment plan</div>
      <PriceLabel
        className={styles.data}
        productPrice={props.productPrice}
        promotion={props.promotion}
        billingPeriod={props.billingPeriod}
      />
    </div>
    {props.deliveryMethod ?
      <div className={styles.contentShowDetails}>
        <div className={styles.dataBold}>Delivery method</div>
        <div className={styles.data}>{props.deliveryMethod}</div>
      </div>
    : null}
    <div className={styles.contentShowDetailsLast}>
      <DropDownButton showDropDown={props.showDropDown} onClick={props.onClick} />
      {props.changeSubscription ?
        <ChangeSubscription route={props.changeSubscription} />
      : null}
    </div>
  </div>
);


const Mobile = props => (
  <span className={styles.mobileOnly}>
    {!props.showDropDown && <HideDropDown {...props} />}
    {props.showDropDown && <ShowDropDown {...props} />}
  </span>
);

// Main class

export default class Summary extends Component<PropTypes, StateTypes> {
  static defaultProps = {
    changeSubscription: null,
    dataList: [],
  }

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      showDropDown: false,
    };
  }

  getDeliveryMethod = () => this.props.dataList.filter(item => item.title === 'Delivery method').pop().value

  toggleDetails = () => {
    this.setState({ showDropDown: !this.state.showDropDown });
  }

  render() {
    const url = new URL(window.location).pathname;
    const isPaperCheckout = url.includes('paper');

    return (
      <aside className={styles.root}>
        <TabletAndDesktop {...this.props} />
        <Mobile
          onClick={this.toggleDetails}
          showDropDown={this.state.showDropDown}
          deliveryMethod={this.props.dataList.length ? this.getDeliveryMethod() : null}
          paper={isPaperCheckout}
          {...this.props}
        />
      </aside>
    );
  }
}
