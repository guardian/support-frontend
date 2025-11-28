import { css } from '@emotion/react';
import { from, headlineBold24, palette } from '@guardian/source/foundations';
import { useEffect, useState } from 'preact/hooks';
import type { Participations } from '../../../helpers/abTests/models';
import { fetchIsPastSingleContributor } from '../../../helpers/mparticle';
import { trackComponentEvents } from '../../../helpers/tracking/trackingOphan';
import { getUser } from '../../../helpers/user/user';
import {
	getSanitisedHtml,
	replaceDatePlaceholder,
} from '../../../helpers/utilities/utilities';

const headingStyle = css`
	text-wrap: balance;
	text-align: left;
	color: ${palette.neutral[100]};
	${headlineBold24}
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
	}
`;

interface Props {
	heading: string;
	countdownDaysLeft?: string;
	abParticipations: Participations;
}

export function ThreeTierLandingHeading({
	heading,
	countdownDaysLeft,
	abParticipations,
}: Props): JSX.Element {
	const { isSignedIn } = getUser();
	const variant =
		abParticipations.landingPageMparticlePastContributor?.toLowerCase();

	const [mparticleHeadingOverride, setMparticleHeadingOverride] = useState<
		string | undefined
	>(undefined);

	useEffect(() => {
		void fetchIsPastSingleContributor(isSignedIn, variant).then(
			(isPastSingleContributor) => {
				if (isPastSingleContributor) {
					// Track both control + variant here, so we can see which users are actually in the audience
					trackComponentEvents({
						component: {
							componentType: 'ACQUISITIONS_OTHER',
							id: `landingPageMparticlePastContributor-${variant}`,
						},
						action: 'INSERT',
					});
					if (variant === 'variant') {
						setMparticleHeadingOverride(
							'Support our fearless, independent journalism again',
						);
					}
				}
			},
		);
	}, [isSignedIn, variant]);

	return (
		<h1 css={headingStyle}>
			<span
				dangerouslySetInnerHTML={{
					__html: getSanitisedHtml(
						replaceDatePlaceholder(
							mparticleHeadingOverride ?? heading,
							countdownDaysLeft,
						),
					),
				}}
			/>
		</h1>
	);
}
