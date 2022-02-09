import { css } from '@emotion/core';
import { buttonReaderRevenue, LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { ThemeProvider } from 'emotion-theming';
import type { ReactNode } from 'react';
import React from 'react';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

export type ProductSmall = {
	offerCopy: string;
	priceCopy: ReactNode;
	buttonCopy: string;
	href: string;
	onClick: (...args: any[]) => any;
	cssOverrides?: string | string[];
	billingPeriod: BillingPeriod;
};
const productOptionSmallStyles = css`
	color: inherit;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	padding: ${space[1]}px 0 ${space[6]}px;
	padding-right: ${space[4]}px;
	max-width: 330px;

	&:not(:last-of-type) {
		border-bottom: 1px solid ${brand[600]};
	}

	${from.tablet} {
		padding-top: ${space[6]}px;
	}
`;
const offerCopyStyles = css`
	${textSans.medium({
		fontWeight: 'bold',
	})}
	margin-bottom: ${space[2]}px;
`;
const priceCopyStyles = css`
	${textSans.xsmall()}
	margin-top: ${space[2]}px;
`;
const buttonStyles = css`
	justify-content: center;
`;

function ProductOptionSmall(props: ProductSmall): JSX.Element {
	return (
		<span css={[productOptionSmallStyles, props.cssOverrides]}>
			<p css={offerCopyStyles}>{props.offerCopy}</p>
			<ThemeProvider theme={buttonReaderRevenue}>
				<LinkButton
					css={buttonStyles}
					href={props.href}
					onClick={props.onClick}
				>
					{props.buttonCopy}
				</LinkButton>
			</ThemeProvider>
			<p css={priceCopyStyles}>{props.priceCopy}</p>
		</span>
	);
}

ProductOptionSmall.defaultProps = {
	offerCopy: '',
	cssOverrides: '',
};
export default ProductOptionSmall;
