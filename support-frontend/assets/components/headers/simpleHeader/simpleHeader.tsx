import { css } from '@emotion/react';
import {
	from,
	neutral,
  palette,
	space,
	visuallyHidden,
} from '@guardian/source/foundations';
import {
	Column,
	Columns,
	SvgGuardianLogo,
} from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { Container } from 'components/layout/container';

const logoContainer = css`
	display: flex;
	justify-content: flex-end;
	margin-top: 6px;
	margin-bottom: 15px;
	height: 44px;

	${from.desktop} {
		margin-top: ${space[2]}px;
		height: 100px;
	}

	svg {
		height: 100%;
	}
`;

type HeaderProps = {
	children?: ReactNode;
};

export function Header({ children }: HeaderProps): JSX.Element {
	return (
		<header>
			<Container backgroundColor={palette.brand[400]}>
				<Columns>
					<Column>{children}</Column>
					<Column span={[2, 3, 4]}>
						<a href="https://www.theguardian.com" css={logoContainer}>
							<div
								css={css`
									${visuallyHidden};
								`}
							>
								Return to the Guardian
							</div>
							<SvgGuardianLogo textColor={neutral[100]} />
						</a>
					</Column>
					{/* Only show at wide breakpoint */}
					<Column span={[0, 0, 0, 0, 1]}></Column>
				</Columns>
			</Container>
		</header>
	);
}
