import type { SerializedStyles } from '@emotion/react';
import { css, ThemeProvider } from '@emotion/react';
import { until } from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
} from '@guardian/source-react-components';
import { InfoSummary } from '@guardian/source-react-components-development-kitchen';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import {
	button,
	buttonDiv,
	priceCopyGridPlacement,
	productOption,
	productOptionHighlight,
	productOptionOfferCopy,
	productOptionPrice,
	productOptionPriceCopy,
	productOptionTitle,
	productOptionUnderline,
	productOptionVerticalLine,
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
	label?: string;
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
			]}
		>
			<div css={productOptionVerticalLine}>
				<h3 css={[productOptionTitle, productOptionUnderline]}>
					{props.title}
				</h3>
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
				{props.children && props.children}
			</div>
			<div css={productOptionVerticalLine}>
				<p css={[productOptionOfferCopy, productOptionUnderline]}>
					{props.offerCopy}
					{!props.offerCopy && props.unavailableOutsideLondon && (
						<InfoSummary
							cssOverrides={css`
								border: 0;
							`}
							message=""
							context="Only available inside Greater London."
						/>
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
						css={button}
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
