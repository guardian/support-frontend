import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { PageScaffold } from 'components/page/pageScaffold';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { background } from './colours';
import ObserverHeader from './ObserverHeader';

const secureTransactionIndicator = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const darkBackgroundContainerMobile = css`
	display: flex;
	background-color: ${background};
	${until.tablet} {
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans17};
	padding-top: ${space[2]}px;
`;

export default function ObserverPageLayout({
	children,
	noBorders = false,
}: {
	children: ReactNode;
	noBorders?: boolean;
	noFooterLinks?: boolean;
}) {
	return (
		<PageScaffold header={<ObserverHeader />} footer={<></>}>
			{noBorders ? (
				<Container cssOverrides={darkBackgroundContainerMobile}>
					{children}
				</Container>
			) : (
				<Container
					sideBorders
					topBorder
					cssOverrides={darkBackgroundContainerMobile}
				>
					<Columns cssOverrides={columns} collapseUntil="tablet">
						<Column span={[0, 2, 2, 3, 4]}></Column>
						<Column span={[1, 8, 8, 8, 8]}>
							<SecureTransactionIndicator
								align="center"
								theme="dark"
								cssOverrides={secureTransactionIndicator}
							/>
							{children}
						</Column>
					</Columns>
				</Container>
			)}
		</PageScaffold>
	);
}
