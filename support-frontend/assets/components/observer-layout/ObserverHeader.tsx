import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';
import { ObserverLogo } from './ObserverLogo';
import { observerColours } from './styles';

const logoContainer = css`
	display: flex;
	justify-content: center;
	text-decoration: none;
	margin: ${space[6]}px 0 ${space[4]}px 0;

	${from.desktop} {
		margin: ${space[12]}px 0 ${space[8]}px 0;
	}
`;

const logo = css`
	width: 228px;

	${from.desktop} {
		width: 382px;
	}
`;

export default function ObserverHeader(): JSX.Element {
	return (
		<header>
			<Container backgroundColor={observerColours.pageBackgroundColor}>
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
