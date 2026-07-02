import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { Stack } from '@guardian/source/react-components';
import type { RefObject } from 'react';
import GridImage from 'components/gridImage/gridImage';
import type { NewsletterSubscription } from 'helpers/identity/newsletters';
import type { CsrfState } from 'helpers/types/csrf';
import ContentBox from '../contentBox';
import type { HandleStepNavigationFunction } from '../onboardingTypes';
import { completedStack, descriptions, headings, heroContainer, separator } from './sectionsStyles';
import { OnboardingSummarySuccessfulSignIn } from './summary';

const identityFrameStyles = css`
	overflow: hidden;
	border-radius: ${space[2]}px;
`;

const heroAspectRatio = css`
	aspect-ratio: 16 / 9;

	${from.tablet} {
		aspect-ratio: 20 / 9;
	}
`;

interface OnboardingCreateAccountProps {
	iframeRef: RefObject<HTMLIFrameElement>;
	iframeSrc: string;
	showIframe: boolean;
	handleStepNavigation: HandleStepNavigationFunction;
	csrf: CsrfState;
	userNewslettersSubscriptions: NewsletterSubscription[] | null;
}

export function OnboardingCreateAccount({
	iframeRef,
	iframeSrc,
	showIframe,
	handleStepNavigation,
	csrf,
	userNewslettersSubscriptions,
}: OnboardingCreateAccountProps) {
	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox
				cssOverrides={css`
					margin-top: ${space[5]}px;
				`}
			>
				{showIframe ? (
					<Stack space={2}>
						<h1 css={headings}>Create your account</h1>
						<p css={descriptions}>
							Redeem your invitation and start exploring your full Guardian
							access.
						</p>
						<iframe
							ref={iframeRef}
							src={iframeSrc}
							width="100%"
							css={identityFrameStyles}
						/>
					</Stack>
				) : (
					<>
						<div css={[heroContainer, heroAspectRatio]}>
							<GridImage
								gridId={'onboardingInviteeCreateAccountHero'}
								srcSizes={[442]}
								sizes="442px"
								imgType="png"
								altText={'Onboarding invitee create account hero'}
							/>
						</div>
						<div css={separator} />
						<OnboardingSummarySuccessfulSignIn
							handleStepNavigation={handleStepNavigation}
							userState={'inviteeUserRegistered'}
							userNewslettersSubscriptions={userNewslettersSubscriptions}
							csrf={csrf}
						/>
					</>
				)}
			</ContentBox>
		</Stack>
	);
}
