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
	let copy;
	switch (productKey) {
		case 'HomeDelivery':
		case 'NationalDelivery':
		case 'SubscriptionCard': {
			copy = [
				{
					heading: `You will receive your newspapers from ${startDate}`,
					body: [
						`Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future. As well as future communications on how to make the most of your subscription and weekly newsletters written by the editors. You can opt out at any time via your account.`,
						`Your newspaper will be delivered to your door.`,
						`You will receive your Subscription Card in your subscriber pack in the post, along with your home delivery letter.`,
						`Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.`,
					],
				},
			];
			break;
		}
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
		case 'DigitalSubscription':
		default: {
			copy = [
				{
					heading: `Your first issue of Guardian Weekly will be published
						on ${startDate}`,
					body: [
						`Please allow one to seven days after the publication date for your copy to be delivered to your door, depending on postal services.`,
					],
				},
			];
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
