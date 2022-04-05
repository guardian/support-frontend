import { useState } from 'react';
import 'helpers/productPrice/productPrices';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { ProductPrice } from 'helpers/productPrice/productPrices';
import 'components/gridImage/gridImage';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getAppliedPromo, hasDiscount } from 'helpers/productPrice/promotions';
import { GuardianWeekly } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import SvgDropdownArrowUp from './dropDownArrowUp.svg';
import moduleStyles from './summary.module.scss';

// Type declarations
interface DataListItem {
	title: string;
	value: string;
}

interface SummaryPropTypes {
	billingPeriod: BillingPeriod;
	changeSubscription?: string | null;
	dataList?: DataListItem[];
	description?: string | null;
	image: JSX.Element | null;
	productPrice: ProductPrice;
	title: string;
	product: SubscriptionProduct;
	orderIsAGift?: boolean;
}

interface TabletAndDesktopPropTypes {
	billingPeriod: BillingPeriod;
	changeSubscription?: string | null;
	dataList: DataListItem[];
	description?: string | null;
	image: JSX.Element | null;
	productPrice: ProductPrice;
	title: string;
	product: SubscriptionProduct;
	orderIsAGift?: boolean;
}

interface MobilePropTypes {
	billingPeriod: BillingPeriod;
	changeSubscription?: string | null;
	description: string | null | undefined;
	productPrice: ProductPrice;
	title: string;
	showDropDown: boolean;
	onClick: () => void;
	deliveryMethod?: string;
	paper: boolean;
}

interface ShowDropDownPropTypes {
	billingPeriod: BillingPeriod;
	changeSubscription?: string | null;
	description?: string | null;
	productPrice: ProductPrice;
	title: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	deliveryMethod?: string;
	showDropDown: boolean;
}

interface HideDropDownPropTypes {
	billingPeriod: BillingPeriod;
	productPrice: ProductPrice;
	title: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	paper: boolean;
	showDropDown: boolean;
}

// Variable declarations
const styles = moduleStyles as {
	dataList: string;
	data: string;
	promo: string;
	promoTitle: string;
	changeSub: string;
	dropDown: string;
	changeRight: string;
	spaceRight: string;
	showDropDown: string;
	openState: string;
	defaultState: string;
	tabletAndDesktop: string;
	img: string;
	imgGuardianWeekly: string;
	content: string;
	headerGuardianWeekly: string;
	header: string;
	title: string;
	titleDescription: string;
	pricing: string;
	contentWrapper: string;
	headerShowDetails: string;
	contentShowDetails: string;
	contentShowDetailsNoDecription: string;
	titleLeftAlign: string;
	dataBold: string;
	gift: string;
	contentShowDetailsLast: string;
	mobileOnly: string;
	root: string;
};

