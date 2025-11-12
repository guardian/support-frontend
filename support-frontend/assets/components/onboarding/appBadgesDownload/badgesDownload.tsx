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

export const guardianAppUrl = 'https://guardian.go.link/home?adj_t=1u2r07na';
export const feastAppUrl = 'https://guardian-feast.go.link/home?adj_t=1u2gdk5r';

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

function OnboardingAppBadgesMobile({ link }: { link: string }) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobile link={link} />
			<PlayStoreMobile link={link} />
		</div>
	);
}

function OnboardingAppBadgesMedium({ link }: { link: string }) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobileMedium link={link} />
			<PlayStoreMobileMedium link={link} />
		</div>
	);
}

function OnboardingAppBadgesTablet({ link }: { link: string }) {
	return (
		<div css={badgesContainer}>
			<AppStoreTablet link={link} />
			<PlayStoreTablet link={link} />
		</div>
	);
}

function OnboardingAppBadgesMobileLandscape({ link }: { link: string }) {
	return (
		<div css={badgesContainer}>
			<AppStoreMobileLandscape link={link} />
			<PlayStoreMobileLandscape link={link} />
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
		const link =
			onboardingStep === OnboardingSteps.GuardianApp
				? guardianAppUrl
				: feastAppUrl;

		if (windowWidthIsGreaterThan('tablet')) {
			return <OnboardingAppBadgesTablet link={link} />;
		} else if (windowWidthIsGreaterThan('mobileLandscape')) {
			return <OnboardingAppBadgesMobileLandscape link={link} />;
		} else if (windowWidthIsGreaterThan('mobileMedium')) {
			return <OnboardingAppBadgesMedium link={link} />;
		} else {
			return <OnboardingAppBadgesMobile link={link} />;
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
