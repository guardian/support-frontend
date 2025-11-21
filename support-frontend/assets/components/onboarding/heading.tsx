import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	between,
	from,
	headlineMedium20,
	headlineMedium24,
	headlineMedium28,
	headlineMedium34,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { useMemo } from 'preact/hooks';
import GridImage from 'components/gridImage/gridImage';
import { getThankYouOrder } from 'pages/[countryGroupId]/checkout/helpers/sessionStorage';
import type { OnboardingProps } from 'pages/[countryGroupId]/components/onboardingComponent';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { heroContainer } from './sections/sectionsStyles';

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

const containerAbsolute = css`
	position: absolute;
	left: 0;
	right: 0;
`;

const headerSpacerDiv = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`;

const thankYouHeading = css`
	align-self: flex-start;
	margin-bottom: ${space[1]}px;
	margin-top: ${space[1]}px;

	color: white;
	${headlineMedium20}

	${from.mobileMedium} {
		${headlineMedium24}
	}

	${between.mobileMedium.and.mobileLandscape} {
		padding: 0 ${space[3]}px;
	}

	${between.mobileLandscape.and.tablet} {
		padding: 0 ${space[5]}px;
	}

	${from.mobileLandscape} {
		${headlineMedium28}
	}

	${from.tablet} {
		margin-top: ${space[2]}px;
		${headlineMedium34}
	}
`;

const thankYouSubtext = css`
	align-self: flex-start;
	margin: 0;
	margin-bottom: ${space[2]}px;

	${textSans17}
	color: white;

	${from.mobileMedium} {
		margin-bottom: ${space[3]}px;
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

interface OnboardingHeadingProps extends OnboardingProps {
	onboardingStep: OnboardingSteps;
}

function OnboardingHeading({
	onboardingStep,
	landingPageSettings,
	productKey,
}: OnboardingHeadingProps) {
	const order = getThankYouOrder();
	const productSettings =
		productKey && landingPageSettings.products[productKey];

	const { windowWidthIsGreaterThan, windowWidthIsLessThan } = useWindowWidth();

	const ONBOARDING_STEP_CONTENT_MAP = useMemo<
		Record<
			OnboardingSteps,
			{
				heading?: string;
				subtext?: string;
				gridId?: string;
				altText?: string;
				aspectRatio: SerializedStyles;
			}
		>
	>(() => {
		// Non breaking hyphen
		const allAccessTitle =
			productSettings?.title === 'All-access digital'
				? `All\u2011access digital`
				: productSettings?.title;

		return {
			[OnboardingSteps.Summary]: {
				heading: `Thank you ${
					order?.firstName && order.firstName + ' '
				}for subscribing to ${allAccessTitle}`,
				subtext:
					"You've just joined over 1.3m others who support independent journalism.",
				gridId: 'onboardingSummaryHero',
				altText: 'Onboarding summary hero holding The Guardian logo',
				aspectRatio: css`
					aspect-ratio: 21 / 9;
				`,
			},
			[OnboardingSteps.GuardianApp]: {
				gridId: windowWidthIsGreaterThan('tablet')
					? 'onboardingGuardianAppHero'
					: 'onboardingGuardianAppHeroMobile',
				altText: 'Onboarding guardian app hero showing multiple articles',
				aspectRatio: css`
					aspect-ratio: 3 / 2;
				`,
			},
			[OnboardingSteps.FeastApp]: {
				gridId: windowWidthIsGreaterThan('tablet')
					? 'onboardingFeastAppHero'
					: 'onboardingFeastAppHeroMobile',
				altText: 'Onboarding feast app hero showing multiple articles',
				aspectRatio: css`
					aspect-ratio: 3 / 2;
				`,
			},
			[OnboardingSteps.Completed]: {
				aspectRatio: css`
					aspect-ratio: 3 / 2;
				`,
			},
		};
	}, [order, windowWidthIsGreaterThan]);

	if (
		onboardingStep === OnboardingSteps.Completed &&
		windowWidthIsLessThan('tablet')
	) {
		return null;
	}

	return (
		<Container
			sideBorders
			topBorder
			borderColor={palette.brand[600]}
			backgroundColor={palette.brand[400]}
			cssOverrides={[
				containerNoPaddingStyles,
				...(onboardingStep === OnboardingSteps.Completed
					? [containerAbsolute]
					: []),
			]}
		>
			<Columns collapseUntil="tablet">
				<Column cssOverrides={contentColumnStyles} span={[1, 10, 8]}>
					<div css={headerSpacerDiv}>
						<div
							css={[
								heroContainer,
								ONBOARDING_STEP_CONTENT_MAP[onboardingStep].aspectRatio,
							]}
						>
							{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].gridId && (
								<GridImage
									gridId={ONBOARDING_STEP_CONTENT_MAP[onboardingStep].gridId}
									srcSizes={[2000]}
									sizes="(max-width: 739px) 140px, 422px"
									imgType="png"
									altText={ONBOARDING_STEP_CONTENT_MAP[onboardingStep].altText}
								/>
							)}
						</div>
						{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].heading && (
							<h1 css={thankYouHeading}>
								{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].heading}
							</h1>
						)}
						{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].subtext && (
							<p css={thankYouSubtext}>
								{ONBOARDING_STEP_CONTENT_MAP[onboardingStep].subtext}
							</p>
						)}
					</div>
				</Column>
			</Columns>
		</Container>
	);
}

export default OnboardingHeading;
