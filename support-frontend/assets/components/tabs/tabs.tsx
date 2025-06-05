import type { ReactNode } from 'react';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import * as paperTabStyles from './paperTabsStyles';
import * as tabStyles from './tabsStyles';

type TabElement = 'a' | 'button';
export type TabProps = {
	id: string;
	text: string;
	href?: string;
	selected: boolean;
	content: ReactNode;
};
type PropTypes = {
	tabsLabel: string;
	tabElement: TabElement;
	tabs: TabProps[];
	onTabChange: (tabName: PaperFulfilmentOptions) => void;
	theme?: 'tabs' | 'paperTabs';
};

function Tabs({
	tabsLabel,
	tabElement,
	tabs,
	onTabChange,
	theme = 'tabs',
}: PropTypes): JSX.Element {
	const styles = theme === 'tabs' ? tabStyles : paperTabStyles;
	const TabControllerElement = tabElement;
	return (
		<div>
			<div css={styles.tabList} role="tablist" aria-label={tabsLabel}>
				{tabs.map((tab: TabProps) => {
					const selected = tab.selected ? 'true' : 'false';
					return (
						<TabControllerElement
							css={styles.tabButton}
							role="tab"
							id={tab.id}
							href={tab.href}
							aria-selected={selected}
							aria-controls={`${tab.id}-tab`}
							onClick={(event) => {
								event.preventDefault();
								onTabChange(tab.id);
							}}
						>
							{tab.text}
						</TabControllerElement>
					);
				})}
			</div>
			{tabs.map((tab: TabProps) => (
				<div
					css={styles.tabPanel}
					role="tabpanel"
					id={`${tab.id}-tab`}
					aria-labelledby={tab.id}
					hidden={!tab.selected}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}

export default Tabs;
