import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import { useIsWideScreen } from 'helpers/customHooks/useIsWideScreen';
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	Channel,
	type ProductLabelProps,
} from 'pages/paper-subscription-landing/helpers/products';
import type { PlanData } from 'pages/paper-subscription-landing/planData';
import BenefitsList from './BenefitsList';
import Collapsible from './Collapsible';
import {
	ButtonCTA,
	planDescription,
	productCardWithLabel,
	productOption,
	productOptionHighlight,
	productOptionInfo,
	productOptionLabel,
	productOptionLabelObserver,
	productOptionOfferCopy,
	productOptionPrice,
	productOptionTitle,
	productOptionTitleHeading,
	specialOfferOption,
} from './PaperProductCardStyles';

export type Product = {
	title: string;
	price: string;
	children?: ReactNode;
	offerCopy?: ReactNode;
	planData: PlanData;
	buttonCopy: string;
	href: string;
	onClick: () => void;
	onView: () => void;
	productLabel?: ProductLabelProps;
	label?: string;
	cssOverrides?: SerializedStyles;
	billingPeriod?: BillingPeriod;
	isSpecialOffer?: boolean;
	unavailableOutsideLondon?: boolean;
};

function ProductCard(props: Product) {
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

	const isWideScreen = useIsWideScreen();

	/**
	 * The first time this runs hasBeenSeen
	 * is false, it's default value. It will run
	 * once more if the element under observation
	 * has scrolled into view, then hasBeenSeen should be
	 * true.
	 * */
	useEffect(() => {
		if (hasBeenSeen) {
			props.onView();
		}
	}, [hasBeenSeen]);

	const isObserverChannel = props.productLabel?.channel === Channel.Observer;

	const renderPlanDetails = () => (
		<>
			<BenefitsList
				title={props.planData.benefits.label}
				listItems={props.planData.benefits.items}
			/>

			<BenefitsList
				title={props.planData.digitalRewards?.label}
				listItems={props.planData.digitalRewards?.items}
			/>
			{props.unavailableOutsideLondon && (
				<p css={productOptionInfo}>
					<SvgInfoRound size="small" />
					Only available inside Greater London.
				</p>
			)}
		</>
	);

	return (
		<div
			ref={setElementToObserve}
			css={[
				productOption,
				props.cssOverrides,
				props.isSpecialOffer ? specialOfferOption : css``,
				props.label ? productCardWithLabel : css``,
			]}
		>
			{props.label && <div css={[productOptionHighlight]}>{props.label}</div>}
			<section css={[productOptionTitle]}>
				<h3 css={productOptionTitleHeading}>{props.title}</h3>
				{props.productLabel && (
					<span
						css={[
							productOptionLabel,
							isObserverChannel ? productOptionLabelObserver : css``,
						]}
					>
						{props.productLabel.text}
					</span>
				)}
				{props.children && props.children}
			</section>

			<p css={productOptionPrice}>
				{props.price}
				<small>/month</small>
			</p>

			<div css={ButtonCTA}>
				<LinkButton
					priority="primary"
					href={props.href}
					onClick={props.onClick}
					aria-label={`${props.title}- ${props.buttonCopy}`}
					theme={themeButtonReaderRevenueBrand}
				>
					{props.buttonCopy}
				</LinkButton>
			</div>

			<p css={[productOptionOfferCopy]}>{props.offerCopy}</p>
			<p css={planDescription}>{props.planData.description}</p>

			{isWideScreen ? (
				renderPlanDetails()
			) : (
				<Collapsible>{renderPlanDetails()}</Collapsible>
			)}
		</div>
	);
}

ProductCard.defaultProps = {
	children: null,
	label: '',
	offerCopy: '',
	cssOverrides: '',
	billingPeriod: BillingPeriod.Monthly,
};

export default ProductCard;
