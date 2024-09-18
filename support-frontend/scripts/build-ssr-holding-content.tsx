import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { css, Global } from '@emotion/react';
import {
	brand,
	from,
	neutral,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { renderToString } from 'react-dom/server';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { SkipLink } from 'components/skipLink/skipLink';
import AnimatedDots from 'components/spinners/animatedDots';
import { PrerenderGlobalStyles } from 'helpers/rendering/prerenderGlobalStyles';
import { guardianFonts } from 'stylesheets/emotion/fonts';
import { reset } from 'stylesheets/emotion/reset';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

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
	background-color: ${brand[400]};

	& main {
		flex: 1;
		display: flex;
		flex-direction: column;
		& > :last-child {
			flex: 1;
		}
	}
`;

function Loading() {
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

const html = renderToString(<Loading />);
writeFileSync(
	resolve(__dirname, '../conf/ssr-cache/', `ssr-holding-content.html`),
	html,
	'utf8',
);
