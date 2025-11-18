import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

const observerMessageStyle = css`
	p {
		margin-bottom: ${space[2]}px;
	}
`;

export default function ObserverMessage({
	observerPrint,
	startDate,
}: {
	observerPrint: ObserverPrint;
	startDate?: string;
}) {
	const isSubscriptionCard = observerPrint === ObserverPrint.SubscriptionCard;
	return (
		<div css={observerMessageStyle}>
			{isSubscriptionCard && (
				<p>
					You should receive your subscription card in 1-2 weeks, but look out
					for an email landing in your inbox later today containing details of
					how you can pick up your newspaper before then.
				</p>
			)}
			<p>
				{!isSubscriptionCard &&
					`You will receive your newspapers from ${startDate}. `}
				Your subscription has been set up. Please note: The Guardian is managing
				the print element of your Observer subscription on behalf of The
				Observer. You will receive an email from The Guardian within three
				business days confirming your recurring payment. This will appear as
				"The Observer" on your bank statements.
			</p>
		</div>
	);
}
