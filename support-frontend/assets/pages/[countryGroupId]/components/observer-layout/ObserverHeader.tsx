import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';

const logoContainer = css`
	display: flex;
	justify-content: center;
	align-items: center;
	text-decoration: none;
	color: black;
	&:visited {
		font: black;
	}
	h1 {
		font-size: 42px;
		text-transform: uppercase;
		font-weight: bold;
	}

	${from.desktop} {
		margin-top: ${space[2]}px;
		height: 100px;
	}

	svg {
		height: 100%;
	}
`;

export default function ObserverHeader(): JSX.Element {
	return (
		<header>
			<Container backgroundColor="#F6F6F6">
				<Columns>
					<Column>
						<a href="https://www.observer.com" css={logoContainer}>
							<h1>the observer</h1>
						</a>
					</Column>
				</Columns>
			</Container>
		</header>
	);
}
