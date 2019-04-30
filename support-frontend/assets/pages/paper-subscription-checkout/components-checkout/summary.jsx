// @flow

import React, { Component, type Node } from 'react';
import { hasDiscount, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import SvgDropdownArrowUp from 'components/svgs/dropdownArrowUp';


export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {
  image: $Call<GridImageType, GridImg>,
  children: Node,
  productPrice: Price,
  promotion: ?Promotion,
  billingPeriod: BillingPeriod,
  dataList: DataListItem[],
  title: string,
  description: ?string,
};

// Helpers

const DataList = ({ dataList }) => (
  <div className={styles.dataList}>
    {dataList.length > 0 &&
      <dl className={styles.data}>
        {dataList.map(item => [
          <dt>{item.title}</dt>,
          <dd>{item.value}</dd>,
            ]
          )
        }
      </dl>
    }
  </div>
);

const PromotionDiscount = ({ promotion }) => (
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

const ChangeSubscription = ({ route }) => (
  <a className={styles.changeSub} href={route}>Change Subscription</a>
);

const DropDownButton = ({ onClick, showDropDown }) => (
  <button
    role="button"
    aria-hidden="true"
    className={styles.dropDown}
    onClick={onClick}
  >
    <span className={styles.spaceRight}>{showDropDown ? 'Hide details' : 'Show all details'}</span>
    <span className={showDropDown ? styles.openState : styles.defaultState}><SvgDropdownArrowUp /></span>
  </button>
);

const TabletAndDesktop = ({
  billingPeriod, changeSubscription, dataList, description, image, productPrice, promotion, title
}) => (
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

const HideDropDown = ({
  billingPeriod,
  dataList,
  description,
  image,
  onClick,
  productPrice,
  promotion,
  showDropDown,
  title,
}) => (
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

const ShowDropDown = ({
  changeSubscription,
  deliveryMethod,
  description,
  onClick,
  productPrice,
  promotion,
  billingPeriod,
  title,
}) => (
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

const Mobile = (props) => (
  <span className={styles.mobileOnly}>
    {!props.showDropDown && <HideDropDown {...props} />}
    {props.showDropDown && <ShowDropDown {...props} />}
  </span>
);

// Main component

export default class Summary extends Component<PropTypes> {
  state = {
    showDropDown: false,
  }

  toggleDetails = () => {
    this.setState({ showDropDown: !this.state.showDropDown });
  }

  getDeliveryMethod = () => {
    return this.props.dataList.filter(item => item.title === 'Delivery method').pop().value
  }

  render() {
    const { children, dataList, promotion } = this.props;

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
    )
  }
}

Summary.defaultProps = {
  dataList: [],
  children: null,
};
