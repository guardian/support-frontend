import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSansBold14,
} from '@guardian/source/foundations';
import { useMemo } from 'preact/hooks';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { AppsQrCode } from './appsQrCode';
import { AppStoreMobile } from './appStoreMobile';
import { AppStoreMobileLandscape } from './appStoreMobileLandscape';
import { AppStoreMobileMedium } from './appStoreMobileMedium';
import { AppStoreTablet } from './appStoreTablet';
import { PlayStoreMobile } from './playStoreMobile';
import { PlayStoreMobileLandscape } from './playStoreMobileLandscape';
import { PlayStoreMobileMedium } from './playStoreMobileMedium';
import { PlayStoreTablet } from './playStoreTablet';

export const iosAppUrl =
	'https://apps.apple.com/app/the-guardian-live-world-news/id409128287';
export const androidAppUrl =
	'https://play.google.com/store/apps/details?id=com.guardian';
export const iosFeastAppUrl =
	'https://apps.apple.com/us/app/guardian-feast/id6468674686';
export const androidFeastAppUrl =
	'https://play.google.com/store/apps/details?id=uk.co.guardian.feast';

const badgesContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	${from.tablet} {
		flex-direction: column;
		align-items: flex-start;
		gap: ${space[2]}px;
	}
`;

const container = css`
	margin: ${space[6]}px 0;

	${from.tablet} {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: ${space[14]}px;
	}

	${from.desktop} {
		gap: ${space[16]}px;
	}
`;

const qrContainer = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${space[2]}px;
	${textSansBold14}
`;

const separator = css`
	border-right: 1px solid ${neutral[73]};
`;

function OnboardingAppBadgesMobile({
	isoLink,
	androidLink,
}: {
	isoLink: string;
	androidLink: string;
}) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobile link={isoLink} />
			<PlayStoreMobile link={androidLink} />
		</div>
	);
}

function OnboardingAppBadgesMedium({
	isoLink,
	androidLink,
}: {
	isoLink: string;
	androidLink: string;
}) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobileMedium link={isoLink} />
			<PlayStoreMobileMedium link={androidLink} />
		</div>
	);
}

function OnboardingAppBadgesTablet({
	isoLink,
	androidLink,
}: {
	isoLink: string;
	androidLink: string;
}) {
	return (
		<div css={badgesContainer}>
			<AppStoreTablet link={isoLink} />
			<PlayStoreTablet link={androidLink} />
		</div>
	);
}

function OnboardingAppBadgesMobileLandscape({
	isoLink,
	androidLink,
}: {
	isoLink: string;
	androidLink: string;
}) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobileLandscape link={isoLink} />
			<PlayStoreMobileLandscape link={androidLink} />
		</div>
	);
}

export function OnboardingAppBadgesDownload({
	onboardingStep,
}: {
	onboardingStep: OnboardingSteps;
}) {
	const { windowWidthIsGreaterThan } = useWindowWidth();

	const badges = useMemo(() => {
		const isoLink =
			onboardingStep === OnboardingSteps.GuardianApp
				? iosAppUrl
				: iosFeastAppUrl;
		const androidLink =
			onboardingStep === OnboardingSteps.GuardianApp
				? androidAppUrl
				: androidFeastAppUrl;

		if (windowWidthIsGreaterThan('tablet')) {
			return (
				<OnboardingAppBadgesTablet
					isoLink={isoLink}
					androidLink={androidLink}
				/>
			);
		} else if (windowWidthIsGreaterThan('mobileLandscape')) {
			return (
				<OnboardingAppBadgesMobileLandscape
					isoLink={isoLink}
					androidLink={androidLink}
				/>
			);
		} else if (windowWidthIsGreaterThan('mobileMedium')) {
			return (
				<OnboardingAppBadgesMedium
					isoLink={isoLink}
					androidLink={androidLink}
				/>
			);
		} else {
			return (
				<OnboardingAppBadgesMobile
					isoLink={isoLink}
					androidLink={androidLink}
				/>
			);
		}
	}, [windowWidthIsGreaterThan, onboardingStep]);

	return (
		<div css={container}>
			{badges}
			{windowWidthIsGreaterThan('tablet') ? (
				<>
					<div css={separator} />
					<div css={qrContainer}>
						<AppsQrCode />
						<p>Scan to get the App</p>
					</div>
				</>
			) : null}
		</div>
	);
}
