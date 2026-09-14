import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { LinkButton, Stack } from '@guardian/source/react-components';
import { useRef } from 'preact/hooks';
import GridImage from 'components/gridImage/gridImage';
import { getSignoutUrl } from 'helpers/urls/externalLinks';
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

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[3]}px;
	}
`;

export function WrongEmail() {
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
							altText="Wrong email hero"
						/>
					</div>

					<Stack space={5} cssOverrides={contentPadding}>
						<div css={separator} />
						<Stack space={2}>
							<h1 css={headings}>
								You&apos;re signed in with the wrong email address
							</h1>
							<p css={descriptions}>
								To redeem this invitation sign out and sign back in again using
								the email address your invite was sent to.
							</p>
							<p css={descriptions}>
								Want to use a different email address? Ask the person who
								invited you to send you a new invitation to the correct email.
							</p>
						</Stack>
						<LinkButton
							priority="primary"
							cssOverrides={[buttonOverrides]}
							href={getSignoutUrl()}
						>
							Sign out and sign in again
						</LinkButton>
					</Stack>
				</ContentBox>
			</Stack>
		</OnboardingLayout>
	);
}
