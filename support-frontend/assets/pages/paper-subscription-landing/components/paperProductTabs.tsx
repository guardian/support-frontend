import type { ReactElement } from 'react';
import { useState } from 'react';
import Tabs, { type TabProps } from 'components/tabs/tabs';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';

type TabOptions = {
	name: string;
	href: string;
	content: () => ReactElement;
};

const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		name: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: () => <>Home Delivery Content</>,
	},
	Collection: {
		name: 'Subscription Card',
		href: `#${Collection}`,
		content: () => <>Subscription Card Content</>,
	},
};

function PaperProductTabs() {
	const fulfilment =
		window.location.hash === `#${Collection}` ? Collection : HomeDelivery;

	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);

	const tabItems = Object.entries(tabs).map(([fulfilment, tab]) => {
		const { content: ContentComponent } = tab;
		return {
			id: fulfilment,
			text: tab.name,
			href: tab.href,
			selected: fulfilment === selectedTab,
			content: <ContentComponent />,
		} as TabProps;
	});

	return (
		<Tabs
			tabsLabel="Paper subscription options"
			tabElement="a"
			tabs={tabItems}
			onTabChange={(tabId) => {
				setSelectedTab(tabId);
			}}
			theme="paperTabs"
		/>
	);
}

export default PaperProductTabs;
