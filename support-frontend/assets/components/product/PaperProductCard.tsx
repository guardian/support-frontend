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
import { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	Channel,
	type ProductLabelProps,
} from 'pages/paper-subscription-landing/helpers/products';
import {
	button,
	buttonDiv,
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
	specialOfferHighlight,
	specialOfferOption,
} from './PaperProductCardStyles';

export type Product = {
	title: string;
	price: string;
	children?: ReactNode;
	offerCopy?: ReactNode;
	priceCopy: ReactNode;
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

function ProductCard(props: Product): JSX.Element {
	const [hasBeenSeen, setElementToObserve] = useHasBeenSeen({
		threshold: 0.5,
		debounce: true,
	});

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
			{props.label && (
				<div
					css={[
						productOptionHighlight,
						props.isSpecialOffer ? specialOfferHighlight : css``,
					]}
				>
					{props.label}
				</div>
			)}
			<div css={[productOptionTitle]}>
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
			</div>
			<div>
				<p css={productOptionPrice}>
					{props.price}
					<small>/month</small>
				</p>
			</div>

			<div css={buttonDiv}>
				<LinkButton
					priority="primary"
					cssOverrides={button}
					href={props.href}
					onClick={props.onClick}
					aria-label={`${props.title}- ${props.buttonCopy}`}
					theme={themeButtonReaderRevenueBrand}
				>
					{props.buttonCopy}
				</LinkButton>
			</div>
			<p css={[productOptionOfferCopy]}>
				{props.offerCopy}
				{props.unavailableOutsideLondon && (
					<div css={productOptionInfo}>
						<SvgInfoRound />
						<p>Only available inside Greater London.</p>
					</div>
				)}
			</p>
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
