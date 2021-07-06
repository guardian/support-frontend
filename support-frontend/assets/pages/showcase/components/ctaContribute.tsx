import React from 'react';
import Content, { NarrowContent } from 'components/content/content';
import Text from 'components/text/text';
import AnchorButton from 'components/button/anchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';
import WithSupport from 'components/svgs/withSupport';
import OneMillionCircles from 'components/svgs/oneMillionCircles';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
export default function CtaContribute() {
	return (
		<Content appearance="highlight" modifierClasses={['contribute']}>
			<div className="wrapper">
				<div className="image">
					<WithSupport />
				</div>
				<div>
					<Text title="Contribute">
						<p>
							We chose a model that means our reporting is open to everyone,
							funded by our readers. This support safeguards our essential
							editorial independence, emboldening us to challenge the powerful
							and shed light where others won’t.
						</p>
						<p>
							The Guardian{"'"}s open, independent journalism has now been
							supported by over a million people around the world – but we must
							keep building on this for the years to come.&nbsp;
							<strong>
								Every contribution, whether big or small, means we can keep
								investigating and exploring the critical issues of our time. And
								it only takes a minute.
							</strong>
						</p>
					</Text>
					<NarrowContent>
						<AnchorButton
							icon={<ArrowRightStraight />}
							appearance="secondary"
							href="/contribute"
							onClick={sendTrackingEventsOnClick({
								id: 'support-page-cta-contribute',
								componentType: 'ACQUISITIONS_BUTTON',
							})}
						>
							Make a Contribution
						</AnchorButton>
					</NarrowContent>
				</div>
			</div>
			<OneMillionCircles />
		</Content>
	);
}
