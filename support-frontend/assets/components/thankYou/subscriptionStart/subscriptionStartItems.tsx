import { css } from '@emotion/react';
import { between, space } from '@guardian/source/foundations';
import { getProductDescription } from 'helpers/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

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
const paragraphSpacing = css`
	margin-bottom: ${space[1]}px;
`;

export const benefitsHeader = 'What’s included?';
export function BenefitsBodyCopy({
	productKey,
	ratePlanKey,
}: {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
}): JSX.Element {
	const { label: productName } = getProductDescription(productKey, ratePlanKey);

	return (
		<span css={downloadCopy}>Your {productName} subscription includes:</span>
	);
}
export const subscriptionStartHeader = 'When will your subscription start?';

type SubscriptionStartProps = {
	productKey: ActiveProductKey;
	startDate?: string;
};
export function SubscriptionStartItems({
	productKey,
	startDate,
}: SubscriptionStartProps): JSX.Element | null {
	const paperCopy = (
		<span css={[downloadCopy, subscriptionItems]}>
			<div>
				{startDate && (
					<p css={boldText}>
						{`You will receive your newspaper from ${startDate}`}
					</p>
				)}
				{productKey === 'SubscriptionCard' && (
					<p css={paragraphSpacing}>
						You will receive your Subscription Card in your subscriber pack in
						the post, along with your home delivery letter.
					</p>
				)}
				<p>
					Visit your chosen participating newsagent to pick up your newspaper
					using your Subscription Card, or arrange a home delivery using your
					delivery letter.
				</p>
			</div>
		</span>
	);
	const guardianWeeklyCopy = (
		<span css={[downloadCopy, subscriptionItems]}>
			<div>
				<p css={boldText}>
					{`Your first issue of Guardian Weekly will be published on ${startDate}`}
				</p>
				<p>
					Please allow one to seven days after the publication date for your
					copy to be delivered to your door, depending on postal services.
				</p>
			</div>
		</span>
	);
	const copyContent: Partial<Record<ActiveProductKey, JSX.Element>> = {
		HomeDelivery: paperCopy,
		NationalDelivery: paperCopy,
		SubscriptionCard: paperCopy,
		GuardianWeeklyRestOfWorld: guardianWeeklyCopy,
		GuardianWeeklyDomestic: guardianWeeklyCopy,
		TierThree: (
			<span css={[downloadCopy, subscriptionItems]}>
				{guardianWeeklyCopy}
				<div>
					<p css={boldText}>Your digital benefits start today.</p>
					<p>
						Please ensure you are signed in on all your devices to enjoy all
						your benefits, including unlimited app access and uninterrupted
						ad-free reading.
					</p>
				</div>
			</span>
		),
	};
	return copyContent[productKey] ?? null;
}
