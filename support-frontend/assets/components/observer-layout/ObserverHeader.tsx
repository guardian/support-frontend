import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';
import { background } from './colours';
import { ObserverLogo } from './ObserverLogo';

const logoContainer = css`
	display: flex;
	justify-content: center;
	text-decoration: none;
	margin: ${space[6]}px 0 ${space[3]}px 0;

	${from.desktop} {
		margin: ${space[12]}px 0 ${space[8]}px 0;
	}
`;

const logo = css`
	width: 246px;

	${from.desktop} {
		width: 382px;
	}
`;

export default function ObserverHeader(): JSX.Element {
	return (
		<header>
			<Container backgroundColor={background}>
				<Columns>
					<Column>
						<div css={logoContainer}>
							<h1 css={logo}>
								<a href="https://www.observer.co.uk">
									<ObserverLogo />
								</a>
							</h1>
						</div>
					</Column>
				</Columns>
			</Container>
		</header>
	);
}
