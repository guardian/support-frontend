import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { Button, LinkButton, Stack } from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import { OnboardingSteps } from 'components/onboarding/onboardingSteps';
import type { HandleStepNavigationFunction } from 'components/onboarding/onboardingTypes';
import { getManageExtraAccountsUrl } from 'helpers/urls/externalLinks';
import ContentBox from '../contentBox';
import {
	buttonOverrides,
	completedStack,
	descriptions,
	headings,
	heroContainer,
	separator,
} from './sectionsStyles';

const heroAspectRatio = css`
	aspect-ratio: 16 / 9;
`;

const completedStackPadding = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[3]}px;
	}
`;

export function OnboardingShareAccess({
	handleStepNavigation,
}: {
	handleStepNavigation: HandleStepNavigationFunction;
}) {
	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox removePadding>
				<div css={[heroContainer, heroAspectRatio]}>
					<GridImage
						gridId="placeholder_16x9"
						srcSizes={[1000, 500]}
						sizes="(max-width: 739px) 140px, 422px"
						imgType="png"
						altText=""
					/>
				</div>
				<Stack space={5} cssOverrides={completedStackPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Share your Digital plus access</h1>
						<p css={descriptions}>
							You can invite up to <strong>3 people</strong> to share your
							subscription and join you in enjoying unlimited digital access and
							reading across the Guardian.
						</p>
					</Stack>
					<Stack space={0}>
						<LinkButton
							priority="primary"
							cssOverrides={buttonOverrides}
							href={getManageExtraAccountsUrl()}
						>
							Start sharing
						</LinkButton>
						<Button
							priority="subdued"
							cssOverrides={buttonOverrides}
							onClick={() => handleStepNavigation(OnboardingSteps.Completed)}
						>
							I’ll do this later
						</Button>
					</Stack>
				</Stack>
			</ContentBox>
		</Stack>
	);
}
