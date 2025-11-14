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
import type { OnboardingProps } from 'pages/[countryGroupId]/components/onboardingComponent';
import type { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import OnboardingHeading from './heading';

const greyBackgroundContainer = css`
	display: flex;
	background-color: ${palette.neutral[93]};
`;

const contentColumnStyles = css`
	margin: auto;
`;

interface OnboardingLayoutProps extends OnboardingProps {
	children: ReactNode;
	onboardingStep: OnboardingSteps;
}

function OnboardingLayout({
	children,
	onboardingStep,
	...onboardingProps
}: OnboardingLayoutProps) {
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<FooterLinks />
				</FooterWithContents>
			}
		>
			<OnboardingHeading onboardingStep={onboardingStep} {...onboardingProps} />
			<Container sideBorders cssOverrides={greyBackgroundContainer}>
				<Columns collapseUntil="tablet">
					<Column cssOverrides={contentColumnStyles} span={[1, 10, 8]}>
						{children}
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}

export default OnboardingLayout;
