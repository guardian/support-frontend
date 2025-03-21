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

const secureTransactionIndicator = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const darkBackgroundContainerMobile = css`
	display: flex;
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans17};
	padding-top: ${space[2]}px;
`;

type CheckoutLayoutProps = {
	children: ReactNode;
};

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
	return (
		<PageScaffold
			header={<Header></Header>}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading withTopBorder={true} />
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
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
		</PageScaffold>
	);
}
