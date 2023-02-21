import { css } from '@emotion/react';
import { body, headline, space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

type SubscriptionProduct = 'Guardian Weekly' | 'Student';

type PropTypes = {
	href: string;
	product: SubscriptionProduct;
	orderIsAGift: boolean;
	isStudent?: boolean;
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

function GiftOrPersonalOrStudent({
	href,
	product,
	orderIsAGift,
	isStudent,
}: PropTypes): JSX.Element | null {
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
					<p>{product}s get 70% off a Guardian Weekly subscription.</p>
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
