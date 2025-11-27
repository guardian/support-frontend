import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import {
	LinkButton,
	Stack,
	SvgTickRound,
} from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { getHelpCentreUrl, getManageSubsUrl } from 'helpers/urls/externalLinks';
import { getBaseDomain } from 'helpers/urls/url';
import type { OnboardingProductKey } from 'pages/[countryGroupId]/components/onboardingComponent';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import ContentBox from '../contentBox';
import {
	benefitsItem,
	benefitsItemIcon,
	benefitsItemText,
	buttonOverrides,
	descriptions,
	headings,
	heroContainer,
	newslettersAppUsageInformation,
	separator,
} from './sectionsStyles';

const heroAspectRatio = css`
	aspect-ratio: 21 / 9;
`;

const linkStyle = css`
	color: ${palette.brand[500]};
	text-decoration: underline;
`;

const completedStack = css`
	margin-top: ${space[5]}px;
	position: relative;
	z-index: 1;
`;

const completedStackPadding = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[3]}px;
	}
`;

export function OnboardingCompleted({
	productKey,
	landingPageSettings,
}: {
	productKey?: OnboardingProductKey;
	landingPageSettings: LandingPageVariant;
}) {
	const productSettings =
		productKey && landingPageSettings.products[productKey];

	const { windowWidthIsLessThan } = useWindowWidth();

	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox removePadding>
				<div css={[heroContainer, heroAspectRatio]}>
					<GridImage
						gridId={'onboardingCompletedHero'}
						srcSizes={[2000, 1000, 500]}
						sizes="(max-width: 739px) 140px, 422px"
						imgType="png"
						altText={'Onboarding completed hero'}
					/>
				</div>
				<Stack space={5} cssOverrides={completedStackPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Thank you</h1>
						<p css={descriptions}>
							In a world increasingly shaped by disinformation and division, the
							Guardian’s trusted journalism stands as a powerful counterforce.
						</p>
						<p css={descriptions}>
							Your support makes that possible, and now that your All-access
							digital subscription is active, you have access to:
						</p>
					</Stack>
					<ul>
						{productSettings?.benefits.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-summary-benefit-${benefit.copy}`}
							>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size={windowWidthIsLessThan('desktop') ? 'small' : 'medium'}
										theme={{ fill: palette.brand[500] }}
									/>
								</div>
								<span css={benefitsItemText}>{benefit.copy}</span>
							</li>
						))}
					</ul>
					<LinkButton
						priority="primary"
						cssOverrides={[buttonOverrides]}
						href={`https://${getBaseDomain()}`}
					>
						Continue to the Guardian
					</LinkButton>
				</Stack>
			</ContentBox>
			<p css={newslettersAppUsageInformation}>
				Need help? Visit our{' '}
				<a href={getHelpCentreUrl()} css={linkStyle}>
					Help Centre
				</a>{' '}
				to find the FAQs and contact options. You can manage your subscription
				anytime in{' '}
				<a href={getManageSubsUrl()} css={linkStyle}>
					Manage my account
				</a>
				.
			</p>
		</Stack>
	);
}
