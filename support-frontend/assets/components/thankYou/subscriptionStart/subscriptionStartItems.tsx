import { css } from '@emotion/react';
import { between, space } from '@guardian/source/foundations';
import type { ActiveProductKey } from 'helpers/productCatalog';

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

export const benefitsHeader = 'What’s included?';

export function BenefitsBodyCopy(): JSX.Element {
	return (
		<span css={downloadCopy}>Your Digital + print subscription includes:</span>
	);
}

export const subscriptionStartHeader = 'When will your subscription start?';

type SubscriptionStartProps = {
	productKey: ActiveProductKey;
	startDate: string;
};

export function SubscriptionStartBodyCopy({
	productKey,
	startDate,
}: SubscriptionStartProps): JSX.Element {
	const paperHeading = `You will receive your newspaper from ${startDate}`;
	const paperBody = `Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.`;
	const guardianWeeklyBodyHeading = {
		heading: `Your first issue of Guardian Weekly will be published on ${startDate}`,
		body: [
			`Please allow one to seven days after the publication date for your copy to be delivered to your door, depending on postal services.`,
		],
	};
	let copy;
	switch (productKey) {
		case 'HomeDelivery':
		case 'NationalDelivery': {
			copy = [
				{
					heading: paperHeading,
					body: [paperBody],
				},
			];
			break;
		}
		case 'SubscriptionCard': {
			copy = [
				{
					heading: paperHeading,
					body: [
						`You will receive your Subscription Card in your subscriber pack in the post, along with your home delivery letter.`,
						paperBody,
					],
				},
			];
			break;
		}
		case 'TierThree': {
			copy = [
				guardianWeeklyBodyHeading,
				{
					heading: `Your digital benefits start today.`,
					body: [
						`Please ensure you are signed in on all your devices to enjoy all your benefits, including unlimited app access and uninterrupted ad-free reading.`,
					],
				},
			];
			break;
		}
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld': {
			copy = [guardianWeeklyBodyHeading];
			break;
		}
		default: {
			copy = [{ heading: '', body: [''] }];
		}
	}
	return (
		<span css={[downloadCopy, subscriptionItems]}>
			{copy.map(({ heading, body }) => (
				<div>
					<p>
						<span css={boldText}>{heading}</span>
					</p>
					{body.map((body) => (
						<p>{body}</p>
					))}
				</div>
			))}
		</span>
	);
}
