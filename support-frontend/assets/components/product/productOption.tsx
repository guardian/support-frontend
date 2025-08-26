import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgInfoRound,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import {
	Channel,
	type ProductLabelProps,
} from 'pages/paper-subscription-landing/helpers/products';
import type { PlanData } from 'pages/paper-subscription-landing/planData';
import {
	button,
	buttonDiv,
	priceCopyGridPlacement,
	productOption,
	productOptionHighlight,
	productOptionInfo,
	productOptionLabel,
	productOptionLabelObserver,
	productOptionOfferCopy,
	productOptionPrice,
	productOptionPriceCopy,
	productOptionTitle,
	productOptionTitleHeading,
	productOptionUnderline,
	productOptionVerticalLine,
	productOptionWithLabel,
	specialOfferHighlight,
	specialOfferOption,
} from './productOptionStyles';

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
	planData?: PlanData;
};

function ProductOption(props: Product): JSX.Element {
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
	const productOptionMargin =
		props.label &&
		css`
			${until.tablet} {
				/* calculation belows are based on productOptionHighlight text size, line height and padding */
				&:first-of-type {
					margin-top: calc((20px * 1.5) + 8px) !important;
				}
				/* 16px alloted for margin between product options when a label is present */
				&:not(first-of-type) {
					margin-top: calc((20px * 1.5) + 8px + 16px) !important;
				}
			}
		`;

	return (
		<div
			ref={setElementToObserve}
			css={[
				productOption,
				props.cssOverrides,
				productOptionMargin,
				props.isSpecialOffer ? specialOfferOption : css``,
				props.productLabel ? productOptionWithLabel : css``,
			]}
		>
			{props.label && (
				<span
					css={[
						productOptionHighlight,
						props.isSpecialOffer ? specialOfferHighlight : css``,
					]}
				>
					{props.label}
				</span>
			)}
			<div
				css={[
					productOptionTitle,
					productOptionVerticalLine,
					productOptionUnderline,
				]}
			>
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
			<div css={productOptionVerticalLine}>
				<p css={[productOptionOfferCopy, productOptionUnderline]}>
					{props.offerCopy}
					{props.unavailableOutsideLondon && (
						<div css={productOptionInfo}>
							<SvgInfoRound />
							<p>Only available inside Greater London.</p>
						</div>
					)}
				</p>
			</div>
			<div css={priceCopyGridPlacement}>
				{/* role="text" is non-standardised but works in Safari. Reads the whole section as one text element */}
				<p role="text" css={productOptionPriceCopy}>
					<span css={productOptionPrice}>{props.price}</span>
					{props.priceCopy}
				</p>
			</div>
			<div css={buttonDiv}>
				<LinkButton
					cssOverrides={button}
					href={props.href}
					onClick={props.onClick}
					aria-label={`${props.title}- ${props.buttonCopy}`}
					theme={themeButtonReaderRevenue}
				>
					{props.buttonCopy}
				</LinkButton>
			</div>
		</div>
	);
}

ProductOption.defaultProps = {
	children: null,
	label: '',
	offerCopy: '',
	cssOverrides: '',
	billingPeriod: BillingPeriod.Monthly,
};

export default ProductOption;
