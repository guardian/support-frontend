import { css } from '@emotion/react';
import { from, neutral, space, textSans } from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PaymentFrequencyTabs } from 'components/paymentFrequencyTabs/paymentFrequenncyTabs';
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
import { PatronsMessage } from './components/patronsMessage';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.mobileLandscape} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-bottom: ${space[24]}px;
		padding-top: ${space[6]}px;
	}
`;

// TODO: these are purely for demo purposes, delete once the boxes have real content in
const smallDemoBox = css`
	min-height: 200px;
`;

const largeDemoBox = css`
	min-height: 400px;
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

export function SupporterPlusLandingPage(): JSX.Element {
	const heading = <LandingPageHeading />;

	return (
		<PageScaffold
			id="supporter-plus-landing"
			header={
				<Header>
					<Hide from="desktop">
						<CountryGroupSwitcher {...countrySwitcherProps} />
					</Hide>
				</Header>
			}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<Nav {...countrySwitcherProps} />
			<CheckoutHeading heading={heading}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
					ex justo, varius ut porttitor tristique, rhoncus quis dolor.
				</p>
			</CheckoutHeading>
			<Container sideBorders backgroundColor={neutral[97]}>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">{heading}</Hide>
						<Box>
							<PaymentFrequencyTabsContainer
								render={(tabProps) => (
									<PaymentFrequencyTabs
										{...tabProps}
										renderTabContent={(tabId) => (
											<BoxContents>
												<p css={smallDemoBox}>Amount selection for {tabId}</p>
											</BoxContents>
										)}
									/>
								)}
							/>
						</Box>
						<Box>
							<BoxContents>
								<p css={largeDemoBox}>Personal details and payment</p>
							</BoxContents>
						</Box>
						<Box>
							<BoxContents>
								<PatronsMessage />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}
