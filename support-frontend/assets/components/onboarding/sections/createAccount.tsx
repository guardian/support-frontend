import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Stack } from '@guardian/source/react-components';
import type { RefObject } from 'react';
import type { NewsletterSubscription } from 'helpers/identity/newsletters';
import type { CsrfState } from 'helpers/types/csrf';
import ContentBox from '../contentBox';
import type { HandleStepNavigationFunction } from '../onboardingTypes';
import { completedStack, descriptions, headings } from './sectionsStyles';
import { OnboardingSummarySuccessfulSignIn } from './summary';

const identityFrameStyles = css`
	overflow: hidden;
	border-radius: ${space[2]}px;
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
					<OnboardingSummarySuccessfulSignIn
						handleStepNavigation={handleStepNavigation}
						userState={'inviteeUserRegistered'}
						userNewslettersSubscriptions={userNewslettersSubscriptions}
						csrf={csrf}
					/>
				)}
			</ContentBox>
		</Stack>
	);
}
