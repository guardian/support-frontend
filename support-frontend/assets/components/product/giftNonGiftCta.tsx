import { css } from '@emotion/react';
import { LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { body, headline } from '@guardian/src-foundations/typography';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import React from 'react';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

type GiftableProduct = 'digital' | 'Guardian Weekly';
type PropTypes = {
	href: string;
	product: GiftableProduct;
	orderIsAGift: boolean;
};
const giftOrPersonal = css`
	padding: ${space[3]}px ${space[3]}px ${space[12]}px;
`;
const giftOrPersonalCopy = css`
	${body.medium()};
	margin-bottom: ${space[9]}px;
`;
const giftOrPersonalHeading = css`
	${headline.medium({
		fontWeight: 'bold',
	})};
`;

function GiftOrPersonal({ href, product, orderIsAGift }: PropTypes) {
	return (
		<section css={giftOrPersonal}>
			<div css={giftOrPersonalCopy}>
				<h2 css={giftOrPersonalHeading}>
					{orderIsAGift
						? 'Looking for a subscription for yourself?'
						: 'Gift subscriptions'}
				</h2>
				{!orderIsAGift && <p>A {product} subscription makes a great gift.</p>}
			</div>
			<LinkButton
				icon={<SvgArrowRightStraight />}
				iconSide="right"
				priority="tertiary"
				nudgeIcon
				href={href}
				onClick={() => {
					sendTrackingEventsOnClick({
						id: `${orderIsAGift ? 'personal' : 'gift'}_subscriptions_cta`,
						componentType: 'ACQUISITIONS_BUTTON',
					})();
				}}
			>
				{orderIsAGift ? 'See personal subscriptions' : 'See gift subscriptions'}
			</LinkButton>
		</section>
	);
}

export default GiftOrPersonal;
