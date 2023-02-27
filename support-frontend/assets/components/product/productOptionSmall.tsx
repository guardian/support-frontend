import { css, ThemeProvider } from '@emotion/react';
import { brand, from, space, textSans } from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
} from '@guardian/source-react-components';
import type { ReactNode } from 'react';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

export type ProductSmall = {
	offerCopy: string;
	priceCopy: ReactNode;
	buttonCopy: string;
	href: string;
	onClick: () => void;
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
			<ThemeProvider theme={buttonThemeReaderRevenue}>
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
