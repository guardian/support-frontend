import { css } from '@emotion/react';
import { neutral } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { CheckoutNudgeProps } from 'components/checkoutNudge/checkoutNudge';
import { CheckoutNudge } from 'components/checkoutNudge/checkoutNudge';

export default {
	title: 'Checkouts/Nudge',
	component: CheckoutNudge,
	argTypes: {
		onNudgeClose: { action: 'button clicked' },
		onNudgeClick: { action: 'button clicked' },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container backgroundColor={neutral[97]}>
				<Columns
					collapseUntil="tablet"
					cssOverrides={css`
						justify-content: center;
						padding: 1rem 0;
					`}
				>
					<Column width={[1, 3 / 4, 1 / 2]}>
						<Box>
							<BoxContents>
								<Story />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		),
	],
};

function Template(args: CheckoutNudgeProps) {
	return <CheckoutNudge {...args} />;
}

Template.args = {} as Omit<CheckoutNudgeProps, 'onNudgeClose' | 'onNudgeClick'>;

export const OneOffNudge = Template.bind({});

OneOffNudge.args = {
	contributionType: 'ONE_OFF',
	nudgeDisplay: true,
	nudgeTitle: 'Support us every year',
	nudgeSubtitle: 'for £50 (£1 a week)',
	nudgeParagraph:
		'Funding Guardian journalism every year is great value on a weekly basis. Make a bigger impact today, and protect our independence long term. Please consider annual support.',
	nudgeLinkCopy: 'See annual',
	countryGroupId: 'GBPCountries',
};
