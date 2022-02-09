import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { SvgTicket } from 'components/icons/ticket';
import Text from 'components/text/text';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { emailPreferences, getMemLink } from 'helpers/urls/externalLinks';

const marginForButton = css`
	margin-bottom: ${space[3]}px;
`;

const EventsModule = () => (
	<div>
		<SvgTicket />
		<Text title="Guardian digital events">
			<p>
				Enjoy 6 free tickets to Guardian digital events in the first 6 months of
				your subscription. You will be sent your unique redemption code by email
				shortly, enter your code 6 times at the checkout for your chosen events
				to receive your free tickets.
			</p>
			<p>Browse Guardian Live events and Masterclasses</p>
			<LinkButton
				css={marginForButton}
				priority="tertiary"
				size="default"
				icon={<SvgArrowRightStraight />}
				iconSide="right"
				nudgeIcon
				aria-label="Click to find out more about Guardian Live events and Masterclasses"
				href={getMemLink('events')}
				onClick={sendTrackingEventsOnClick({
					id: 'checkout_thankyou_events',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				})}
			>
				Guardian digital events
			</LinkButton>
			<p>
				Sign up to the Guardian Live and Masterclasses newsletter to be the
				first to hear when new events are announced.
			</p>
			<LinkButton
				css={marginForButton}
				priority="tertiary"
				size="default"
				icon={<SvgArrowRightStraight />}
				iconSide="right"
				nudgeIcon
				aria-label="Click to manage your email subscriptions, and sign up to receive news about Guardian Live events and Masterclasses"
				href={emailPreferences}
				onClick={sendTrackingEventsOnClick({
					id: 'checkout_thankyou_email_prefs',
					product: 'DigitalPack',
					componentType: 'ACQUISITIONS_BUTTON',
				})}
			>
				Manage my newsletters
			</LinkButton>
		</Text>
	</div>
);

export default EventsModule;
