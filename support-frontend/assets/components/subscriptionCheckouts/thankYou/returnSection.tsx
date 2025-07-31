// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
	themeButtonReaderRevenue,
} from '@guardian/source/react-components';
import Content, { Divider, NarrowContent } from 'components/content/content';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

const buttonStyles = css`
	${from.desktop} {
		margin-left: ${space[2]}px;
	}
`;
type PropTypes = {
	subscriptionProduct: SubscriptionProduct;
};

// ----- Component ----- //
function ReturnSection(props: PropTypes) {
	return (
		<Content>
			<Divider />
			<NarrowContent>
				<div className="thank-you-stage__ctas">
					<LinkButton
						cssOverrides={buttonStyles}
						priority="tertiary"
						aria-label="Return to the Guardian home page"
						href="https://theguardian.com"
						icon={<SvgArrowRightStraight />}
						iconSide="right"
						nudgeIcon
						onClick={sendTrackingEventsOnClick({
							id: 'checkout_return_home',
							product: props.subscriptionProduct,
							componentType: 'ACQUISITIONS_BUTTON',
						})}
						theme={themeButtonReaderRevenue}
					>
						Return to the Guardian
					</LinkButton>
				</div>
			</NarrowContent>
		</Content>
	);
} // ----- Exports ----- //

export default ReturnSection;
