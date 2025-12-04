import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	textSansBold14,
} from '@guardian/source/foundations';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { AppStoreMobile } from './appStore';
import { FeastAppsQrCode } from './feastAppsQrCode';
import { GuardianAppsQrCode } from './guardianAppsQrCode';
import { PlayStoreMobile } from './playStore';

const guardianAppUrl = 'https://guardian.go.link/home?adj_t=1vddwf4h';
const feastAppUrl = 'https://guardian-feast.go.link/home?adj_t=1vktw84s';

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
	onboardingStep: OnboardingSteps;
}) {
	const { windowWidthIsGreaterThan } = useWindowWidth();

	const link =
		onboardingStep === OnboardingSteps.GuardianApp
			? guardianAppUrl
			: feastAppUrl;
	const qrCode =
		onboardingStep === OnboardingSteps.GuardianApp ? (
			<GuardianAppsQrCode />
		) : (
			<FeastAppsQrCode />
		);

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
