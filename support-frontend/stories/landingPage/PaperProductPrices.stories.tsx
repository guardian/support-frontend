import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import { paperProducts } from '__mocks__/productInfoMocks';
import type { PaperProductPricesProps } from 'pages/paper-subscription-landing/components/paperProductPrices';
import PaperProductPrices from 'pages/paper-subscription-landing/components/paperProductPrices';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/Paper Product Price Cards',
	component: PaperProductPrices,
	argTypes: {},
	decorators: [withCenterAlignment, withSourceReset],
	parameters: {
		docs: {
			description: {
				component:
					'Paper product prices cards for subscribe/paper landing page.',
			},
		},
	},
};

function Template(args: PaperProductPricesProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		background-color: ${palette.brand[400]};
		padding: 25px;
	`;
	return (
		<div css={innerContentContainer}>
			<PaperProductPrices {...args} />;
		</div>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	productPrices: paperProducts,
	tab: 'HomeDelivery',
	setTabAction: () => {},
	abParticipations: {},
};
