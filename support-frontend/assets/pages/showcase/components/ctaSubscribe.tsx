import React from 'react';
import AnchorButton from 'components/button/anchorButton';
import Content, { NarrowContent } from 'components/content/content';
import GridImage from 'components/gridImage/gridImage';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';
import Text from 'components/text/text';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

export default function CtaSubscribe() {
	return (
		<Content
			appearance="feature"
			modifierClasses={['subscribe']}
			image={
				<GridImage
					gridId="showcaseSubscribe"
					srcSizes={[1000, 500]}
					sizes="(max-width: 740px) 90vw, 600px"
					imgType="png"
				/>
			}
		>
			<Text title="Subscribe">
				<p>
					From the Digital Subscription, to the new Guardian Weekly magazine,
					you can subscribe to the Guardian from wherever you are.
				</p>
			</Text>
			<NarrowContent>
				<AnchorButton
					icon={<ArrowRightStraight />}
					href="/subscribe"
					onClick={sendTrackingEventsOnClick({
						id: 'support-page-cta-subscribe',
						componentType: 'ACQUISITIONS_BUTTON',
					})}
				>
					Choose a Subscription
				</AnchorButton>
			</NarrowContent>
		</Content>
	);
}
