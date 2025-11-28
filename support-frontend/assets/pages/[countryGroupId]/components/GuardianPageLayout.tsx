import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { ReactNode } from 'react';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import ThankYouFooter from 'pages/[countryGroupId]/thankYou/components/thankYouFooter';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

const secureTransactionIndicator = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const containerStyles = css`
	display: flex;
	background-color: ${palette.neutral[97]};
`;

const containerMobileStyles = css`
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const noBordersContainerMobileStyles = css`
	${until.tablet} {
		background-color: ${palette.neutral[100]};
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans17};
	padding-top: ${space[2]}px;
`;

export type PageLayoutProps = {
	children: ReactNode;
	borderBox: boolean;
	observerPrint?: ObserverPrint;
	noFooterLinks?: boolean;
};

export default function GuardianPageLayout({
	children,
	observerPrint,
	borderBox,
	noFooterLinks = false,
}: PageLayoutProps) {
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					{noFooterLinks ? (
						<ThankYouFooter observerPrint={observerPrint} />
					) : (
						<FooterLinks />
					)}
				</FooterWithContents>
			}
		>
			{borderBox ? (
				<>
					<CheckoutHeading withTopBorder={true} />
					<Container
						sideBorders
						cssOverrides={[containerStyles, containerMobileStyles]}
					>
						<Columns cssOverrides={columns} collapseUntil="tablet">
							<Column span={[0, 2, 2, 3, 4]}></Column>
							<Column span={[1, 8, 8, 8, 8]}>
								<SecureTransactionIndicator
									align="center"
									theme="light"
									cssOverrides={secureTransactionIndicator}
								/>
								{children}
							</Column>
						</Columns>
					</Container>
				</>
			) : (
				<Container
					cssOverrides={[containerStyles, noBordersContainerMobileStyles]}
				>
					{children}
				</Container>
			)}
		</PageScaffold>
	);
}
