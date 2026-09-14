import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { LinkButton, Stack } from '@guardian/source/react-components';
import { useRef } from 'preact/hooks';
import GridImage from 'components/gridImage/gridImage';
import { getBaseDomain } from 'helpers/urls/url';
import ContentBox from '../contentBox';
import OnboardingLayout from '../layout';
import { OnboardingInviteeSteps } from '../onboardingSteps';
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

	${from.tablet} {
		aspect-ratio: 20 / 9;
	}
`;

const contentPadding = css`
	padding: ${space[3]}px;
	padding-bottom: ${space[6]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[6]}px;
	}
`;

export function InvitationUnavailable() {
	const scrollToTopRef = useRef<HTMLDivElement>(null);

	return (
		<OnboardingLayout
			flow="invitee"
			scrollToTopRef={scrollToTopRef}
			onboardingStep={OnboardingInviteeSteps.CreateAccount}
		>
			<Stack space={5} cssOverrides={completedStack}>
				<ContentBox removePadding>
					<div css={[heroContainer, heroAspectRatio]}>
						<GridImage
							gridId="onboardingInviteeCreateAccountHero"
							srcSizes={[442]}
							sizes="442px"
							imgType="png"
							altText="Invitation unavailable hero"
						/>
					</div>

					<Stack space={5} cssOverrides={contentPadding}>
						<div css={separator} />
						<Stack space={2}>
							<h1 css={headings}>This invitation has expired</h1>
							<p css={descriptions}>
								This invitation can no longer be used to access this
								subscription. If you&apos;d still like to join, please ask the
								person who invited you to send a new invite.
							</p>
						</Stack>
						<LinkButton
							priority="primary"
							cssOverrides={[buttonOverrides]}
							href={`https://${getBaseDomain()}`}
						>
							Continue to the Guardian
						</LinkButton>
					</Stack>
				</ContentBox>
			</Stack>
		</OnboardingLayout>
	);
}
