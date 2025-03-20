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
			copy = () => (
				<div>
					<p>
						<span
							css={boldText}
						>{`You will receive your newspaper from ${startDate}`}</span>
					</p>
					<div>
						{productKey === 'SubscriptionCard' && (
							<p>
								You will receive your Subscription Card in your subscriber pack
								in the post, along with your home delivery letter.
							</p>
						)}
						<p>
							Visit your chosen participating newsagent to pick up your
							newspaper using your Subscription Card, or arrange a home delivery
							using your delivery letter.
						</p>
					</div>
				</div>
			);
			break;
		}
		case 'TierThree': {
			copy = () => (
				<div>
					<p>
						<span css={boldText}>Your digital benefits start today.</span>
					</p>
					<div>
						<p>
							Please ensure you are signed in on all your devices to enjoy all
							your benefits, including unlimited app access and uninterrupted
							ad-free reading..
						</p>
					</div>
				</div>
			);
			break;
		}
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld': {
			copy = () => (
				<div>
					<p>
						<span
							css={boldText}
						>{`Your first issue of Guardian Weekly will be published on ${startDate}`}</span>
					</p>
					<div>
						<p>
							Please allow one to seven days after the publication date for your
							copy to be delivered to your door, depending on postal services.
						</p>
					</div>
				</div>
			);
			break;
		}
		default: {
			copy = () => <div></div>;
		}
	}
	return <span css={[downloadCopy, subscriptionItems]}>{copy()}</span>;
}
