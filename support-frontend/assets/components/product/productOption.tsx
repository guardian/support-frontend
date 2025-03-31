import type { SerializedStyles } from '@emotion/react';
import { css, ThemeProvider } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
 SvgInfoRound } from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import {
	Channel,
	type LabelProps,
} from 'pages/paper-subscription-landing/helpers/products';
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
	label?: LabelProps;
	tag?: string;
	cssOverrides?: SerializedStyles;
	billingPeriod?: BillingPeriod;
	isSpecialOffer?: boolean;
	unavailableOutsideLondon?: boolean;
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

	const isObserverChannel = props.label?.channel === Channel.Observer;
	const productOptionMargin =
		props.tag &&
		css`
			${until.tablet} {
				/* calculation belows are based on productOptionHighlight text size, line height and padding */
				&:first-of-type {
					margin-top: calc((20px * 1.5) + 8px) !important;
				}
				/* 16px alloted for margin between product options when a tag is present */
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
				props.label ? productOptionWithLabel : css``,
			]}
		>
			{props.tag && (
				<span
					css={[
						productOptionHighlight,
						props.isSpecialOffer ? specialOfferHighlight : css``,
					]}
				>
					{props.tag}
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
				{props.label && (
					<span
						css={[
							productOptionLabel,
							isObserverChannel ? productOptionLabelObserver : css``,
						]}
					>
						{props.label.text}
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
				<ThemeProvider theme={buttonThemeReaderRevenue}>
					<LinkButton
						cssOverrides={button}
						href={props.href}
						onClick={props.onClick}
						aria-label={`${props.title}- ${props.buttonCopy}`}
					>
						{props.buttonCopy}
					</LinkButton>
				</ThemeProvider>
			</div>
		</div>
	);
}

ProductOption.defaultProps = {
	children: null,
	label: '',
	offerCopy: '',
	cssOverrides: '',
	billingPeriod: Monthly,
};

export default ProductOption;
