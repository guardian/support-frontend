import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSansBold14,
} from '@guardian/source/foundations';
import type { ReactElement } from 'react';
import { OnboardingSteps } from 'components/onboarding/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { AppStoreMobile } from './appStore';
import { FeastAppsQrCode } from './feastAppsQrCode';
import { GuardianAppsQrCode } from './guardianAppsQrCode';
import { PlayStoreMobile } from './playStore';

const guardianAppUrl = 'https://guardian.go.link/home?adj_t=1vddwf4h';
const feastAppUrl = 'https://guardian-feast.go.link/home?adj_t=1vktw84s';
const editionsAppUrl =
	'https://play.google.com/store/apps/details?id=com.guardian.editions';

export const ONBOARDING_EDITIONS_APP = 'editions-app';

export type OnboardingAppBadgesDownloadStep =
	| OnboardingSteps.GuardianApp
	| OnboardingSteps.FeastApp
	| typeof ONBOARDING_EDITIONS_APP;

type AppBadgesConfig = {
	link: string;
	qrCode: ReactElement;
};

const appBadgesConfigMap: Record<
	OnboardingAppBadgesDownloadStep,
	AppBadgesConfig
> = {
	[OnboardingSteps.GuardianApp]: {
		link: guardianAppUrl,
		qrCode: <GuardianAppsQrCode />,
	},
	[OnboardingSteps.FeastApp]: {
		link: feastAppUrl,
		qrCode: <FeastAppsQrCode />,
	},
	[ONBOARDING_EDITIONS_APP]: {
		link: editionsAppUrl,
		// TODO: replace with Editions app QR code when asset is available
		qrCode: <GuardianAppsQrCode />,
	},
};

const badgesContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: ${space[2]}px;

	${from.tablet} {
		flex-direction: column;
		align-items: flex-start;
		flex: 3;
	}
`;

const badge = css`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: ${neutral[0]};
	height: ${space[10]}px;
	border-radius: ${space[2]}px;

	${from.tablet} {
		width: 100%;
		max-height: ${space[12]}px;
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
	flex: 2;
	${textSansBold14}

	${from.tablet} {
		margin-right: ${space[9]}px;
	}
`;

const separator = css`
	border-right: 1px solid ${neutral[73]};
`;

export function OnboardingAppBadgesDownload({
	onboardingStep,
}: {
	onboardingStep: OnboardingAppBadgesDownloadStep;
}) {
	const { windowWidthIsGreaterThan } = useWindowWidth();
	const { link, qrCode } = appBadgesConfigMap[onboardingStep];

	return (
		<div css={container}>
			<div css={badgesContainer}>
				<a css={badge} href={link} target="_blank">
					<AppStoreMobile />
				</a>
				<a css={badge} href={link} target="_blank">
					<PlayStoreMobile />
				</a>
			</div>
			{windowWidthIsGreaterThan('tablet') ? (
				<>
					<div css={separator} />
					<div css={qrContainer}>
						{qrCode}
						<p>Scan to get the App</p>
					</div>
				</>
			) : null}
		</div>
	);
}
