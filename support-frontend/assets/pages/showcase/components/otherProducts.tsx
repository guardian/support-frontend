import React from 'react';
import Content from 'components/content/content';
import Text from 'components/text/text';
import { getMemLink, getPatronsLink } from 'helpers/urls/externalLinks';
import OtherProduct from './otherProduct';

export default function OtherProducts() {
	return (
		<Content modifierClasses={['other-products']}>
			<Text title="Other ways you can support us">
				<OtherProduct
					title="The Guardian Patrons"
					description="Support from our Patrons is crucial to ensure that generations to come will be able to enjoy the Guardian"
					destination={getPatronsLink()}
					modifierClass="patrons"
					trackingId="patrons_cta"
				/>
				<OtherProduct
					title="Masterclasses &amp; Live Events"
					description="Meet Guardian journalists and readers at our events, debates, interviews and festivals"
					destination={getMemLink('events')}
					modifierClass="masterclass"
					trackingId="masterclass_cta"
				/>
			</Text>
		</Content>
	);
}
