import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { ReactNode } from 'react';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { OnboardingProductKey } from 'pages/[countryGroupId]/components/onboardingComponent';
import OnboardingHeading from './heading';
import type { OnboardingFlow, OnboardingFlowStep } from './onboardingTypes';

const greyBackgroundContainer = css`
	display: flex;
	background-color: ${palette.neutral[93]};
`;

const contentColumnStyles = css`
	margin: auto;
`;

interface OnboardingLayoutProps {
	children: ReactNode;
	onboardingStep: OnboardingFlowStep;
	flow: OnboardingFlow;
	scrollToTopRef: React.RefObject<HTMLDivElement>;
	landingPageSettings?: LandingPageVariant;
	productKey?: OnboardingProductKey;
}

function OnboardingLayout({
	children,
	onboardingStep,
	flow,
	scrollToTopRef,
	landingPageSettings,
	productKey,
}: OnboardingLayoutProps) {
	return (
		<>
			<div ref={scrollToTopRef} />
			<PageScaffold
				header={<Header />}
				footer={
					<FooterWithContents>
						<FooterLinks />
					</FooterWithContents>
				}
			>
				<OnboardingHeading
					onboardingStep={onboardingStep}
					flow={flow}
					landingPageSettings={landingPageSettings}
					productKey={productKey}
				/>
				<Container sideBorders cssOverrides={greyBackgroundContainer}>
					<Columns collapseUntil="tablet">
						<Column cssOverrides={contentColumnStyles} span={[1, 10, 8]}>
							{children}
						</Column>
					</Columns>
				</Container>
			</PageScaffold>
		</>
	);
}

export default OnboardingLayout;
