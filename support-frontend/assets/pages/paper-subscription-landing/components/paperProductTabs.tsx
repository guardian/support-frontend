import type { ReactElement } from 'react';
import { useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import { PaperTabHero } from './content/paperTabHero';

type TabOptions = {
	text: string;
	href: string;
	content: () => ReactElement;
};

const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		text: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: () => <PaperTabHero tab={HomeDelivery} />,
	},
	Collection: {
		text: 'Subscription Card',
		href: `#${Collection}`,
		content: () => <PaperTabHero tab={Collection} />,
	},
};

function PaperProductTabs() {
	const fulfilment =
		window.location.hash === `#${Collection}` ? Collection : HomeDelivery;

	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);

	const tabItems = Object.entries(tabs).map(([fulfilment, tab]) => {
		const { href, text, content: ContentComponent } = tab;
		return {
			id: fulfilment,
			text,
			href,
			selected: fulfilment === selectedTab,
			content: <ContentComponent />,
		} as TabProps;
	});

	return (
		<FullWidthContainer>
			<CentredContainer>
				<Tabs
					tabsLabel="Paper subscription options"
					tabElement="a"
					tabs={tabItems}
					onTabChange={(tabId) => {
						setSelectedTab(tabId);
					}}
					theme="paperTabs"
				/>
			</CentredContainer>
		</FullWidthContainer>
	);
}

export default PaperProductTabs;
