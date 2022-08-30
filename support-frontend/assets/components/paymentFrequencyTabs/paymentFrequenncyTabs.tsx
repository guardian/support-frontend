import { css } from '@emotion/react';
import { focusHalo } from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import type { PaymentFrequencyTabButtonAttributes } from './paymentFrequencyTabButton';
import { PaymentFrequencyTabButton } from './paymentFrequencyTabButton';

const tabListStyles = css`
	display: flex;
`;

const tabPanelStyles = css`
	:focus > * {
		${focusHalo}
	}
`;

export type TabProps = {
	id: string;
	text: string;
	selected: boolean;
	content: ReactNode;
};

export type PaymentFrequencyTabProps = {
	ariaLabel: string;
	tabs: TabProps[];
	onTabChange: (tabId: string) => void;
	TabController: typeof PaymentFrequencyTabButton;
};

function getTabPanelId(tabId: string) {
	return `${tabId}-tab`;
}

function getTabControllerAttributes(
	tab: TabProps,
): PaymentFrequencyTabButtonAttributes {
	return {
		role: 'tab',
		id: tab.id,
		ariaSelected: tab.selected ? 'true' : 'false',
		ariaControls: getTabPanelId(tab.id),
	};
}

export function PaymentFrequencyTabs({
	ariaLabel,
	tabs,
	onTabChange,
	TabController = PaymentFrequencyTabButton,
}: PaymentFrequencyTabProps): JSX.Element {
	return (
		<div>
			<div role="tablist" aria-label={ariaLabel} css={tabListStyles}>
				{tabs.map((tab: TabProps) => {
					return (
						<TabController
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							{...getTabControllerAttributes(tab)}
						>
							{tab.text}
						</TabController>
					);
				})}
			</div>
			{tabs.map((tab: TabProps) => (
				<div
					css={tabPanelStyles}
					role="tabpanel"
					key={getTabPanelId(tab.id)}
					id={getTabPanelId(tab.id)}
					aria-labelledby={tab.id}
					hidden={!tab.selected}
					tabIndex={0}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
