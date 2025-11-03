import { css } from '@emotion/react';
import {
	between,
	from,
	palette,
	space,
	textSans17,
	textSansBold20,
	textSansBold24,
	textSansBold28,
	textSansBold34,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';

const contentColumnStyles = css`
	margin: auto;
`;

const containerNoPaddingStyles = css`
	${between.mobileMedium.and.tablet} {
		& > div {
			padding: 0;
		}
	}
`;

const headerSpacerDiv = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: ${space[2]}px;
`;

const heroContainer = css`
	width: 100%;
	aspect-ratio: 21 / 9;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;

	img {
		height: 100%;
	}
`;

const thankYouHeading = css`
	align-self: flex-start;
	margin-bottom: ${space[1]}px;
	margin-top: ${space[1]}px;

	color: white;
	${textSansBold20}

	${from.mobileMedium} {
		${textSansBold24}
	}

	${between.mobileMedium.and.mobileLandscape} {
		padding: 0 ${space[3]}px;
	}

	${between.mobileLandscape.and.tablet} {
		padding: 0 ${space[5]}px;
	}

	${from.mobileLandscape} {
		${textSansBold28}
	}

	${from.tablet} {
		margin-top: ${space[2]}px;
		${textSansBold34}
	}
`;

const thankYouSubtext = css`
	align-self: flex-start;
	margin: 0;

	${textSans17}
	color: white;

	${from.mobileMedium} {
		margin-bottom: ${space[1]}px;
	}

	${between.mobileMedium.and.mobileLandscape} {
		padding: 0 ${space[3]}px;
	}

	${between.mobileLandscape.and.tablet} {
		padding: 0 ${space[5]}px;
	}

	${from.tablet} {
		margin-bottom: ${space[3]}px;
	}

	${from.desktop} {
		margin-bottom: ${space[4]}px;
	}
`;

interface OnboardingHeadingProps extends CSSOverridable {
	onboardingStep: OnboardingSteps;
}

function OnboardingHeading({ onboardingStep }: OnboardingHeadingProps) {
	// --------------------------- //
	// TODO: Dynamically generated based on Products and User profile
	const ONBOARDING_STEP_CONTENT_MAP: Record<
		OnboardingSteps,
		{ headingHero: string; heading: string; subtext: string }
	> = {
		[OnboardingSteps.Summary]: {
			headingHero: 'aspect ratio 21:9',
			heading: 'Thank you for subscribing to All-access digital',
			subtext:
				"You've just joined over 1.3m others who support independent journalism.",
		},
		[OnboardingSteps.GuardianApp]: {
			headingHero: 'Placeholder',
			heading: 'Placeholder',
			subtext: 'Placeholder',
		},
		[OnboardingSteps.FeastApp]: {
			headingHero: 'Placeholder',
			heading: 'Placeholder',
			subtext: 'Placeholder',
		},
		[OnboardingSteps.ThankYou]: {
			headingHero: 'Placeholder',
			heading: 'Placeholder',
			subtext: 'Placeholder',
		},
	};
	// --------------------------- //

	return (
		<Container
			sideBorders
			topBorder
			borderColor={palette.brand[600]}
			backgroundColor={palette.brand[400]}
			cssOverrides={containerNoPaddingStyles}
		>
			<Columns collapseUntil="tablet">
				<Column cssOverrides={contentColumnStyles} span={[1, 10, 8]}>
					<div css={headerSpacerDiv}>
						<div css={heroContainer}>
							<GridImage
								gridId="onboardingSummaryHero"
								srcSizes={[2000, 1000, 500]}
								sizes="(max-width: 739px) 140px, 422px"
								imgType="png"
								altText="Onboarding hero"
							/>
						</div>
						<h1 css={thankYouHeading}>
							{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].heading}
						</h1>
						<p css={thankYouSubtext}>
							{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].subtext}
						</p>
					</div>
				</Column>
			</Columns>
		</Container>
	);
}

export default OnboardingHeading;
