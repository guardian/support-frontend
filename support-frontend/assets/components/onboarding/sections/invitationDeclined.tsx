import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { LinkButton, Stack } from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import { getBaseDomain } from 'helpers/urls/url';
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

export function OnboardingInvitationDeclined() {
	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox removePadding>
				<div css={[heroContainer, heroAspectRatio]}>
					<GridImage
						gridId="onboardingInviteeCreateAccountHero"
						srcSizes={[442]}
						sizes="442px"
						imgType="png"
						altText="Invitation declined hero"
					/>
				</div>

				<Stack space={5} cssOverrides={contentPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Invitation declined</h1>
						<p css={descriptions}>You&apos;ve declined this invitation.</p>
						<p css={descriptions}>
							You no longer have access to Digital plus benefits through this
							invitation.
						</p>
						<p css={descriptions}>
							If you change your mind, you&apos;ll need a new invitation or you
							can subscribe independently.
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
	);
}
