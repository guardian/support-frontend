import { css, Global } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { PrerenderGlobalStyles } from '../../helpers/rendering/prerenderGlobalStyles';
import { guardianFonts } from '../../stylesheets/emotion/fonts';
import { reset } from '../../stylesheets/emotion/reset';
import { CheckoutHeading } from '../checkoutHeading/checkoutHeading';
import { Header } from '../headers/simpleHeader/simpleHeader';
import { Container } from '../layout/container';
import { SkipLink } from '../skipLink/skipLink';
import AnimatedDots from '../spinners/animatedDots';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans17};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.tablet} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const container = css`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	max-width: 100%;
	overflow-x: hidden;
	background-color: ${palette.brand[400]};

	& main {
		flex: 1;
		display: flex;
		flex-direction: column;
		& > :last-child {
			flex: 1;
		}
	}
`;

export function GuardianHoldingContent() {
	return (
		<div css={container}>
			<Global styles={[reset, guardianFonts]} />
			<nav aria-label="Skip to section">
				<SkipLink id="maincontent" label="Skip to main content" />
				<SkipLink id="navigation" label="Skip to navigation" />
			</nav>

			<Header />
			<main role="main" id="maincontent">
				<PrerenderGlobalStyles />
				<CheckoutHeading />
				<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
					<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
						<Column span={[0, 2, 5]}></Column>
						<Column span={[1, 8, 7]}></Column>
					</Columns>
				</Container>
				<div>
					<p>Loading…</p>
					<AnimatedDots appearance="dark" />
				</div>
			</main>
			<FooterWithContents>
				<FooterLinks />
			</FooterWithContents>
		</div>
	);
}