// Helper declarations
function DataList(props: { dataList: DataListItem[] }) {
	return (
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
}

// Components
function PromotionDiscount(props: {
	promotion: Promotion | null | undefined;
}): JSX.Element {
	return (
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
}

function ChangeSubscription(props: { route: string }): JSX.Element {
	return (
		<a className={styles.changeSub} href={props.route}>
			Change Subscription
		</a>
	);
}

function DropDownButton(props: {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	showDropDown: boolean;
}): JSX.Element {
	return (
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
}

function TabletAndDesktop({
	billingPeriod,
	changeSubscription,
	dataList,
	description,
	image,
	productPrice,
	title,
	product,
	orderIsAGift,
}: TabletAndDesktopPropTypes): JSX.Element {
	const isGuardianWeeklyGift = product === GuardianWeekly && !orderIsAGift;
	return (
		<span className={styles.tabletAndDesktop}>
			<div
				className={isGuardianWeeklyGift ? styles.imgGuardianWeekly : styles.img}
			>
				{image}
			</div>
			<div className={styles.content}>
				<h3
					className={
						isGuardianWeeklyGift ? styles.headerGuardianWeekly : styles.header
					}
				>
					Order summary
				</h3>
				<h4 className={styles.title} title={`your subscription is ${title}`}>
					{!orderIsAGift && 'The '}
					{title}
					{orderIsAGift && ' Gift Subscription'}
				</h4>
				{description && (
					<h4 className={styles.titleDescription}>{description}</h4>
				)}
				<div>
					<PriceLabel
						className={styles.pricing}
						productPrice={productPrice}
						billingPeriod={billingPeriod}
					/>
					<PromotionDiscount
						promotion={getAppliedPromo(productPrice.promotions)}
					/>
					{dataList.length > 0 && <DataList dataList={dataList} />}
				</div>
				{changeSubscription ? (
					<ChangeSubscription route={changeSubscription} />
				) : null}
			</div>
		</span>
	);
}

function HideDropDown({
	billingPeriod,
	productPrice,
	title,
	onClick,
	paper,
	showDropDown,
}: HideDropDownPropTypes) {
	return (
		<div className={styles.content}>
			<h3 className={styles.header}>Order summary</h3>
			<h4 className={styles.title} title={`your subscription is ${title}`}>
				{title}
			</h4>
			<DropDownButton showDropDown={showDropDown} onClick={onClick} />
			<div>
				<PriceLabel
					className={styles.pricing}
					productPrice={productPrice}
					billingPeriod={billingPeriod}
				/>
				{paper ? (
					<span className={styles.pricing}>&nbsp;&ndash; Voucher booklet</span>
				) : null}
			</div>
		</div>
	);
}

function ShowDropDown({
	billingPeriod,
	changeSubscription,
	description,
	productPrice,
	title,
	onClick,
	deliveryMethod,
	showDropDown,
}: ShowDropDownPropTypes) {
	return (
		<div className={styles.contentWrapper}>
			<h3 className={styles.headerShowDetails}>Order summary</h3>
			<div
				className={
					description
						? styles.contentShowDetails
						: styles.contentShowDetailsNoDecription
				}
			>
				<h4
					className={styles.titleLeftAlign}
					title={`your subscription is ${title}`}
				>
					{title}
				</h4>
				<h3 className={styles.titleDescription}>{description}</h3>
			</div>
			<div className={styles.contentShowDetails}>
				<div className={styles.dataBold}>Payment plan</div>
				<PriceLabel
					className={styles.data}
					productPrice={productPrice}
					billingPeriod={billingPeriod}
				/>
			</div>
			{deliveryMethod ? (
				<div className={styles.contentShowDetails}>
					<div className={styles.dataBold}>Delivery method</div>
					<div className={styles.data}>{deliveryMethod}</div>
				</div>
			) : null}
			<div className={styles.contentShowDetailsLast}>
				<DropDownButton showDropDown={showDropDown} onClick={onClick} />
				{changeSubscription ? (
					<ChangeSubscription route={changeSubscription} />
				) : null}
			</div>
		</div>
	);
}

function Mobile({
	billingPeriod,
	changeSubscription,
	description,
	productPrice,
	title,
	showDropDown,
	onClick,
	deliveryMethod,
	paper,
}: MobilePropTypes): JSX.Element {
	const showDropDownProps: ShowDropDownPropTypes = {
		billingPeriod,
		changeSubscription,
		description,
		productPrice,
		title,
		onClick,
		deliveryMethod,
		showDropDown,
	};

	const hideDropDownProps: HideDropDownPropTypes = {
		billingPeriod,
		productPrice,
		title,
		onClick,
		paper,
		showDropDown,
	};

	return (
		<span className={styles.mobileOnly}>
			{!showDropDown && <HideDropDown {...hideDropDownProps} />}
			{showDropDown && <ShowDropDown {...showDropDownProps} />}
		</span>
	);
}

export default function Summary({
	billingPeriod,
	changeSubscription = null,
	dataList = [],
	description,
	image,
	productPrice,
	title,
	product,
	orderIsAGift = false,
}: SummaryPropTypes): JSX.Element {
	const [showDropDown, setShowDropDown] = useState<boolean>(false);

	const getDeliveryMethod = (): string | undefined => {
		if (dataList.length) {
			const filteredList: DataListItem[] = dataList.filter(
				(item) => item.title === 'Delivery method',
			);

			if (filteredList.length > 0) {
				const lastDeliveryListItem = filteredList.pop();

				if (lastDeliveryListItem) {
					return lastDeliveryListItem.value;
				}
			}
		}
	};

	const toggleDetails = () => {
		setShowDropDown(!showDropDown);
	};

	return (
		<aside className={styles.root}>
			<TabletAndDesktop
				billingPeriod={billingPeriod}
				changeSubscription={changeSubscription}
				dataList={dataList}
				description={description}
				image={image}
				productPrice={productPrice}
				title={title}
				product={product}
				orderIsAGift={orderIsAGift}
			/>
			<Mobile
				onClick={toggleDetails}
				showDropDown={showDropDown}
				deliveryMethod={getDeliveryMethod()}
				paper={product.toLowerCase().includes('paper')}
				billingPeriod={billingPeriod}
				changeSubscription={changeSubscription}
				description={description}
				productPrice={productPrice}
				title={title}
			/>
		</aside>
	);
}
