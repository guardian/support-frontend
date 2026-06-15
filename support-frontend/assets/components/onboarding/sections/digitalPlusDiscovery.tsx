import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSansBold17,
	textSansBold20,
} from '@guardian/source/foundations';
import { Button, Stack } from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import {
	OnboardingInviteeSteps,
	OnboardingSteps,
} from 'components/onboarding/onboardingSteps';
import type { HandleStepNavigationFunction } from 'components/onboarding/onboardingTypes';
import { getBaseDomain } from 'helpers/urls/url';
import { ONBOARDING_EDITIONS_APP, OnboardingAppBadgesDownload } from '../appBadgesDownload/badgesDownload';
import ContentBox from '../contentBox';
import {
	buttonOverrides,
	descriptions,
	headings,
	heroContainer,
} from './sectionsStyles';

const benefitCard = css`
	border-radius: ${space[3]}px;
	margin-top: ${space[5]}px;
	border: 1px solid ${neutral[86]};
`;

const benefitCardContent = css`
	padding: ${space[4]}px;

	${from.tablet} {
		padding: ${space[4]}px;
	}
`;

const feastCard = css`
	background-color: #e1e5d5;
`;

const editionsCard = css`
	background-color: #f3e6e9;
`;

const archivesCard = css`
	background-color: #1e3e72;
	color: ${neutral[100]};
`;

const benefitCardHeading = css`
	${textSansBold17}
	margin: 0;
	margin-bottom: ${space[1]}px;

	${from.tablet} {
		${textSansBold20}
	}
`;

const benefitCardImage = css`
	aspect-ratio: 16 / 9;
`;

const archivesLink = css`
	color: ${palette.brand[500]};
	text-decoration: underline;
`;

interface OnboardingDigitalPlusDiscoveryProps {
	handleStepNavigation: HandleStepNavigationFunction;
}

export function OnboardingDigitalPlusDiscovery({
	handleStepNavigation,
}: OnboardingDigitalPlusDiscoveryProps) {
	return (
		<Stack
			space={5}
			cssOverrides={css`
				margin-top: ${space[5]}px;
			`}
		>
			<ContentBox>
				<Stack space={2}>
					<h1 css={headings}>More of the Guardian with Digital plus</h1>
					<p css={descriptions}>
						Your Digital plus subscription includes access to the Feast app, The
						Long Read, Guardian Weekly, and the Guardian Archives.
					</p>

					<div css={[benefitCard, css`margin-top: ${space[8]}px;`]}>
						<div css={[heroContainer, benefitCardImage, feastCard]}>
							<GridImage
								gridId="onboardingFeastAppHeroMobile"
								srcSizes={[1000]}
								sizes="100vw"
								imgType="png"
								altText="Guardian Feast app"
							/>
						</div>
						<div css={benefitCardContent}>
							<h2 css={benefitCardHeading}>Discover the Guardian Feast app</h2>
							<p css={descriptions}>
								Level up your cooking with more than 6,000 recipes and smart,
								exclusive cooking features.
							</p>
							<OnboardingAppBadgesDownload
								onboardingStep={OnboardingSteps.FeastApp}
							/>
						</div>
					</div>

					<div css={[benefitCard]}>
						<div css={[heroContainer, benefitCardImage, editionsCard]}>
							{/* TODO: replace with final Editions app asset */}
							<GridImage
								gridId="onboardingEditionsAppHeroMobile"
								srcSizes={[1000]}
								sizes="100vw"
								imgType="png"
								altText="Guardian Editions app"
							/>
						</div>
						<div css={benefitCardContent}>
							<h2 css={benefitCardHeading}>Explore the Guardian Editions app</h2>
							<p css={descriptions}>
								Read the digital newspaper every day, plus access to The Long Read
								and Guardian Weekly e-magazines.
							</p>
							<OnboardingAppBadgesDownload
								onboardingStep={ONBOARDING_EDITIONS_APP}
							/>
						</div>
					</div>

					<div css={[benefitCard]}>
						<div css={[heroContainer, benefitCardImage, archivesCard]}>
							{/* TODO: replace with final Archives asset */}
							<GridImage
								gridId="onboardingEditionsAppHeroMobile"
								srcSizes={[1000]}
								sizes="100vw"
								imgType="png"
								altText="Guardian Archives"
							/>
						</div>
						<div css={benefitCardContent}>
							<h2 css={benefitCardHeading}>
								Journey through the Guardian Archives
							</h2>
							<p css={descriptions}>
								Explore over 200 years of history as reported by the Guardian and
								Observer. You can find the Archives in{' '}
								<a
									href={`https://manage.${getBaseDomain()}`}
									css={archivesLink}
								>
									your account overview
								</a>
								.
							</p>
						</div>
					</div>

					<Stack
						space={0}
						cssOverrides={css`
							margin-top: ${space[8]}px;
						`}
					>
						<Button
							priority="primary"
							cssOverrides={buttonOverrides}
							onClick={() =>
								handleStepNavigation(OnboardingInviteeSteps.Completed)
							}
						>
							Continue
						</Button>
						<Button
							priority="subdued"
							cssOverrides={buttonOverrides}
							onClick={() =>
								handleStepNavigation(OnboardingInviteeSteps.GuardianApp)
							}
						>
							Back
						</Button>
					</Stack>
				</Stack>
			</ContentBox>
		</Stack>
	);
}
