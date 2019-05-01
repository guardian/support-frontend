// @flow

import React, { Component } from 'react';
import { hasDiscount, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import SvgDropdownArrowUp from './dropdownArrowUp.svg';

// Types

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {|
  billingPeriod: BillingPeriod,
  changeSubscription: string,
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

type PropTypesDL = {|
  dataList: DataListItem[],
|};

const DataList = ({ dataList }: PropTypesDL) => (
  <div className={styles.dataList}>
    {dataList.length > 0 &&
      <dl className={styles.data}>
        {dataList.map(item => [
          <dt>{item.title}</dt>,
          <dd>{item.value}</dd>,
            ])
        }
      </dl>
    }
  </div>
);

type PropTypesPD = {|
  promotion: ?Promotion,
|};

const PromotionDiscount = ({ promotion }: PropTypesPD) => (
  <span>
    {promotion && hasDiscount(promotion) &&
      <div className={styles.promo}>
        <strong className={styles.promoTitle}>
          {promotion.description}
        </strong>
        {' '}({promotion.promoCode})
      </div>
    }
  </span>
);

type PropTypesCS = {|
  route: string,
|};

const ChangeSubscription = ({ route }: PropTypesCS) => (
  <a className={styles.changeSub} href={route}>Change Subscription</a>
);

type PropTypesDDB = {|
  onClick: Function,
  showDropDown: boolean,
|};

const DropDownButton = ({ onClick, showDropDown }: PropTypesDDB) => (
  <button
    aria-hidden="true"
    className={styles.dropDown}
    onClick={onClick}
  >
    <span className={styles.spaceRight}>{showDropDown ? 'Hide details' : 'Show all details'}</span>
    <SvgDropdownArrowUp className={showDropDown ? styles.openState : styles.defaultState} />
  </button>
);

type PropTypesTD = {|
  billingPeriod: BillingPeriod,
  changeSubscription: string,
  dataList: DataListItem[],
  description: ?string,
  image: $Call<GridImageType, GridImg>,
  productPrice: Price,
  promotion: ?Promotion,
  title: string,
|};

const TabletAndDesktop = ({
  billingPeriod, changeSubscription, dataList, description, image, productPrice, promotion, title,
}: PropTypesTD) => (
  <span className={styles.tabletAndDesktop}>
    <div className={styles.img}>
      {image}
    </div>
    <div className={styles.content}>
      <h1 className={styles.header}>Order summary</h1>
      <header>
        <h2 className={styles.title} title={`your subscription is ${title}`}>{title}</h2>
        {description &&
          <h3 className={styles.titleDescription}>{description}</h3>
        }
      </header>
      <div>
        <PriceLabel
          className={styles.pricing}
          productPrice={productPrice}
          promotion={promotion}
          billingPeriod={billingPeriod}
        />
        <PromotionDiscount promotion={promotion} />
        <DataList dataList={dataList} />
      </div>
      <ChangeSubscription route={changeSubscription} />
    </div>
  </span>
);

type PropTypesHDD = {|
  billingPeriod: BillingPeriod,
  onClick: Function,
  productPrice: Price,
  promotion: ?Promotion,
  showDropDown: boolean,
  title: string,
|};

const HideDropDown = ({
  billingPeriod,
  onClick,
  productPrice,
  promotion,
  showDropDown,
  title,
}: PropTypesHDD) => (
  <div className={styles.content}>
    <h1 className={styles.header}>Order summary</h1>
    <header>
      <h2 className={styles.title} title={`your subscription is ${title}`}>{title}</h2>
    </header>
    <DropDownButton showDropDown={showDropDown} onClick={onClick} />
    <div>
      <PriceLabel
        className={styles.pricing}
        productPrice={productPrice}
        promotion={promotion}
        billingPeriod={billingPeriod}
      />
      <span className={styles.pricing}>
        &nbsp;&ndash; Voucher booklet
      </span>
    </div>
  </div>
);

type PropTypesSDD = {|
  billingPeriod: BillingPeriod,
  changeSubscription: string,
  deliveryMethod: string,
  description: string,
  onClick: Function,
  productPrice: Price,
  promotion: ?Promotion,
  title: string,
|};

const ShowDropDown = ({
  changeSubscription,
  deliveryMethod,
  description,
  onClick,
  productPrice,
  promotion,
  billingPeriod,
  title,
}: PropTypesSDD) => (
  <div className={styles.contentWrapper}>
    <h1 className={styles.headerShowDetails}>Order summary</h1>
    <div className={styles.contentShowDetails}>
      <header>
        <h2 className={styles.titleLeftAlign} title={`your subscription is ${title}`}>{title}</h2>
      </header>
      <h3 className={styles.titleDescription}>{description}</h3>
    </div>
    <div className={styles.contentShowDetails}>
      <div className={styles.dataBold}>Payment plan</div>
      <PriceLabel
        className={styles.data}
        productPrice={productPrice}
        promotion={promotion}
        billingPeriod={billingPeriod}
      />
    </div>
    <div className={styles.contentShowDetails}>
      <div className={styles.dataBold}>Delivery method</div>
      <div className={styles.data}>{deliveryMethod}</div>
    </div>
    <div className={styles.contentShowDetailsLast}>
      <DropDownButton showDropDown={ShowDropDown} onClick={onClick} />
      <ChangeSubscription route={changeSubscription} />
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
    return (
      <aside className={styles.root}>
        <TabletAndDesktop {...this.props} />
        <Mobile
          onClick={this.toggleDetails}
          showDropDown={this.state.showDropDown}
          deliveryMethod={this.getDeliveryMethod()}
          {...this.props}
        />
      </aside>
    );
  }
}
