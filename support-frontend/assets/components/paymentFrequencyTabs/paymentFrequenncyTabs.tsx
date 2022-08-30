import { css } from '@emotion/react';
import type { ReactNode } from 'react';
import { PaymentFrequencyTabButton } from './paymentFrequencyTabButton';

const tabListStyles = css`
	display: flex;
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
};

export function PaymentFrequencyTabs({
	ariaLabel,
	tabs,
	onTabChange,
}: PaymentFrequencyTabProps): JSX.Element {
	return (
		<div>
			<div role="tablist" aria-label={ariaLabel} css={tabListStyles}>
				{tabs.map((tab: TabProps) => {
					return (
						<PaymentFrequencyTabButton
							id={tab.id}
							isSelected={tab.selected}
							onClick={(event) => {
								event.preventDefault();
								onTabChange(tab.id);
							}}
						>
							{tab.text}
						</PaymentFrequencyTabButton>
					);
				})}
			</div>
			{tabs.map((tab: TabProps) => (
				<div
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
