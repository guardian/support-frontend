import React, { Component } from 'react';
import type { $Call } from 'utility-types';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import 'helpers/productPrice/productPrices';
import type { GridImg } from 'components/gridImage/gridImage';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import 'components/gridImage/gridImage';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import SvgDropdownArrowUp from './dropDownArrowUp.svg';
import styles from './summary.module.scss';

type GridImageType = typeof import('components/gridImage/gridImage').default;
// Types
export type DataListItem = {
	title: string;
	value: string;
};
type PropTypes = {
	billingPeriod: BillingPeriod;
	changeSubscription?: string | null;
	dataList: DataListItem[];
	description: string | null | undefined;
	image: $Call<GridImageType, GridImg>;
	productPrice: ProductPrice;
	title: string;
	// eslint-disable-next-line react/no-unused-prop-types
	product: SubscriptionProduct;
	orderIsAGift?: boolean;
};
type StateTypes = {
	showDropDown: boolean;
};

// Helpers
const DataList = (props: { dataList: DataListItem[] }) => (
	<div className={styles.dataList}>
		{props.dataList.length > 0 && (
			<dl className={styles.data}>
				{props.dataList.map((item) => [
					<dt>{item.title}</dt>,
					<dd>{item.value}</dd>,
				])}
			</dl>
		)}
	</div>
);

const PromotionDiscount = (props: {
	promotion: Promotion | null | undefined;
}) => (
	<span>
		{props.promotion && hasDiscount(props.promotion) && (
			<div className={styles.promo}>
				<strong className={styles.promoTitle}>
					{props.promotion.description}
				</strong>{' '}
				({props.promotion.promoCode})
			</div>
		)}
	</span>
);

const ChangeSubscription = (props: { route: string }) => (
	<a className={styles.changeSub} href={props.route}>
		Change Subscription
	</a>
);

const DropDownButton = (props: {
	onClick: (...args: any[]) => any;
	showDropDown: boolean;
}) => (
	<button
		aria-hidden="true"
		className={styles.dropDown}
		onClick={props.onClick}
	>
		<span className={styles.spaceRight}>
			{props.showDropDown ? 'Hide details' : 'Show all details'}
		</span>
		<SvgDropdownArrowUp
			className={props.showDropDown ? styles.openState : styles.defaultState}
		/>
	</button>
);

const TabletAndDesktop = (props: PropTypes) => {
	const isGuardianWeeklyGift =
		props.product === GuardianWeekly && !props.orderIsAGift;
	return (
		<span className={styles.tabletAndDesktop}>
			<div
				className={isGuardianWeeklyGift ? styles.imgGuardianWeekly : styles.img}
			>
				{props.image}
			</div>
			<div className={styles.content}>
				<h3
					className={
						isGuardianWeeklyGift ? styles.headerGuardianWeekly : styles.header
					}
				>
					Order summary
				</h3>
				<h4
					className={styles.title}
					title={`your subscription is ${props.title}`}
				>
					{!props.orderIsAGift && 'The '}
					{props.title}
					{props.orderIsAGift && ' Gift Subscription'}
				</h4>
				{props.description && (
					<h4 className={styles.titleDescription}>{props.description}</h4>
				)}
				<div>
					<PriceLabel
						className={styles.pricing}
						productPrice={props.productPrice}
						billingPeriod={props.billingPeriod}
					/>
					<PromotionDiscount
						promotion={getAppliedPromo(props.productPrice.promotions)}
					/>
					{props.dataList && <DataList dataList={props.dataList} />}
				</div>
				{props.changeSubscription ? (
					<ChangeSubscription route={props.changeSubscription} />
				) : null}
			</div>
		</span>
	);
};

TabletAndDesktop.defaultProps = {
	changeSubscription: null,
	dataList: [],
	orderIsAGift: false,
};

const HideDropDown = (props: {
	billingPeriod: BillingPeriod;
	onClick: (...args: any[]) => any;
	productPrice: ProductPrice;
	showDropDown: boolean;
	title: string;
	paper: boolean;
}) => (
	<div className={styles.content}>
		<h3 className={styles.header}>Order summary</h3>
		<h4 className={styles.title} title={`your subscription is ${props.title}`}>
			{props.title}
		</h4>
		<DropDownButton showDropDown={props.showDropDown} onClick={props.onClick} />
		<div>
			<PriceLabel
				className={styles.pricing}
				productPrice={props.productPrice}
				billingPeriod={props.billingPeriod}
			/>
			{props.paper ? (
				<span className={styles.pricing}>&nbsp;&ndash; Voucher booklet</span>
			) : null}
		</div>
	</div>
);

const ShowDropDown = (
	props: PropTypes & {
		deliveryMethod: string | null;
		onClick: (...args: any[]) => any;
		showDropDown: boolean;
		productPrice: ProductPrice;
		billingPeriod: BillingPeriod;
		orderIsAGift: boolean;
		title: string;
	},
) => (
	<div className={styles.contentWrapper}>
		<h3 className={styles.headerShowDetails}>Order summary</h3>
		<div
			className={
				props.description
					? styles.contentShowDetails
					: styles.contentShowDetailsNoDecription
			}
		>
			<h4
				className={styles.titleLeftAlign}
				title={`your subscription is ${props.title}`}
			>
				{props.title}
			</h4>
			<h3 className={styles.titleDescription}>{props.description}</h3>
		</div>
		<div className={styles.contentShowDetails}>
			<div className={styles.dataBold}>Payment plan</div>
			<PriceLabel
				className={styles.data}
				productPrice={props.productPrice}
				billingPeriod={props.billingPeriod}
				giftStyles={styles.gift}
			/>
		</div>
		{props.deliveryMethod ? (
			<div className={styles.contentShowDetails}>
				<div className={styles.dataBold}>Delivery method</div>
				<div className={styles.data}>{props.deliveryMethod}</div>
			</div>
		) : null}
		<div className={styles.contentShowDetailsLast}>
			<DropDownButton
				showDropDown={props.showDropDown}
				onClick={props.onClick}
			/>
			{props.changeSubscription ? (
				<ChangeSubscription route={props.changeSubscription} />
			) : null}
		</div>
	</div>
);

const Mobile = (props) => (
	<span className={styles.mobileOnly}>
		{!props.showDropDown && <HideDropDown {...props} />}
		{props.showDropDown && <ShowDropDown {...props} />}
	</span>
); // Main class

export default class Summary extends Component<PropTypes, StateTypes> {
	static defaultProps = {
		changeSubscription: null,
		dataList: [],
		orderIsAGift: false,
	};

	constructor(props: PropTypes) {
		super(props);
		this.state = {
			showDropDown: false,
		};
	}

	getDeliveryMethod = () =>
		this.props.dataList.filter((item) => item.title === 'Delivery method').pop()
			.value;
	toggleDetails = () => {
		this.setState({
			showDropDown: !this.state.showDropDown,
		});
	};

	render() {
		const { product } = this.props;
		return (
			<aside className={styles.root}>
				<TabletAndDesktop {...this.props} />
				<Mobile
					onClick={this.toggleDetails}
					showDropDown={this.state.showDropDown}
					deliveryMethod={
						this.props.dataList.length ? this.getDeliveryMethod() : null
					}
					paper={product.toLowerCase().includes('paper')}
					{...this.props}
				/>
			</aside>
		);
	}
}
