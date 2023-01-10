import createCache from '@emotion/cache';
import { CacheProvider, css } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { from, neutral, space, textSans } from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { renderToString } from 'react-dom/server';
import { Box } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import GridImage from 'components/gridImage/gridImage';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { LandingPageHeading } from './components/landingPageHeading';

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

const subheading = css`
	font-weight: normal;
	padding-right: ${space[2]}px;
`;

const countrySwitcherProps: CountryGroupSwitcherProps = {
	countryGroupIds: [
		GBPCountries,
		UnitedStates,
		AUDCountries,
		EURCountries,
		NZDCountries,
		Canada,
		International,
	],
	selectedCountryGroup: GBPCountries,
	subPath: '/contribute',
};

const cache = createCache({
	key: 'ssr',
});
const emotionServer = createEmotionServer(cache);

function PreRenderSupporterPlusLandingPage(): JSX.Element {
	const heading = <LandingPageHeading />;

	return (
		<CacheProvider value={cache}>
			<PageScaffold
				id="supporter-plus-landing"
				header={
					<>
						<Header>
							<Hide from="desktop">
								<CountrySwitcherContainer>
									<CountryGroupSwitcher {...countrySwitcherProps} />
								</CountrySwitcherContainer>
							</Hide>
						</Header>
						<Nav {...countrySwitcherProps} />
					</>
				}
				footer={
					<FooterWithContents>
						<FooterLinks></FooterLinks>
					</FooterWithContents>
				}
			>
				<CheckoutHeading
					heading={heading}
					image={
						<GridImage
							gridId="supporterPlusLanding"
							srcSizes={[500]}
							sizes="500px"
							imgType="png"
							altText=""
						/>
					}
				>
					<p css={subheading}>
						As a reader-funded news organisation, we rely on your generosity.
						Please give what you can, so millions can benefit from quality
						reporting on the events shaping our world.
					</p>
				</CheckoutHeading>
				<Container sideBorders backgroundColor={neutral[97]}>
					<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
						<Column span={[0, 2, 5]}></Column>
						<Column span={[1, 8, 7]}>
							<Hide from="desktop">{heading}</Hide>
							<Box>
								<div></div>
							</Box>
							<Box>
								<div></div>
							</Box>
						</Column>
					</Columns>
				</Container>
			</PageScaffold>
		</CacheProvider>
	);
}

const html = renderToString(<PreRenderSupporterPlusLandingPage />);
const chunks = emotionServer.extractCriticalToChunks(html);
const styles = emotionServer.constructStyleTagsFromChunks(chunks);

export const supporterPlusLanding = `${styles}${html}`;
