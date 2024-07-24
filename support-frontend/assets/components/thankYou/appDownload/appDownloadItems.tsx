import { css } from '@emotion/react';
import { between, space } from '@guardian/source/foundations';

const downloadCopy = css`
	${between.desktop.and.leftCol} {
		max-width: 260px;
		display: block;
	}
`;

const subscriptionItems = css`
	& div:not(:first-child) {
		margin-top: ${space[4]}px;
	}
`;

const boldText = css`
	font-weight: bold;
`;

export const appDownloadHeader = 'Download the Guardian app';

export function AppDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	);
}

export const appDownloadEditionsHeader = 'Download the Guardian Editions app';

export function AppDownloadEditionsBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock full access to our quality news app today
		</span>
	);
}

export const appsDownloadHeader = 'Explore your subscriber’s App';

export const appNewsDownloadHeader = 'The Guardian News App';

export function AppNewsDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Unlock limitless Guardian journalism in our quality news app today.
		</span>
	);
}

export const appFeastDownloadHeader = 'The Guardian Feast App';

export function AppFeastDownloadBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>
			Make a feast out of anything with the Guardian’s new recipe app – Feast.
		</span>
	);
}

export const benefitsHeader = 'What’s included?';

export function BenefitsBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>Your Digital + print subscription includes:</span>
	);
}

export const subscriptionStartHeader = 'When will your subscription start?';

type SubscriptionStartProps = {
	startDateGW: string;
};

export function SubscriptionStartBodyCopy({
	startDateGW,
}: SubscriptionStartProps): JSX.Element {
	return (
		<span css={[downloadCopy, subscriptionItems]}>
			<div>
				<p>
					<span css={boldText}>
						Your first issue of Guardian Weekly will be published on{' '}
						{startDateGW}.
					</span>
				</p>
				<p>
					Please allow one to seven days after the publication date for your
					copy to be delivered to your door, depending on postal services.
				</p>
			</div>
			<div>
				<p>
					<span css={boldText}>Your digital benefits start today.</span>
				</p>
				<p>
					Please ensure you are signed in on all your devices to enjoy all your
					benefits, including unlimited app access and uninterrupted ad-free
					reading.
				</p>
			</div>
		</span>
	);
}
