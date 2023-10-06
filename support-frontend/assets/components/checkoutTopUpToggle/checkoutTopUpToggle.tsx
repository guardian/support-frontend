import { SvgTickRound } from '@guardian/source-react-components';
import { ToggleSwitch } from '@guardian/source-react-components-development-kitchen';
import type { RegularContributionType } from 'helpers/contributions';
import {
	standfirst,
	title,
	toggleSwitchOverrides,
	topUpToggleContainer,
} from './checkoutTopUpToggleStyles';

const timePeriods = {
	MONTHLY: 'month',
	ANNUAL: 'year',
};

export interface CheckoutTopUpToggleProps {
	isSelected: boolean;
	onChange(): void;
	contributionType: RegularContributionType;
	threshold: number;
}

export function CheckoutTopUpToggle({
	isSelected,
	onChange,
	contributionType,
	threshold = 10,
}: CheckoutTopUpToggleProps): JSX.Element {
	return (
		<section css={topUpToggleContainer}>
			<div>
				<h3 css={title}>
					{isSelected && <SvgTickRound size="xsmall" />}
					{isSelected ? 'All extras unlocked' : 'Want to unlock all extras?'}
				</h3>
				<p css={standfirst}>
					{isSelected
						? `Change your support to £${threshold}/${timePeriods[contributionType]}`
						: `Your support is now £${threshold}/${timePeriods[contributionType]}`}
				</p>
			</div>
			<ToggleSwitch
				onClick={() => onChange()}
				checked={isSelected}
				cssOverrides={toggleSwitchOverrides}
			/>
		</section>
	);
}
