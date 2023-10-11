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
	checked: boolean;
	onChange(): void;
	contributionType: RegularContributionType;
	benefitsThreshold: number;
}

export function CheckoutTopUpToggle({
	checked,
	onChange,
	contributionType,
	benefitsThreshold,
}: CheckoutTopUpToggleProps): JSX.Element {
	return (
		<section css={topUpToggleContainer}>
			<div>
				<h3 css={title}>
					{checked && <SvgTickRound size="xsmall" />}
					{checked ? 'All extras unlocked' : 'Want to unlock all extras?'}
				</h3>
				<p css={standfirst}>
					{checked
						? `Your support is now £${benefitsThreshold}/${timePeriods[contributionType]}`
						: `Change your support to £${benefitsThreshold}/${timePeriods[contributionType]}`}
				</p>
			</div>
			<ToggleSwitch
				onClick={() => onChange()}
				checked={checked}
				cssOverrides={toggleSwitchOverrides}
			/>
		</section>
	);
}
