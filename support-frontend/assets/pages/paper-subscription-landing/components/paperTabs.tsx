// ----- Imports ----- //
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Collection, HomeDelivery } from '@modules/product/fulfilmentOptions';
import { Outset } from 'components/content/content';
import Tabs from 'components/tabs/tabs';
import { ContentDeliveryFaqBlock } from './content/deliveryTab';
import { SubsCardFaqBlock } from './content/subsCardTab';
// ----- Tabs ----- //
type TabOptions = {
	name: string;
	href: string;
	content: typeof SubsCardFaqBlock | typeof ContentDeliveryFaqBlock;
};
const tabs: Record<PaperFulfilmentOptions, TabOptions> = {
	HomeDelivery: {
		name: 'Home Delivery',
		href: `#${HomeDelivery}`,
		content: ContentDeliveryFaqBlock,
	},
	Collection: {
		name: 'Collect in store',
		href: `#${Collection}`,
		content: SubsCardFaqBlock,
	},
};
type PropTypes = {
	selectedTab: PaperFulfilmentOptions;
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
};

// ----- Component ----- //
function PaperTabs({ selectedTab, setTabAction }: PropTypes): JSX.Element {
	const tabOptions = Object.keys(tabs);
	const tabItems = (tabOptions as PaperFulfilmentOptions[]).map(
		(fulfilmentMethod) => {
			const TabContent = tabs[fulfilmentMethod].content;
			return {
				id: fulfilmentMethod,
				text: tabs[fulfilmentMethod].name,
				href: tabs[fulfilmentMethod].href,
				selected: fulfilmentMethod === selectedTab,
				content: <TabContent />,
			};
		},
	);
	return (
		<Outset>
			<Tabs
				tabsLabel="Paper subscription options"
				tabElement="a"
				tabs={tabItems}
				onTabChange={(tabId) => {
					setTabAction(tabId);
				}}
			/>
		</Outset>
	);
} // ----- Exports ----- //

export default PaperTabs;
