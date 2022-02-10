import { css, ThemeProvider } from '@emotion/react';
import {
	between,
	brandAlt,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
} from '@guardian/source-react-components';
import type { Node } from 'react';
import { useEffect } from 'react';
import { useHasBeenSeen } from 'helpers/customHooks/useHasBeenSeen';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly } from 'helpers/productPrice/billingPeriods';

export type Product = {
	title: string;
	price: string;
	children?: Node;
	offerCopy?: Node;
	priceCopy: Node;
	buttonCopy: string;
	href: string;
	onClick: (...args: any[]) => any;
	onView: (...args: any[]) => any;
	label?: string;
	cssOverrides?: string;
	billingPeriod?: BillingPeriod;
};
const productOption = css`
	${textSans.medium()}
	position: relative;
	display: grid;
	grid-template-columns: 2fr 1fr;
	grid-template-rows: min-content 1fr min-content;
	grid-template-areas:
		'. priceCopy'
		'. priceCopy'
		'button button';
	width: 100%;
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	padding: ${space[3]}px;
	${from.tablet} {
		min-height: 272px;
		width: 300px;
		grid-template-columns: none;
		grid-template-rows: 48px minmax(66px, max-content) minmax(100px, 1fr) 72px;
		grid-template-areas: none;
	}
`;
const productOptionUnderline = css`
	${from.tablet} {
		border-bottom: 1px solid ${neutral[86]};
	}
`;
const productOptionVerticalLine = css`
	${until.tablet} {
		border-right: 1px solid ${neutral[86]};
		margin-right: ${space[3]}px;
		padding-right: ${space[3]}px;
	}
`;
const productOptionTitle = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})};
	padding-bottom: ${space[5]}px;
	${from.tablet} {
		margin-bottom: ${space[2]}px;
	}
	${between.tablet.and.leftCol} {
		${headline.xxxsmall({
			fontWeight: 'bold',
		})};
	}
`;
const productOptionOfferCopy = css`
	${textSans.medium()};
	${from.tablet} {
		height: 100%;
		padding-bottom: ${space[2]}px;
	}
	${between.tablet.and.leftCol} {
		${textSans.small()};
	}
`;
const productOptionPrice = css`
	display: block;
	padding-bottom: ${space[5]}px;
	${headline.xsmall({
		fontWeight: 'bold',
	})};
	${between.tablet.and.leftCol} {
		${headline.small({
			fontWeight: 'bold',
		})};
	}
	${from.leftCol} {
		${headline.large({
			fontWeight: 'bold',
		})};
		padding-bottom: 0;
	}
`;
const productOptionPriceCopy = css`
	${textSans.xsmall()};
	${from.tablet} {
		height: 100%;
		margin-bottom: ${space[4]}px;
	}
	${between.phablet.and.leftCol} {
		${textSans.small()};
	}
	${from.leftCol} {
		${textSans.medium()};
	}
`;
const productOptionHighlight = css`
	background-color: ${brandAlt[400]};
	color: ${neutral[7]};
	position: absolute;
	left: 0;
	top: 1px;
	transform: translateY(-100%);
	text-align: center;
	padding: ${space[2]}px ${space[3]}px;
	${headline.xxsmall({
		fontWeight: 'bold',
	})};
`;
const buttonDiv = css`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	grid-area: button;
	padding: ${space[3]}px 0;
	${between.mobileLandscape.and.tablet} {
		grid-area: 3 / 1 / span 1 / span 1;
		border-right: 1px solid ${neutral[86]};
		margin-right: ${space[3]}px;
		padding-right: ${space[3]}px;
	}
	${from.tablet} {
		grid-area: auto;
		padding: 0;
	}
`;
const button = css`
	display: flex;
	justify-content: center;
	${from.mobileLandscape} {
		grid-area: priceCopy;
		display: inline-flex;
	}
	${from.tablet} {
		grid-area: auto;
		display: inline-flex;
	}
`;
const priceCopyGridPlacement = css`
	${until.tablet} {
		grid-area: priceCopy;
	}
`;

function ProductOption(props: Product) {
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
			css={[productOption, props.cssOverrides, productOptionMargin]}
		>
			<div css={productOptionVerticalLine}>
				<h3 css={[productOptionTitle, productOptionUnderline]}>
					{props.title}
				</h3>
				{props.label && <span css={productOptionHighlight}>{props.label}</span>}
				{props.children && props.children}
			</div>
			<div css={productOptionVerticalLine}>
				<p css={[productOptionOfferCopy, productOptionUnderline]}>
					{props.offerCopy}
				</p>
			</div>
			<div css={priceCopyGridPlacement}>
				{/* role="text" is non-standardised but works in Safari. Reads the whole section as one text element */}
				{/* eslint-disable-next-line jsx-a11y/aria-role */}
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
