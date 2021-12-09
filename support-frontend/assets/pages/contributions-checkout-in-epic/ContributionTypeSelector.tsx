import { css } from '@emotion/react';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/src-choice-card';
import { until } from '@guardian/src-foundations/mq';
import type { ContributionType } from 'helpers/contributions';

// ---- Component ---- //

interface ContributionsCheckoutInEpicProps {
	contributionType: ContributionType;
	onSelectContributionType: (contributionType: ContributionType) => void;
}

export function ContributionTypeSelector({
	contributionType,
	onSelectContributionType,
}: ContributionsCheckoutInEpicProps): JSX.Element {
	return (
		<ChoiceCardGroup name="contribution-type" cssOverrides={styles.container}>
			<ChoiceCard
				id="contribution-type-one-off"
				label="Single"
				value="one-off"
				checked={contributionType === 'ONE_OFF'}
				onChange={() => {
					onSelectContributionType('ONE_OFF');
				}}
			/>
			<ChoiceCard
				id="contribution-type-monthly"
				label="Monthly"
				value="monthly"
				checked={contributionType === 'MONTHLY'}
				onChange={() => {
					onSelectContributionType('MONTHLY');
				}}
			/>
			<ChoiceCard
				id="contribution-type-annual"
				label="Annual"
				value="annual"
				checked={contributionType === 'ANNUAL'}
				onChange={() => {
					onSelectContributionType('ANNUAL');
				}}
			/>
		</ChoiceCardGroup>
	);
}

// ---- Styles ---- //

const styles = {
	container: css`
		> div {
			${until.tablet} {
				display: flex;

				label {
					margin: 0 8px 0 0;
				}

				label:last-of-type {
					margin: 0;
				}
			}
		}
	`,
};
