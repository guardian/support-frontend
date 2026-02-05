import { css } from '@emotion/react';
import {
	from,
	headlineBold34,
	neutral,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

type SubscriptionProduct = 'digital' | 'Guardian Weekly' | 'Student';
type PropTypes = {
	href: string;
	product: SubscriptionProduct;
	orderIsAGift: boolean;
	isStudent?: boolean;
};
const giftOrPersonal = css`
	border-top: 1px solid ${neutral[73]};
	padding: ${space[5]}px ${space[3]}px ${space[8]}px;
	${from.phablet} {
		border-top: none;
		padding: ${space[8]}px ${space[3]}px ${space[12]}px;
	}
	${from.desktop} {
		padding-left: 0;
		padding-right: ${space[9]}px;
	}
`;
const giftOrPersonalCopy = css`
	${textEgyptian17};
	margin-bottom: ${space[6]}px;
`;
const giftOrPersonalHeading = css`
	${headlineBold34};
`;
const linkButtonWidth = css`
	width: 100%;
	${from.tablet} {
		width: auto;
	}
`;

function GiftOrPersonalOrStudent({
	href,
	product,
	orderIsAGift,
	isStudent,
}: PropTypes) {
	if (isStudent && orderIsAGift) {
		return null;
	}
	return (
		<section css={giftOrPersonal}>
			<div css={giftOrPersonalCopy}>
				<h2 css={giftOrPersonalHeading}>
					{isStudent
						? 'Student subscriptions'
						: orderIsAGift
						? 'Looking for a subscription for yourself?'
						: 'Gift subscriptions'}
				</h2>
				{isStudent ? (
					<p>{product}s get 50% off a Guardian Weekly subscription.</p>
				) : (
					!orderIsAGift && <p>A {product} subscription makes a great gift.</p>
				)}
			</div>
			<LinkButton
				icon={<SvgArrowRightStraight />}
				iconSide="right"
				priority="tertiary"
				nudgeIcon
				href={href}
				onClick={() => {
					sendTrackingEventsOnClick({
						id: `${
							isStudent ? 'student' : orderIsAGift ? 'personal' : 'gift'
						}_subscriptions_cta`,
						componentType: 'ACQUISITIONS_BUTTON',
					});
				}}
				cssOverrides={linkButtonWidth}
			>
				{isStudent
					? `I'm a student`
					: orderIsAGift
					? 'See personal subscriptions'
					: 'See gift subscriptions'}
			</LinkButton>
		</section>
	);
}

export default GiftOrPersonalOrStudent;
